<!--
  组件名称: OwnerDashboardDetail
  用途: 消防维保监管看板二级专题页面，含综合统计看板、隐患与维修清单、合同履约趋势分析
-->
<script setup>
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Bell } from '@element-plus/icons-vue'
import StatsCard from '@/components/StatsCard.vue'
import SysTable from '@/components/SysTable.vue'
import SysButton from '@/components/SysButton.vue'
import SysTag from '@/components/SysTag.vue'
import PageHeader from '@/components/PageHeader.vue'
import SysLineChart from '@/components/SysLineChart.vue'
import SysBarChart from '@/components/SysBarChart.vue'

const router = useRouter()

// ==================== 加载状态 ====================
const pageLoading = ref(true)
setTimeout(() => { pageLoading.value = false }, 600)

// ============================================================
// 筛选器状态
// ============================================================
const timeRange = ref('7')
const levelFilter = ref('all')
const statusFilter = ref('all')
const currentPage = ref(1)
const pageSize = ref(10)

const timeOptions = [
  { label: '近7天', value: '7' },
  { label: '近30天', value: '30' },
  { label: '本年度', value: 'year' },
  { label: '全部历史', value: 'all' },
]

const levelOptions = [
  { label: '全部等级', value: 'all' },
  { label: '重大', value: '重大' },
  { label: '一般', value: '一般' },
]

const statusOptions = [
  { label: '全部状态', value: 'all' },
  { label: '未派单', value: '未派单' },
  { label: '维修中', value: '维修中' },
  { label: '待确认', value: '待确认' },
  { label: '已闭环', value: '已闭环' },
]

// ============================================================
// 隐患数据（按文档4.3节示例数据扩展）
// ============================================================
const allHazards = ref([
  {
    id: 1, level: '重大', description: '3号库烟感探测器故障', time: '2026-01-14 09:30',
    device: '烟感#S023', status: '维修中', responseHours: 3.5, extraCost: 0, hasExtra: false,
  },
  {
    id: 2, level: '一般', description: 'B区灭火器压力不足', time: '2026-01-12 14:15',
    device: '灭火器#M045', status: '已闭环', responseHours: 2.0, extraCost: 0, hasExtra: false,
  },
  {
    id: 3, level: '重大', description: '消防泵房控制柜报警', time: '2026-01-05 08:10',
    device: '控制柜#P01', status: '待确认', responseHours: 1.5, extraCost: 1200, hasExtra: true,
    extraNote: '换继电器',
  },
  {
    id: 4, level: '一般', description: '1号库应急照明灯故障', time: '2026-01-08 10:45',
    device: '应急灯#L012', status: '已闭环', responseHours: 4.2, extraCost: 0, hasExtra: false,
  },
  {
    id: 5, level: '一般', description: '消防通道堆放杂物', time: '2026-01-06 16:30',
    device: '通道C区', status: '已闭环', responseHours: 1.0, extraCost: 0, hasExtra: false,
  },
  {
    id: 6, level: '一般', description: 'A区消防栓接口松动', time: '2025-12-28 11:00',
    device: '消防栓#H008', status: '已闭环', responseHours: 2.8, extraCost: 350, hasExtra: true,
    extraNote: '换接口密封圈',
  },
  {
    id: 7, level: '重大', description: '2号库自动喷淋系统阀门故障', time: '2025-12-20 07:50',
    device: '喷淋阀#V003', status: '已闭环', responseHours: 2.2, extraCost: 800, hasExtra: true,
    extraNote: '换阀门组件',
  },
  {
    id: 8, level: '一般', description: '配电间灭火器过期', time: '2025-12-15 09:00',
    device: '灭火器#M012', status: '已闭环', responseHours: 18.5, extraCost: 0, hasExtra: false,
  },
  {
    id: 9, level: '一般', description: '消防控制室备用电源异常', time: '2025-12-10 13:20',
    device: 'UPS#U001', status: '已闭环', responseHours: 6.0, extraCost: 500, hasExtra: true,
    extraNote: '换蓄电池',
  },
  {
    id: 10, level: '一般', description: '办公楼烟感探测器误报', time: '2025-11-28 14:40',
    device: '烟感#S015', status: '已闭环', responseHours: 1.2, extraCost: 0, hasExtra: false,
  },
  {
    id: 11, level: '一般', description: '仓库防火门闭门器损坏', time: '2025-11-20 10:00',
    device: '防火门#D005', status: '已闭环', responseHours: 8.0, extraCost: 200, hasExtra: true,
    extraNote: '换闭门器',
  },
  {
    id: 12, level: '一般', description: '室外消防栓保温层破损', time: '2025-11-15 08:30',
    device: '消防栓#H022', status: '已闭环', responseHours: 3.0, extraCost: 0, hasExtra: false,
  },
])

