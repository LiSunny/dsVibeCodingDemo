<script setup>
import { ref, computed, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ArrowLeft, Search } from '@element-plus/icons-vue'
import StatsCard from '@/components/StatsCard.vue'
import SysTable from '@/components/SysTable.vue'
import SysButton from '@/components/SysButton.vue'
import SysTag from '@/components/SysTag.vue'
import PageHeader from '@/components/PageHeader.vue'

const router = useRouter()
const route = useRoute()

// ============================================================
// 筛选器状态
// ============================================================
const timeRange = ref('7')    // 7/30/custom/all
const statusFilter = ref('all') // all/unfix/fixed/overdue
const currentPage = ref(1)
const pageSize = ref(10)

// ============================================================
// 时间筛选选项
// ============================================================
const timeOptions = [
  { label: '近7天', value: '7' },
  { label: '近30天', value: '30' },
  { label: '自定义', value: 'custom' },
  { label: '全部历史', value: 'all' },
]

const statusOptions = [
  { label: '全部', value: 'all' },
  { label: '未整改', value: 'unfix' },
  { label: '已整改', value: 'fixed' },
  { label: '超期', value: 'overdue' },
]

// ============================================================
// 全部隐患数据（示例，约50条）
// ============================================================
const allRisks = ref([])

const generateMockData = () => {
  const units = ['宏达制造', '水利站', '教育办', '城建办', '中石化站点', '华丰建材', '绿源食品', '镇医院', '汽车站', '电力公司']
  const names = [
    '消防通道堵塞', '堤坝裂缝', '燃气泄漏报警器失效', '防雷检测过期',
    '深基坑支护变形', '危化品存储违规', '电路老化隐患', '锅炉压力异常',
    '污水处理泄漏', '建筑脚手架松动', '食品卫生不达标', '医疗废物处置',
    '客运车辆安检过期', '高压线树障', '电梯维保逾期', '消防栓水压不足',
    '安全出口锁闭', '易燃物堆积', '监控设备故障', '应急灯损坏',
    '排污管道破裂', '厂房结构裂缝', '防爆电器失效', '起重机械未年检',
    '消防泵房故障', '疏散指示缺失', '化学品泄漏风险', '地基沉降观测',
    '电缆井积水', '防火门损坏', '喷淋系统失效', '燃气管道腐蚀',
    '施工围挡倾倒', '井盖缺失', '边坡滑坡风险', '桥梁伸缩缝异常',
    '加油站油罐渗漏', '粉尘防爆不足', '有毒气体检测失效', '压力管道老化',
    '消防车通道占用', '应急物资过期', '配电柜超负荷', '冷却塔故障',
    '废水超标排放', '噪声污染', '放射性物质管理', '生物安全柜故障',
  ]
  const list = []
  for (let i = 1; i <= 48; i++) {
    const findDay = 4 + Math.floor(Math.random() * 30)
    const deadlineDay = findDay + 5 + Math.floor(Math.random() * 15)
    const statusRoll = Math.random()
    let status, remainDays
    if (statusRoll < 0.55) {
      status = '已整改'
      remainDays = null
    } else if (statusRoll < 0.8) {
      status = '未整改'
      remainDays = Math.max(-5, 15 - Math.floor(Math.random() * 26))
    } else {
      status = '超期'
      remainDays = -(1 + Math.floor(Math.random() * 30))
    }
    const levelRoll = Math.random()
    const level = levelRoll < 0.15 ? '高' : levelRoll < 0.6 ? '中' : '低'
    list.push({
      id: i,
      name: names[i % names.length],
      findTime: `2026-04-${String(findDay).padStart(2, '0')}`,
      deadline: `2026-05-${String(deadlineDay).padStart(2, '0')}`,
      unit: units[i % units.length],
      level,
      status,
      remainDays,
      person: ['张三', '李四', '王五', '赵六', '陈七', '钱八', '孙九'][i % 7],
      fixDays: status === '已整改' ? (2 + Math.floor(Math.random() * 15)) : null,
    })
  }
  allRisks.value = list
}

generateMockData()

// ============================================================
// 筛选后的数据
// ============================================================
const filteredRisks = computed(() => {
  let data = [...allRisks.value]
  if (statusFilter.value !== 'all') {
    const map = { unfix: '未整改', fixed: '已整改', overdue: '超期' }
    data = data.filter((r) => r.status === map[statusFilter.value])
  }
  return data
})