// ============================================================
// 筛选后的数据
// ============================================================
const filteredHazards = computed(() => {
  let data = [...allHazards.value]

  // 时间范围筛选（近7天为2026-01-10之后）
  if (timeRange.value === '7') {
    data = data.filter(r => r.time >= '2026-01-10')
  } else if (timeRange.value === '30') {
    data = data.filter(r => r.time >= '2025-12-16')
  } else if (timeRange.value === 'year') {
    data = data.filter(r => r.time >= '2026-01-01')
  }

  // 等级筛选
  if (levelFilter.value !== 'all') {
    data = data.filter(r => r.level === levelFilter.value)
  }

  // 状态筛选
  if (statusFilter.value !== 'all') {
    data = data.filter(r => r.status === statusFilter.value)
  }

  return data
})

const totalCount = computed(() => filteredHazards.value.length)

// ============================================================
// 综合统计看板数据（按文档4.2节）
// ============================================================
const totalTasks = computed(() => {
  if (timeRange.value === '7') return 18
  if (timeRange.value === '30') return 48
  if (timeRange.value === 'year') return 52
  return 120
})

const onTimeRate = computed(() => {
  if (timeRange.value === '7') return 82
  if (timeRange.value === '30') return 87.5
  if (timeRange.value === 'year') return 85
  return 84
})

const totalHiddenCount = computed(() => filteredHazards.value.length)

const criticalCount = computed(() => filteredHazards.value.filter(r => r.level === '重大').length)
const normalCount = computed(() => filteredHazards.value.filter(r => r.level === '一般').length)

const closedCount = computed(() => filteredHazards.value.filter(r => r.status === '已闭环').length)
const closureRate = computed(() => {
  if (totalHiddenCount.value === 0) return '—'
  return Math.round(closedCount.value / totalHiddenCount.value * 100) + '%'
})
const closureRateNum = computed(() => {
  if (totalHiddenCount.value === 0) return 0
  return Math.round(closedCount.value / totalHiddenCount.value * 100)
})

const avgResponseHours = computed(() => {
  if (filteredHazards.value.length === 0) return '—'
  const sum = filteredHazards.value.reduce((s, r) => s + r.responseHours, 0)
  return (sum / filteredHazards.value.length).toFixed(1) + '小时'
})

const totalExtraCost = computed(() => {
  return filteredHazards.value.reduce((s, r) => s + r.extraCost, 0)
})

// ============================================================
// 分页数据
// ============================================================
const pagedHazards = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  return filteredHazards.value.slice(start, start + pageSize.value)
})

const clearPage = () => { currentPage.value = 1 }
watch([timeRange, levelFilter, statusFilter], clearPage)

// ============================================================
// 筛选操作
// ============================================================
const handleSearch = () => { currentPage.value = 1 }
const handleReset = () => {
  levelFilter.value = 'all'
  statusFilter.value = 'all'
  currentPage.value = 1
}

// ============================================================
// 合同履约趋势分析数据（按文档4.5节）
// ============================================================
const trendData = ref([
  { month: '2025-10', onTimeRate: 92, closureRate: 88, avgResponse: 3.2, extraCost: 2100 },
  { month: '2025-11', onTimeRate: 88, closureRate: 82, avgResponse: 4.1, extraCost: 3200 },
  { month: '2025-12', onTimeRate: 85, closureRate: 78, avgResponse: 4.8, extraCost: 4500 },
  { month: '2026-01', onTimeRate: 82, closureRate: 75, avgResponse: 5.2, extraCost: 3850 },
])