const totalCount = computed(() => filteredRisks.value.length)
const unfixedCount = computed(() => filteredRisks.value.filter((r) => r.status !== '已整改').length)
const fixedCount = computed(() => filteredRisks.value.filter((r) => r.status === '已整改').length)
const overdueCount = computed(() => filteredRisks.value.filter((r) => r.status === '超期').length)
const fixRate = computed(() => totalCount.value > 0 ? Math.round((fixedCount.value / totalCount.value) * 100) : 0)
const overdueRate = computed(() => unfixedCount.value > 0 ? Math.round((overdueCount.value / unfixedCount.value) * 100) : 0)
const avgFixDays = computed(() => {
  const fixed = filteredRisks.value.filter((r) => r.fixDays !== null)
  return fixed.length > 0 ? (fixed.reduce((s, r) => s + r.fixDays, 0) / fixed.length).toFixed(1) : '—'
})
const highRiskRate = computed(() => {
  const high = filteredRisks.value.filter((r) => r.level === '高').length
  return totalCount.value > 0 ? (high / totalCount.value * 100).toFixed(1) : '0'
})

// ============================================================
// 分页数据
// ============================================================
const pagedRisks = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  return filteredRisks.value.slice(start, start + pageSize.value)
})

const clearPage = () => { currentPage.value = 1 }
watch([timeRange, statusFilter], clearPage)

// ============================================================
// 历史趋势数据（按周）
// ============================================================
const trendData = ref([
  { label: '4月W1', newRisks: 14, fixed: 11 },
  { label: '4月W2', newRisks: 16, fixed: 10 },
  { label: '4月W3', newRisks: 18, fixed: 12 },
  { label: '4月W4', newRisks: 12, fixed: 9 },
  { label: '5月W1', newRisks: 20, fixed: 10 },
  { label: '5月W2', newRisks: 15, fixed: 8 },
])

const maxTrendVal = computed(() => {
  let max = 0
  trendData.value.forEach((d) => { max = Math.max(max, d.newRisks + d.fixed) })
  return max || 1
})

// ============================================================
// 责任单位排名
// ============================================================
const unitRank = computed(() => {
  const map = {}
  filteredRisks.value.forEach((r) => {
    if (!map[r.unit]) map[r.unit] = { unit: r.unit, unfix: 0, total: 0, totalDays: 0, fixedCount: 0 }
    map[r.unit].total++
    if (r.status !== '已整改') map[r.unit].unfix++
    if (r.fixDays !== null) {
      map[r.unit].totalDays += r.fixDays
      map[r.unit].fixedCount++
    }
  })
  return Object.values(map)
    .map((u) => ({ ...u, avgDays: u.fixedCount > 0 ? (u.totalDays / u.fixedCount).toFixed(1) : '—' }))
    .sort((a, b) => b.unfix - a.unfix)
})

// ============================================================
// 隐患类型分布
// ============================================================
const typeDist = computed(() => {
  const categories = { '消防': 0, '安全': 0, '环保': 0, '其他': 0 }
  filteredRisks.value.forEach((r, i) => {
    if (i % 4 === 0) categories['消防']++
    else if (i % 4 === 1) categories['安全']++
    else if (i % 4 === 2) categories['环保']++
    else categories['其他']++
  })
  return Object.entries(categories).map(([name, count]) => ({ name, count }))
})

const levelCompare = computed(() => {
  const levels = { '高': { total: 0, fixed: 0 }, '中': { total: 0, fixed: 0 }, '低': { total: 0, fixed: 0 } }
  filteredRisks.value.forEach((r) => {
    levels[r.level].total++
    if (r.status === '已整改') levels[r.level].fixed++
  })
  return Object.entries(levels).map(([name, d]) => ({
    name,
    rate: d.total > 0 ? Math.round((d.fixed / d.total) * 100) : 0,
  }))
})

// ============================================================
// 表格列配置
// ============================================================
const tableColumns = [
  { prop: 'name', label: '隐患名称', minWidth: 180 },
  { prop: 'findTime', label: '发现时间', width: 110 },
  { prop: 'deadline', label: '整改期限', width: 110, sortable: true },
  { prop: 'unit', label: '责任单位', width: 120 },
  { prop: 'level', label: '等级', width: 70, slot: 'level' },
  { prop: 'status', label: '状态', width: 80, slot: 'status' },
  { prop: 'remainDaysText', label: '剩余/超期', width: 110, slot: 'remain' },
  { prop: 'person', label: '整改负责人', width: 100 },
  { prop: 'action', label: '操作', width: 140, slot: 'action', align: 'center' },
]