// 维保人员到场签到率（按文档4.6节）
const engineerList = ref([
  { name: '李阳', shouldSign: 12, actualSign: 12, rate: 100 },
  { name: '王芳', shouldSign: 10, actualSign: 9, rate: 90 },
  { name: '张伟', shouldSign: 8, actualSign: 6, rate: 75 },
])

// 折线图数据：任务按时完成率 & 隐患闭环率
const trendLineData = computed(() => {
  const result = []
  trendData.value.forEach(d => {
    result.push({ month: d.month, type: '任务按时完成率', value: d.onTimeRate })
    result.push({ month: d.month, type: '隐患闭环率', value: d.closureRate })
  })
  return result
})

// 折线图数据：平均维修响应时长
const responseLineData = computed(() => {
  return trendData.value.map(d => ({
    month: d.month,
    value: d.avgResponse,
  }))
})

// 柱状图数据：合同外费用
const extraCostBarData = computed(() => {
  return trendData.value.map(d => ({
    month: d.month,
    cost: d.extraCost,
  }))
})

// ============================================================
// 表格列配置
// ============================================================
const tableColumns = [
  { prop: 'level', label: '隐患等级', width: 90, slot: 'level' },
  { prop: 'description', label: '隐患描述', minWidth: 200 },
  { prop: 'time', label: '发现时间', width: 150, sortable: true },
  { prop: 'device', label: '关联设备', width: 130 },
  { prop: 'status', label: '当前状态', width: 90, slot: 'status' },
  { prop: 'responseHours', label: '响应时长', width: 100, slot: 'response' },
  { prop: 'extraCost', label: '维修费用（合同外）', width: 150, slot: 'extraCost' },
  { prop: 'action', label: '操作', width: 160, slot: 'action', align: 'center' },
]

const getLevelType = (level) => level === '重大' ? 'danger' : 'warning'

const getStatusType = (status) => {
  if (status === '未派单') return 'danger'
  if (status === '维修中') return 'warning'
  if (status === '待确认') return 'info'
  return 'success'
}

// ============================================================
// 导航 & 操作
// ============================================================
const goToItem = (row) => {
  router.push(`/owner-dashboard/detail/${row.id}`)
}

const handleUrge = (row) => {
  ElMessage.success(`已向维保公司发送催办提醒：「${row.description}」`)
}

const handleConfirm = (row) => {
  ElMessage.success(`已确认闭环：「${row.description}」`)
}
</script>