const computedTable = computed(() =>
  pagedRisks.value.map((r) => ({
    ...r,
    remainDaysText: r.status === '已整改'
      ? '—'
      : r.remainDays < 0
        ? `超期${Math.abs(r.remainDays)}天`
        : r.remainDays === 0
          ? '今日到期'
          : `剩余${r.remainDays}天`,
  }))
)

// ============================================================
// 操作
// ============================================================
const handleUrge = (row) => {
  ElMessage.success(`已向「${row.unit}」发送催办提醒`)
}

const handleViewItem = (row) => {
  router.push(`/risk-monitor/detail/${row.id}`)
}

const goBack = () => {
  router.push('/risk-monitor')
}

const handlePageChange = (page) => {
  currentPage.value = page
}

const handleSizeChange = (size) => {
  pageSize.value = size
  currentPage.value = 1
}

const getRemainType = (row) => {
  if (row.status === '已整改') return ''
  if (row.remainDays < 0) return 'danger'
  if (row.remainDays === 0) return 'warning'
  return 'default'
}
</script>

<template>
  <div class="page-content">
    <!-- ============================================================ -->
    <!-- 页面标题栏 -->
    <!-- ============================================================ -->
    <PageHeader
      title="隐患舆情监测 · 专题分析"
      show-back
      back-text="返回一级页面"
      back-path="/risk-monitor"
    />

    <!-- ============================================================ -->
    <!-- 筛选器 -->
    <!-- ============================================================ -->
    <div class="filter-bar">
      <div class="filter-group">
        <span class="filter-label">时间范围：</span>
        <el-radio-group v-model="timeRange" size="small">
          <el-radio-button v-for="opt in timeOptions" :key="opt.value" :value="opt.value">
            {{ opt.label }}
          </el-radio-button>
        </el-radio-group>
      </div>
      <div class="filter-group">
        <span class="filter-label">状态：</span>
        <el-select v-model="statusFilter" size="small" style="width: 120px">
          <el-option v-for="opt in statusOptions" :key="opt.value" :label="opt.label" :value="opt.value" />
        </el-select>
      </div>
    </div>

    <!-- ============================================================ -->
    <!-- 3.1 综合统计看板 -->
    <!-- ============================================================ -->
    <el-row :gutter="16" class="stats-row">
      <el-col :span="4">
        <StatsCard type="compact" :value="totalCount" label="隐患总数" status="primary" />
      </el-col>
      <el-col :span="4">
        <StatsCard type="compact" :value="unfixedCount" label="未整改数" status="warning" />
      </el-col>
      <el-col :span="4">
        <StatsCard type="compact" :value="fixedCount" label="已整改数" status="success" />
      </el-col>
      <el-col :span="4">
        <StatsCard type="compact" :value="fixRate" label="整体整改率" :progress="fixRate" />
      </el-col>
      <el-col :span="4">
        <StatsCard type="compact" :value="overdueCount" label="超期未改数" status="danger" :progress="overdueRate" tag="超期" tag-type="danger" />
      </el-col>
      <el-col :span="4">
        <StatsCard type="compact" :value="avgFixDays" label="平均整改时长(天)" status="primary" :progress="Math.min(100, Math.round((Number(avgFixDays) || 0) / 15 * 100))" tag="仅已整改" tag-type="info" />
      </el-col>
    </el-row>

    <el-row :gutter="24" class="stats-row" style="margin-top: 8px">
      <el-col :span="12">
        <StatsCard type="compact" :value="overdueRate + '%'" label="超期率" status="danger" :progress="overdueRate" tag="超期/未改" tag-type="danger" />
      </el-col>
      <el-col :span="12">
        <StatsCard type="compact" :value="highRiskRate + '%'" label="高风险隐患占比" status="danger" :progress="Math.round(Number(highRiskRate))" tag="高/总数" tag-type="danger" />
      </el-col>
    </el-row>

    <!-- ============================================================ -->
    <!-- 3.2 隐患列表 -->
    <!-- ============================================================ -->
    <div class="section-card">
      <div class="section-header">
        <h2>隐患列表（{{ totalCount }} 条）</h2>
      </div>
      <SysTable
        :data="computedTable"
        :columns="tableColumns"
        :pagination="true"
        :total="totalCount"
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        @current-change="handlePageChange"
        @size-change="handleSizeChange"
      >
        <template #level="{ row }">
          <el-tag
            :type="row.level === '高' ? 'danger' : row.level === '中' ? 'warning' : 'info'"
            size="small"
            effect="dark"
          >
            {{ row.level }}
          </el-tag>
        </template>
        <template #status="{ row }">
          <el-tag
            :type="row.status === '已整改' ? 'success' : row.status === '超期' ? 'danger' : 'warning'"
            size="small"
            effect="dark"
          >
            {{ row.status }}
          </el-tag>
        </template>
        <template #remain="{ row }">
          <SysTag v-if="row.status !== '已整改'" :type="getRemainType(row)">
            {{ row.remainDaysText }}
          </SysTag>
          <span v-else class="text-muted">—</span>
        </template>
        <template #action="{ row }">
          <SysButton type="primary" size="small" @click="handleViewItem(row)">
            详情
          </SysButton>
          <SysButton
            v-if="row.status !== '已整改'"
            type="danger"
            size="small"
            @click="handleUrge(row)"
            style="margin-left: 4px"
          >
            催办
          </SysButton>
        </template>
      </SysTable>
    </div>

    <!-- ============================================================ -->
    <!-- 3.4 历史趋势与效率分析 -->
    <!-- ============================================================ -->
    <div class="analysis-grid">
      <!-- 新增 vs 整改完成 堆积柱状图 -->
      <div class="section-card chart-card">
        <div class="section-header"><h2>新增隐患 vs 整改完成（按周）</h2></div>
        <div class="chart-bar-group">
          <div v-for="d in trendData" :key="d.label" class="bar-col">
            <div class="bar-stack">
              <div class="bar-new" :style="{ height: (d.newRisks / maxTrendVal * 100) + '%' }">
                <span class="bar-val">{{ d.newRisks }}</span>
              </div>
              <div class="bar-fixed" :style="{ height: (d.fixed / maxTrendVal * 100) + '%' }">
                <span class="bar-val">{{ d.fixed }}</span>
              </div>
            </div>
            <span class="bar-label">{{ d.label }}</span>
          </div>
        </div>
        <div class="chart-legend">
          <span class="legend-item"><span class="legend-dot new"></span>新增隐患</span>
          <span class="legend-item"><span class="legend-dot fixed"></span>整改完成</span>
        </div>
      </div>

      <!-- 整改率变化趋势 -->
      <div class="section-card chart-card">
        <div class="section-header"><h2>整改率变化趋势</h2></div>
        <div class="chart-line-group">
          <div v-for="d in trendData" :key="d.label" class="line-col">
            <div class="line-track">
              <div
                class="line-fill"
                :style="{ height: (d.fixed / (d.newRisks + d.fixed || 1) * 100) + '%' }"
              ></div>
            </div>
            <span class="line-pct">{{ Math.round(d.fixed / (d.newRisks + d.fixed || 1) * 100) }}%</span>
            <span class="bar-label">{{ d.label }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 责任单位排名 + 隐患类型分析 -->
    <div class="analysis-grid">
      <!-- 责任单位排名 -->
      <div class="section-card">
        <div class="section-header"><h2>责任单位整改排名（未整改数倒序）</h2></div>
        <SysTable
          :data="unitRank"
          :columns="[
            { prop: 'unit', label: '责任单位', minWidth: 120 },
            { prop: 'unfix', label: '未整改数', width: 100 },
            { prop: 'avgDays', label: '平均整改时长(天)', width: 140 },
          ]"
          :pagination="false"
          :bordered="true"
        />
      </div>

      <!-- 隐患类型 + 等级对比 -->
      <div class="section-card">
        <div class="section-header"><h2>隐患类型 & 等级整改率</h2></div>
        <div class="mini-dist">
          <div class="dist-row" v-for="t in typeDist" :key="t.name">
            <span class="dist-label">{{ t.name }}</span>
            <div class="dist-bar-bg">
              <div class="dist-bar-fill" :style="{ width: (t.count / (totalCount || 1) * 100) + '%' }"></div>
            </div>
            <span class="dist-num">{{ t.count }}</span>
          </div>
        </div>
        <div class="level-compare" style="margin-top: 16px">
          <div class="level-row" v-for="l in levelCompare" :key="l.name">
            <span class="level-label">{{ l.name }}风险</span>
            <div class="dist-bar-bg">
              <div class="dist-bar-fill level" :style="{ width: l.rate + '%' }"></div>
            </div>
            <span class="dist-num">{{ l.rate }}%</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.page-content {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-16);
}

/* ============================================================
 * 页面标题栏
 * ============================================================ */
.page-titlebar {
  display: flex;
  align-items: center;
  gap: var(--spacing-16);
}

.page-titlebar h1 {
  font-size: var(--font-size-h3);
  font-weight: var(--font-weight-medium);
  color: var(--text-primary);
  margin: 0;
}

/* ============================================================
 * 筛选器
 * ============================================================ */
.filter-bar {
  display: flex;
  align-items: center;
  gap: var(--spacing-24);
  padding: var(--spacing-12) var(--spacing-16);
  background: var(--fill-surface);
  border-radius: var(--radius-md);
  border: 1px solid var(--border-low);
}

.filter-group {
  display: flex;
  align-items: center;
  gap: var(--spacing-8);
}

.filter-label {
  font-size: var(--font-size-small);
  color: var(--text-secondary);
  white-space: nowrap;
}

/* ============================================================
 * 统计行
 * ============================================================ */
.stats-row {
  margin-bottom: 0;
}

/* ============================================================
 * 区块卡片
 * ============================================================ */
.section-card {
  background: var(--fill-surface);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  padding: var(--spacing-16);
  border: 1px solid var(--border-low);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-12);
}

.section-header h2 {
  font-size: var(--font-size-body);
  font-weight: var(--font-weight-medium);
  color: var(--text-primary);
  margin: 0;
}