<template>
  <div class="page-content">
    <!-- ============================================================ -->
    <!-- 页面标题栏 -->
    <!-- ============================================================ -->
    <PageHeader
      title="维保监管详情"
      subtitle="隐患与维修清单 · 合同履约趋势 · 签到率分析"
      show-back
      back-text="返回监管看板"
      back-path="/owner-dashboard"
    />

    <!-- ==================== 骨架屏加载 ==================== -->
    <template v-if="pageLoading">
      <el-skeleton :rows="5" animated class="skeleton-section" />
      <el-skeleton :rows="8" animated class="skeleton-section" />
    </template>

    <template v-else>
      <!-- ============================================================ -->
      <!-- 3.1 综合统计看板 -->
      <!-- ============================================================ -->
      <div class="section">
        <div class="stats-title-row">
          <h3 class="section-title">综合统计看板</h3>
          <div class="stats-title-filter">
            <span class="stats-filter-label">数据范围：</span>
            <el-select v-model="timeRange" size="small" class="time-range-select">
              <el-option v-for="opt in timeOptions" :key="opt.value" :label="opt.label" :value="opt.value" />
            </el-select>
          </div>
        </div>
        <el-row :gutter="16" class="stats-row">
          <el-col class="stats-col">
            <StatsCard type="compact" :value="totalTasks" label="维保任务总数" status="primary" />
          </el-col>
          <el-col class="stats-col">
            <StatsCard
              type="compact"
              :value="onTimeRate + '%'"
              label="按时完成率"
              :status="onTimeRate >= 90 ? 'success' : onTimeRate >= 70 ? 'warning' : 'danger'"
            />
          </el-col>
          <el-col class="stats-col">
            <StatsCard
              type="compact"
              :value="totalHiddenCount"
              label="隐患总数"
              status="primary"
              :tag="`重大${criticalCount}，一般${normalCount}`"
              tag-type="info"
            />
          </el-col>
          <el-col class="stats-col">
            <StatsCard
              type="compact"
              :value="closureRate"
              label="隐患闭环率"
              :progress="closureRateNum"
              :status="closureRateNum >= 90 ? 'success' : closureRateNum >= 70 ? 'warning' : 'danger'"
            />
          </el-col>
          <el-col class="stats-col">
            <StatsCard type="compact" :value="avgResponseHours" label="平均维修响应时长" status="primary" tag="合同要求≤4小时" tag-type="info" />
          </el-col>
          <el-col class="stats-col">
            <StatsCard type="compact" :value="'¥' + totalExtraCost.toLocaleString()" label="合同外维修费用总计" status="warning" tag="需确认" tag-type="warning" />
          </el-col>
        </el-row>
      </div>

      <!-- ============================================================ -->
      <!-- 3.2 隐患与维修清单 -->
      <!-- ============================================================ -->
      <div class="section">
        <div class="section-header">
          <h3 class="section-title">隐患与维修清单（{{ totalCount }} 条）</h3>
        </div>

        <div class="filter-bar">
          <div class="filter-bar-left">
            <span class="filter-label">等级：</span>
            <el-select v-model="levelFilter" placeholder="全部等级" clearable class="filter-select">
              <el-option v-for="opt in levelOptions" :key="opt.value" :label="opt.label" :value="opt.value" />
            </el-select>
            <span class="filter-label">状态：</span>
            <el-select v-model="statusFilter" placeholder="全部状态" clearable class="filter-select">
              <el-option v-for="opt in statusOptions" :key="opt.value" :label="opt.label" :value="opt.value" />
            </el-select>
            <SysButton type="primary" @click="handleSearch">查询</SysButton>
            <SysButton type="default" variant="ghost" @click="handleReset">重置</SysButton>
          </div>
        </div>

        <SysTable
          :data="pagedHazards"
          :columns="tableColumns"
          stripe
          :pagination="{ layout: 'total, sizes, prev, pager, next', pageSize: pageSize }"
          :total="totalCount"
          v-model:current-page="currentPage"
        >
          <!-- 等级插槽 -->
          <template #level="{ row }">
            <SysTag :type="getLevelType(row.level)" size="small">
              {{ row.level }}
            </SysTag>
          </template>

          <!-- 状态插槽 -->
          <template #status="{ row }">
            <SysTag :type="getStatusType(row.status)" size="small">
              {{ row.status }}
            </SysTag>
          </template>

          <!-- 响应时长插槽 -->
          <template #response="{ row }">
            <span :style="{ color: row.responseHours > 4 ? 'var(--color-danger)' : 'var(--text-primary)', fontWeight: row.responseHours > 4 ? 'var(--font-weight-bold)' : 'normal' }">
              {{ row.responseHours }}小时
            </span>
          </template>

          <!-- 费用插槽 -->
          <template #extraCost="{ row }">
            <span v-if="row.extraCost > 0" :style="{ color: 'var(--color-warning)', fontWeight: 'var(--font-weight-bold)' }">
              ¥{{ row.extraCost.toLocaleString() }}（{{ row.extraNote }}）
            </span>
            <span v-else class="text-muted" style="font-size: var(--font-size-xs)">¥0</span>
          </template>

          <!-- 操作插槽 -->
          <template #action="{ row }">
            <div class="action-cell">
              <SysButton type="primary" size="small" variant="ghost" @click="goToItem(row)">
                详情
              </SysButton>
              <SysButton
                v-if="row.status === '待确认'"
                type="success"
                size="small"
                variant="ghost"
                @click="handleConfirm(row)"
                style="margin-left: 4px"
              >
                确认
              </SysButton>
              <SysButton
                v-if="row.status === '维修中' || row.status === '未派单'"
                type="danger"
                size="small"
                variant="ghost"
                @click="handleUrge(row)"
                style="margin-left: 4px"
              >
                催办
              </SysButton>
            </div>
          </template>
        </SysTable>
      </div>

      <!-- ============================================================ -->
      <!-- 3.4 合同履约趋势分析 -->
      <!-- ============================================================ -->
      <div class="section">
        <h3 class="section-title">合同履约趋势分析</h3>

        <el-row :gutter="16">
          <!-- 维保任务按时完成率 & 隐患闭环率 -->
          <el-col :span="12">
            <div class="chart-panel">
              <div class="chart-panel-header">
                <span class="chart-panel-title">完成任务按时完成率 & 隐患闭环率趋势</span>
                <div class="chart-legend">
                  <span class="chart-legend-item">
                    <span class="chart-legend-dot chart-legend-dot--primary"></span>
                    任务按时完成率
                  </span>
                  <span class="chart-legend-item">
                    <span class="chart-legend-dot chart-legend-dot--success"></span>
                    隐患闭环率
                  </span>
                </div>
              </div>
              <div class="chart-body">
                <SysLineChart
                  :data="trendLineData"
                  x-field="month"
                  y-field="value"
                  series-field="type"
                  :colors="['#3678E3', '#059669']"
                  :smooth="true"
                  :point="true"
                  :height="260"
                  :legend="false"
                  :y-formatter="(v) => v + '%'"
                />
              </div>
            </div>
          </el-col>

          <!-- 平均维修响应时长 -->
          <el-col :span="12">
            <div class="chart-panel">
              <div class="chart-panel-header">
                <span class="chart-panel-title">平均维修响应时长（小时）</span>
              </div>
              <div class="chart-body">
                <SysLineChart
                  :data="responseLineData"
                  x-field="month"
                  y-field="value"
                  :smooth="true"
                  :point="true"
                  :colors="['#D97706']"
                  :height="260"
                  :legend="false"
                />
              </div>
            </div>
          </el-col>
        </el-row>

        <el-row :gutter="16" style="margin-top: var(--spacing-md)">
          <!-- 各月合同外费用 -->
          <el-col :span="12">
            <div class="chart-panel">
              <div class="chart-panel-header">
                <span class="chart-panel-title">合同外维修费用（元）</span>
              </div>
              <div class="chart-body">
                <SysBarChart
                  :data="extraCostBarData"
                  x-field="month"
                  y-field="cost"
                  :height="240"
                  :bar-radius="6"
                  :colors="['#D97706']"
                  :legend="false"
                />
              </div>
            </div>
          </el-col>

          <!-- 维保人员到场签到率 -->
          <el-col :span="12">
            <div class="chart-panel">
              <div class="chart-panel-header">
                <span class="chart-panel-title">维保人员到场签到率</span>
              </div>
              <div class="engineer-list">
                <div v-for="eng in engineerList" :key="eng.name" class="engineer-item">
                  <div class="engineer-info">
                    <span class="engineer-name">{{ eng.name }}</span>
                    <span class="engineer-stat">应签到{{ eng.shouldSign }}次 · 实际{{ eng.actualSign }}次</span>
                  </div>
                  <div class="engineer-rate-bar">
                    <div
                      class="engineer-rate-fill"
                      :class="eng.rate >= 95 ? 'fill-success' : eng.rate >= 80 ? 'fill-warning' : 'fill-danger'"
                      :style="{ width: eng.rate + '%' }"
                    ></div>
                  </div>
                  <span
                    class="engineer-rate-value"
                    :style="{ color: eng.rate >= 95 ? 'var(--color-success)' : eng.rate >= 80 ? 'var(--color-warning)' : 'var(--color-danger)' }"
                  >
                    {{ eng.rate }}%
                  </span>
                </div>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>

      <!-- ============================================================ -->
      <!-- 说明提示 -->
      <!-- ============================================================ -->
      <div class="info-tips">
        <el-icon :size="16"><Bell /></el-icon>
        <span class="tips-text">
          <strong>使用说明：</strong>综合统计看板随"数据范围"筛选联动变化；隐患等级"重大"以红色标记，合同外费用需确认；
          响应时长超过合同要求的4小时将红色高亮。趋势图展示近四个月履约质量变化，可切换时间范围查看不同周期数据。
        </span>
      </div>
    </template>
  </div>
</template>

<style scoped>
/* ============================================================
 * 页面整体
 * ============================================================ */
.page-content {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

/* ==================== 骨架屏 ==================== */
.skeleton-section {
  margin-bottom: var(--spacing-lg);
  padding: var(--spacing-lg);
  background: var(--fill-surface);
  border-radius: var(--radius-lg);
}

/* ==================== Section 通用 ==================== */
.section {
  margin-bottom: var(--spacing-lg);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-md);
}

.section-title {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  font-size: var(--font-size-h3);
  font-weight: var(--font-weight-medium);
  color: var(--text-primary);
  margin-bottom: var(--spacing-sm);
}

.section-title::before {
  content: '';
  display: inline-block;
  width: 3px;
  height: 1em;
  background: var(--color-primary);
  border-radius: 2px;
  flex-shrink: 0;
  margin-right: var(--spacing-6);
}

/* ==================== 统计标题行 ==================== */
.stats-title-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-sm);
}

.stats-title-row .section-title {
  margin-bottom: 0;
}

.stats-title-filter {
  display: flex;
  align-items: center;
  gap: var(--spacing-6);
}

.stats-filter-label {
  font-size: var(--font-size-small);
  color: var(--text-secondary);
  white-space: nowrap;
}

.time-range-select {
  width: 120px;
}