.text-muted {
  color: var(--text-muted);
  font-size: var(--font-size-small);
}

/* ============================================================
 * 分析布局
 * ============================================================ */
.analysis-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-16);
}

.chart-card {
  min-height: 280px;
}

/* ============================================================
 * 柱状图
 * ============================================================ */
.chart-bar-group {
  display: flex;
  align-items: flex-end;
  justify-content: space-around;
  height: 200px;
  padding: 0 var(--spacing-8);
}

.bar-col {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-4);
  flex: 1;
}

.bar-stack {
  width: 36px;
  height: 100%;
  display: flex;
  flex-direction: column-reverse;
  border-radius: var(--radius-xs) var(--radius-xs) 0 0;
  overflow: hidden;
}

.bar-new {
  background: var(--color-danger);
  display: flex;
  align-items: flex-start;
  justify-content: center;
  transition: height 0.4s ease;
  min-height: 0;
}

.bar-fixed {
  background: var(--color-success);
  display: flex;
  align-items: flex-start;
  justify-content: center;
  transition: height 0.4s ease;
  min-height: 0;
}

.bar-val {
  font-size: 10px;
  color: var(--text-inverse);
  font-weight: var(--font-weight-bold);
  padding-top: 2px;
}

.bar-label {
  font-size: var(--font-size-xs);
  color: var(--text-muted);
}

.chart-legend {
  display: flex;
  justify-content: center;
  gap: var(--spacing-16);
  margin-top: var(--spacing-8);
}

.legend-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-4);
  font-size: var(--font-size-xs);
  color: var(--text-secondary);
}

.legend-dot {
  width: 10px;
  height: 10px;
  border-radius: 2px;
}

.legend-dot.new { background: var(--color-danger); }
.legend-dot.fixed { background: var(--color-success); }

/* ============================================================
 * 整改率趋势线图
 * ============================================================ */
.chart-line-group {
  display: flex;
  align-items: flex-end;
  justify-content: space-around;
  height: 200px;
  padding: 0 var(--spacing-8);
}

.line-col {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-4);
  flex: 1;
}

.line-track {
  width: 24px;
  height: 140px;
  background: var(--fill-secondary);
  border-radius: var(--radius-sm);
  display: flex;
  flex-direction: column-reverse;
  overflow: hidden;
}

.line-fill {
  background: var(--color-primary);
  border-radius: 0 0 var(--radius-sm) var(--radius-sm);
  transition: height 0.4s ease;
  min-height: 4px;
}

.line-pct {
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-bold);
  color: var(--text-primary);
}

/* ============================================================
 * 横向分布条
 * ============================================================ */
.mini-dist {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-8);
}

.dist-row, .level-row {
  display: flex;
  align-items: center;
  gap: var(--spacing-8);
}

.dist-label, .level-label {
  width: 50px;
  font-size: var(--font-size-xs);
  color: var(--text-secondary);
  flex-shrink: 0;
}

.level-label {
  width: 60px;
}

.dist-bar-bg {
  flex: 1;
  height: 12px;
  background: var(--fill-secondary);
  border-radius: var(--radius-xs);
  overflow: hidden;
}

.dist-bar-fill {
  height: 100%;
  background: var(--color-primary);
  border-radius: var(--radius-xs);
  transition: width 0.4s ease;
}

.dist-bar-fill.level {
  background: var(--color-success);
}

.dist-num {
  width: 36px;
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
  color: var(--text-primary);
  text-align: right;
  flex-shrink: 0;
}

@media (max-width: 1200px) {
  .analysis-grid {
    grid-template-columns: 1fr;
  }
}
</style>