/* ==================== 统计卡片区域 ==================== */
.stats-row {
  margin-bottom: 0;
  display: flex;
}

.stats-col {
  flex: 1;
}

/* ==================== 筛选栏 ==================== */
.filter-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-md);
  padding: var(--spacing-8) var(--spacing-md);
  background: var(--fill-surface);
  border-radius: var(--radius-md);
  border: 1px solid var(--border-low);
}

.filter-bar-left {
  display: flex;
  align-items: center;
  gap: var(--spacing-8);
  flex-wrap: wrap;
}

.filter-label {
  font-size: var(--font-size-small);
  color: var(--text-secondary);
  white-space: nowrap;
}

.filter-select {
  width: 130px;
}

/* ==================== 操作按钮组 ==================== */
.action-cell {
  display: flex;
  align-items: center;
  gap: 0;
}

.text-muted {
  color: var(--text-muted);
}

/* ==================== 图表区块 ==================== */
.chart-panel {
  background: var(--fill-surface);
  border-radius: var(--radius-lg);
  border: 1px solid var(--border-default);
  padding: var(--spacing-md);
}

.chart-panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-8);
}

.chart-panel-title {
  font-size: var(--font-size-small);
  font-weight: var(--font-weight-medium);
  color: var(--text-primary);
}

.chart-legend {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.chart-legend-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-4);
  font-size: var(--font-size-xs);
  color: var(--text-secondary);
}

.chart-legend-dot {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.chart-legend-dot--primary { background: #3678E3; }
.chart-legend-dot--success { background: #059669; }
.chart-legend-dot--danger { background: #DC2626; }
.chart-legend-dot--warning { background: #D97706; }

.chart-body {
  width: 100%;
}

/* ==================== 工程师签到率列表 ==================== */
.engineer-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  padding: var(--spacing-sm) 0;
}

.engineer-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.engineer-info {
  display: flex;
  flex-direction: column;
  min-width: 80px;
}

.engineer-name {
  font-size: var(--font-size-small);
  font-weight: var(--font-weight-medium);
  color: var(--text-primary);
}

.engineer-stat {
  font-size: var(--font-size-xs);
  color: var(--text-muted);
}

.engineer-rate-bar {
  flex: 1;
  height: 12px;
  background: var(--fill-hover);
  border-radius: 6px;
  overflow: hidden;
}

.engineer-rate-fill {
  height: 100%;
  border-radius: 6px;
  transition: width 0.6s ease;
}

.fill-success { background: var(--color-success); }
.fill-warning { background: var(--color-warning); }
.fill-danger { background: var(--color-danger); }

.engineer-rate-value {
  font-size: var(--font-size-small);
  font-weight: var(--font-weight-bold);
  min-width: 40px;
  text-align: right;
}

/* ==================== 说明提示 ==================== */
.info-tips {
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-8);
  padding: var(--spacing-md) var(--spacing-lg);
  background: var(--color-info-bg);
  border: 1px solid var(--color-info-border);
  border-radius: var(--radius-md);
  color: var(--color-info);
}

.tips-text {
  font-size: var(--font-size-small);
  line-height: 1.6;
  color: var(--text-secondary);
}
</style>