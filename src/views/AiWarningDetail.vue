<!--
  组件名称: AiWarningDetail
  用途: 模块3 - 安消应AI预警二级专题页面，含综合统计看板、预警事件列表、历史趋势分析
-->
<script setup>
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { WarningFilled } from '@element-plus/icons-vue'
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
const timeRange = ref('today')
const statusFilter = ref('all')
const typeFilter = ref('all')
const siteFilter = ref('all')
const currentPage = ref(1)
const pageSize = ref(10)

const timeOptions = [
  { label: '今日', value: 'today' },
  { label: '近7天', value: '7' },
  { label: '近30天', value: '30' },
  { label: '自定义', value: 'custom' },
  { label: '全部历史', value: 'all' },
]

const statusOptions = [
  { label: '全部', value: 'all' },
  { label: '未处理', value: 'unprocessed' },
  { label: '处理中', value: 'processing' },
  { label: '已闭环', value: 'closed' },
  { label: '误报', value: 'false_alarm' },
]

const typeOptions = [
  { label: '全部类型', value: 'all' },
  { label: '火情', value: '火情' },
  { label: '烟雾', value: '烟雾' },
  { label: '违规闯入', value: '违规闯入' },
  { label: '异常聚集', value: '异常聚集' },
  { label: '未戴安全帽', value: '未戴安全帽' },
]

const siteOptions = [
  { label: '全部点位', value: 'all' },
  { label: '石化园区储罐区', value: '石化园区储罐区' },
  { label: '宏达制造车间', value: '宏达制造车间' },
  { label: '学校周界', value: '学校周界' },
  { label: '建筑工地', value: '建筑工地' },
  { label: '河道北段', value: '河道北段' },
]

// ============================================================
// 全部预警数据生成
// ============================================================
const allAlerts = ref([])

const generateMockData = () => {
  const types = ['火情', '烟雾', '违规闯入', '异常聚集', '未戴安全帽']
  const sites = ['石化园区储罐区', '宏达制造车间', '学校周界', '建筑工地', '河道北段']
  const cameraIds = ['CAM-101', 'CAM-102', 'CAM-201', 'CAM-305', 'CAM-408', 'CAM-501']
  const processors = ['—', '张三', '李四', '王五', '赵六']
  const statuses = ['未处理', '处理中', '已闭环', '误报']

  const list = []
  for (let i = 1; i <= 86; i++) {
    const day = 4 + Math.floor(Math.random() * 8)
    const hour = String(Math.floor(Math.random() * 24)).padStart(2, '0')
    const min = String(Math.floor(Math.random() * 60)).padStart(2, '0')
    const sec = String(Math.floor(Math.random() * 60)).padStart(2, '0')
    const status = statuses[Math.floor(Math.random() * statuses.length)]
    const type = types[Math.floor(Math.random() * types.length)]
    const site = sites[Math.floor(Math.random() * sites.length)]
    const confidence = 65 + Math.floor(Math.random() * 34)
    const responseMin = status === '已闭环' ? (1 + Math.random() * 15).toFixed(1) : null
    const disposeMin = status === '已闭环' ? (5 + Math.random() * 60).toFixed(0) : null
    const isFalseAlarm = status === '误报'

    list.push({
      id: i,
      time: `2026-05-${String(day).padStart(2, '0')} ${hour}:${min}:${sec}`,
      type,
      site,
      cameraId: cameraIds[i % cameraIds.length],
      status,
      confidence,
      processor: status === '未处理' ? '—' : processors[i % processors.length],
      responseMin,
      disposeMin,
      isFalseAlarm,
      hasSnapshot: !isFalseAlarm,
      desc: isFalseAlarm
        ? '经人工核实为误报'
        : `${type}事件，AI检测置信度${confidence}%`,
    })
  }
  // 排序：按时间倒序
  list.sort((a, b) => b.time.localeCompare(a.time))
  allAlerts.value = list
}

generateMockData()

// ============================================================
// 筛选后的数据
// ============================================================
const filteredAlerts = computed(() => {
  let data = [...allAlerts.value]

  // 时间范围筛选
  if (timeRange.value === 'today') {
    data = data.filter(r => r.time.startsWith('2026-05-11'))
  } else if (timeRange.value === '7') {
    data = data.filter(r => {
      const d = parseInt(r.time.substring(8, 10))
      return d >= 5 && d <= 11
    })
  }

  // 状态筛选
  if (statusFilter.value !== 'all') {
    const map = { unprocessed: '未处理', processing: '处理中', closed: '已闭环', false_alarm: '误报' }
    data = data.filter(r => r.status === map[statusFilter.value])
  }

  // 类型筛选
  if (typeFilter.value !== 'all') {
    data = data.filter(r => r.type === typeFilter.value)
  }

  // 点位筛选
  if (siteFilter.value !== 'all') {
    data = data.filter(r => r.site === siteFilter.value)
  }

  return data
})

// ============================================================
// 综合统计看板数据
// ============================================================
const totalCount = computed(() => filteredAlerts.value.length)
const unprocessedCount = computed(() => filteredAlerts.value.filter(r => r.status === '未处理').length)
const processingCount = computed(() => filteredAlerts.value.filter(r => r.status === '处理中').length)
const closedCount = computed(() => filteredAlerts.value.filter(r => r.status === '已闭环').length)
const falseAlarmCount = computed(() => filteredAlerts.value.filter(r => r.status === '误报').length)

const avgResponseMin = computed(() => {
  const withResponse = filteredAlerts.value.filter(r => r.responseMin !== null)
  if (withResponse.length === 0) return '—'
  return (withResponse.reduce((s, r) => s + parseFloat(r.responseMin), 0) / withResponse.length).toFixed(1) + '分钟'
})

const avgDisposeMin = computed(() => {
  const withDispose = filteredAlerts.value.filter(r => r.disposeMin !== null)
  if (withDispose.length === 0) return '—'
  return (withDispose.reduce((s, r) => s + parseInt(r.disposeMin), 0) / withDispose.length).toFixed(0) + '分钟'
})

const aiAccuracy = computed(() => {
  if (totalCount.value === 0) return '—'
  const accurate = totalCount.value - falseAlarmCount.value
  return (accurate / totalCount.value * 100).toFixed(1) + '%'
})

const aiAccuracyNum = computed(() => {
  if (totalCount.value === 0) return 0
  return Math.round((totalCount.value - falseAlarmCount.value) / totalCount.value * 100)
})

// 高频预警类型Top3
const topTypes = computed(() => {
  const map = {}
  filteredAlerts.value.forEach(r => {
    if (!map[r.type]) map[r.type] = 0
    map[r.type]++
  })
  return Object.entries(map)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([name, count]) => ({ name, count }))
})

// ============================================================
// 分页数据
// ============================================================
const pagedAlerts = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  return filteredAlerts.value.slice(start, start + pageSize.value)
})

const clearPage = () => { currentPage.value = 1 }
watch([timeRange, statusFilter, typeFilter, siteFilter], clearPage)

// ============================================================
// 筛选操作
// ============================================================
const handleSearch = () => {
  currentPage.value = 1
}

const handleReset = () => {
  typeFilter.value = 'all'
  siteFilter.value = 'all'
  statusFilter.value = 'all'
  currentPage.value = 1
}

// ============================================================
// 历史趋势数据（按日，近7天）
// ============================================================
const trendData = ref([
  { label: '05-05', total: 9, falseAlarm: 1, accuracy: 88.9, avgResponse: 5.2 },
  { label: '05-06', total: 14, falseAlarm: 3, accuracy: 78.6, avgResponse: 6.1 },
  { label: '05-07', total: 11, falseAlarm: 0, accuracy: 100, avgResponse: 3.8 },
  { label: '05-08', total: 16, falseAlarm: 2, accuracy: 87.5, avgResponse: 4.5 },
  { label: '05-09', total: 13, falseAlarm: 1, accuracy: 92.3, avgResponse: 4.0 },
  { label: '05-10', total: 10, falseAlarm: 2, accuracy: 80.0, avgResponse: 5.7 },
  { label: '05-11', total: 12, falseAlarm: 1, accuracy: 91.7, avgResponse: 4.3 },
])

const maxTrendVal = computed(() => {
  let max = 0
  trendData.value.forEach(d => { max = Math.max(max, d.total) })
  return max || 1
})

// ============================================================
// 点位预警数量排名（基于筛选后数据）
// ============================================================
const siteRank = computed(() => {
  const map = {}
  filteredAlerts.value.forEach(r => {
    if (!map[r.site]) map[r.site] = { site: r.site, total: 0, unprocessed: 0, types: {} }
    map[r.site].total++
    if (r.status === '未处理') map[r.site].unprocessed++
    if (!map[r.site].types[r.type]) map[r.site].types[r.type] = 0
    map[r.site].types[r.type]++
  })
  return Object.values(map)
    .map(s => {
      const topTypes = Object.entries(s.types)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([name, count]) => `${name}(${count})`)
      return { ...s, mainTypes: topTypes.join('、') }
    })
    .sort((a, b) => b.total - a.total)
})

// ============================================================
// 预警类型分布（饼图数据用水平条展示）
// ============================================================
const typeDistribution = computed(() => {
  const map = {}
  filteredAlerts.value.forEach(r => {
    if (!map[r.type]) map[r.type] = { name: r.type, count: 0, closedCount: 0 }
    map[r.type].count++
    if (r.status === '已闭环') map[r.type].closedCount++
  })
  return Object.values(map)
    .sort((a, b) => b.count - a.count)
    .map(t => ({
      ...t,
      completionRate: t.count > 0 ? Math.round(t.closedCount / t.count * 100) : 0,
    }))
})

const maxTypeVal = computed(() => Math.max(...typeDistribution.value.map(t => t.count), 1))

// ============================================================
// 摄像头在线率（模拟数据）
// ============================================================
const cameraHealth = ref([
  { site: '石化园区储罐区', total: 4, online: 3 },
  { site: '宏达制造车间', total: 6, online: 5 },
  { site: '学校周界', total: 4, online: 4 },
  { site: '建筑工地', total: 3, online: 2 },
  { site: '河道北段', total: 3, online: 3 },
])

// ============================================================
// 表格列配置
// ============================================================
const tableColumns = [
  { prop: 'time', label: '预警时间', width: 160, sortable: true },
  { prop: 'type', label: '预警类型', width: 110, slot: 'type' },
  { prop: 'site', label: '发生点位', minWidth: 140 },
  { prop: 'snapshot', label: '预警截图', width: 80, slot: 'snapshot' },
  { prop: 'status', label: '状态', width: 90, slot: 'status' },
  { prop: 'confidence', label: 'AI置信度', width: 100, slot: 'confidence' },
  { prop: 'processor', label: '处置人', width: 80 },
  { prop: 'action', label: '操作', width: 140, slot: 'action', align: 'center' },
]

const getStatusType = (status) => {
  if (status === '未处理') return 'danger'
  if (status === '处理中') return 'warning'
  if (status === '已闭环') return 'success'
  return 'info'
}

const getConfidenceType = (val) => {
  if (val >= 90) return 'success'
  if (val >= 80) return 'warning'
  return 'danger'
}

const getTypeTag = (type) => {
  if (type === '火情') return 'danger'
  if (type === '烟雾') return 'warning'
  if (type === '违规闯入') return 'info'
  if (type === '异常聚集') return 'danger'
  return 'primary'
}

// ============================================================
// 导航 & 操作
// ============================================================
const goToItem = (row) => {
  router.push(`/ai-warning/detail/${row.id}`)
}

const handleProcess = (row) => {
  ElMessage.success(`已为「${row.type}」预警创建处置工单，即将派发`)
}

const goBack = () => {
  router.push('/ai-warning')
}

// ============================================================
// 历史趋势分析 - 图表数据转换（符合 SysLineChart/SysBarChart 规范格式）
// ============================================================

// 折线图数据：每日预警总数 & 误报数
const lineChartData = computed(() => {
  const result = []
  trendData.value.forEach(d => {
    result.push({ day: d.label, type: '预警总数', value: d.total })
    result.push({ day: d.label, type: '误报数', value: d.falseAlarm })
  })
  return result
})

// 折线图数据：AI识别准确率趋势
const accuracyLineData = computed(() => {
  return trendData.value.map(d => ({
    day: d.label,
    accuracy: d.accuracy,
  }))
})

// 柱状图数据：预警类型占比
const typeBarData = computed(() => {
  return typeDistribution.value.map(t => ({
    name: t.name,
    count: t.count,
  }))
})
</script>

<template>
  <div class="page-content">
    <!-- ============================================================ -->
    <!-- 页面标题栏 -->
    <!-- ============================================================ -->
    <PageHeader
      title="安消应AI预警 · 专题分析"
      show-back
      back-text="返回一级页面"
      back-path="/ai-warning"
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
            <StatsCard type="compact" :value="totalCount" label="预警事件总数" status="primary" />
          </el-col>
          <el-col class="stats-col">
            <StatsCard type="compact" :value="unprocessedCount" label="未处理数" status="danger" tag="需处置" tag-type="danger" />
          </el-col>
          <el-col class="stats-col">
            <StatsCard type="compact" :value="processingCount" label="处理中数" status="warning" />
          </el-col>
          <el-col class="stats-col">
            <StatsCard type="compact" :value="closedCount" label="已闭环数" status="success" />
          </el-col>
          <el-col class="stats-col">
            <StatsCard type="compact" :value="avgResponseMin" label="平均响应时长" status="primary" tag="仅已处理" tag-type="info" />
          </el-col>
          <el-col class="stats-col">
            <StatsCard type="compact" :value="avgDisposeMin" label="平均处置时长" status="primary" tag="仅已闭环" tag-type="info" />
          </el-col>
          <el-col class="stats-col">
            <StatsCard type="compact" :value="aiAccuracy" label="AI识别准确率" :progress="aiAccuracyNum" />
          </el-col>
          <el-col class="stats-col stats-col--wide">
            <div class="top-types-card">
              <div class="top-types-header">
                <span class="top-types-title">高频预警Top3</span>
              </div>
              <div class="top-types-list">
                <div v-for="(t, idx) in topTypes" :key="t.name" class="top-type-item">
                  <span class="top-type-rank" :class="`rank-${idx + 1}`">#{{ idx + 1 }}</span>
                  <span class="top-type-name">{{ t.name }}</span>
                  <span class="top-type-count">{{ t.count }}次</span>
                </div>
                <div v-if="topTypes.length === 0" class="top-type-empty">暂无数据</div>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>

      <!-- ============================================================ -->
      <!-- 3.2 预警事件列表 -->
      <!-- ============================================================ -->
      <div class="section">
        <div class="section-header">
          <h3 class="section-title">预警事件列表（{{ totalCount }} 条）</h3>
        </div>
      <div class="filter-bar">
        <div class="filter-bar-left">
          <span class="filter-label">类型：</span>
          <el-select v-model="typeFilter" placeholder="全部" clearable class="filter-select">
            <el-option v-for="opt in typeOptions" :key="opt.value" :label="opt.label" :value="opt.value" />
          </el-select>
          <span class="filter-label">点位：</span>
          <el-select v-model="siteFilter" placeholder="全部" clearable class="filter-select">
            <el-option v-for="opt in siteOptions" :key="opt.value" :label="opt.label" :value="opt.value" />
          </el-select>
          <span class="filter-label">状态：</span>
          <el-select v-model="statusFilter" placeholder="全部" clearable class="filter-select">
            <el-option v-for="opt in statusOptions" :key="opt.value" :label="opt.label" :value="opt.value" />
          </el-select>
          <SysButton type="primary" @click="handleSearch">查询</SysButton>
          <SysButton type="default" variant="ghost" @click="handleReset">重置</SysButton>
        </div>
      </div>

        <SysTable
          :data="pagedAlerts"
          :columns="tableColumns"
          stripe
          :pagination="{ layout: 'total, sizes, prev, pager, next', pageSize: pageSize }"
          :total="totalCount"
          v-model:current-page="currentPage"
        >
          <template #type="{ row }">
            <SysTag :type="getTypeTag(row.type)" size="small">
              {{ row.type }}
            </SysTag>
          </template>

          <template #snapshot="{ row }">
            <SysTag v-if="row.hasSnapshot" type="info" size="mini" variant="outline">截图</SysTag>
            <span v-else class="text-muted" style="font-size: var(--font-size-xs)">—</span>
          </template>

          <template #status="{ row }">
            <SysTag :type="getStatusType(row.status)" size="small">
              {{ row.status }}
            </SysTag>
          </template>

          <template #confidence="{ row }">
            <SysTag :type="getConfidenceType(row.confidence)" size="small">
              {{ row.confidence }}%
            </SysTag>
          </template>

          <template #action="{ row }">
            <SysButton variant="ghost" type="primary" size="small" @click="goToItem(row)">
              详情
            </SysButton>
            <SysButton
              v-if="row.status === '未处理'"
              type="danger"
              size="small"
              variant="ghost"
              @click="handleProcess(row)"
              style="margin-left: 4px"
            >
              处理
            </SysButton>
          </template>
        </SysTable>
      </div>

      <!-- ============================================================ -->
      <!-- 3.4 历史趋势分析 -->
      <!-- ============================================================ -->
      <div class="section">
        <h3 class="section-title">历史趋势分析</h3>

        <el-row :gutter="16">
          <!-- 每日预警总数 vs 误报数 -->
          <el-col :span="12">
            <div class="chart-panel">
              <div class="chart-panel-header">
                <span class="chart-panel-title">每日预警总数 vs 误报数（近7天）</span>
                <div class="chart-legend">
                  <span class="chart-legend-item">
                    <span class="chart-legend-dot chart-legend-dot--primary"></span>
                    预警总数
                  </span>
                  <span class="chart-legend-item">
                    <span class="chart-legend-dot chart-legend-dot--danger"></span>
                    误报数
                  </span>
                </div>
              </div>
              <div class="chart-body">
                <SysLineChart
                  :data="lineChartData"
                  x-field="day"
                  y-field="value"
                  series-field="type"
                  :colors="['#3678E3', '#DC2626']"
                  :smooth="true"
                  :point="true"
                  :height="260"
                  :legend="false"
                />
              </div>
            </div>
          </el-col>

          <!-- 每日AI准确率趋势 -->
          <el-col :span="12">
            <div class="chart-panel">
              <div class="chart-panel-header">
                <span class="chart-panel-title">AI识别准确率趋势</span>
              </div>
              <div class="chart-body">
                <SysLineChart
                  :data="accuracyLineData"
                  x-field="day"
                  y-field="accuracy"
                  :smooth="true"
                  :point="true"
                  :colors="['#059669']"
                  :height="260"
                  :legend="false"
                />
              </div>
            </div>
          </el-col>
        </el-row>

        <!-- 预警类型占比 + 点位排名 -->
        <el-row :gutter="16" style="margin-top: var(--spacing-md)">
          <!-- 预警类型数量占比及处置完成率 -->
          <el-col :span="12">
            <div class="chart-panel">
              <div class="chart-panel-header">
                <span class="chart-panel-title">预警类型占比 & 处置完成率</span>
              </div>
              <div class="chart-body">
                <SysBarChart
                  :data="typeBarData"
                  x-field="name"
                  y-field="count"
                  :height="220"
                  :bar-radius="8"
                  :label="true"
                />
              </div>
            </div>
          </el-col>

          <!-- 点位预警数量排名 -->
          <el-col :span="12">
            <div class="chart-panel">
              <div class="chart-panel-header">
                <span class="chart-panel-title">点位预警数量排名</span>
              </div>
              <div class="chart-body">
                <SysTable
                  :data="siteRank"
                  :columns="[
                    { prop: 'site', label: '点位名称', minWidth: 130 },
                    { prop: 'total', label: '预警总数', width: 80, sortable: true },
                    { prop: 'unprocessed', label: '未处理', width: 70, slot: 'unprocessed' },
                    { prop: 'mainTypes', label: '主要预警类型', minWidth: 160 },
                  ]"
                  :pagination="false"
                  size="small"
                >
                  <template #unprocessed="{ row }">
                    <SysTag v-if="row.unprocessed > 0" type="danger" size="small">{{ row.unprocessed }}</SysTag>
                    <span v-else class="text-muted" style="font-size: var(--font-size-xs)">0</span>
                  </template>
                </SysTable>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>

      <!-- 摄像头在线率 -->
      <div class="section">
        <h3 class="section-title">摄像头在线率</h3>
        <div class="chart-panel">
          <div class="chart-body">
            <SysTable
              :data="cameraHealth"
              :columns="[
                { prop: 'site', label: '点位名称', minWidth: 160 },
                { prop: 'online', label: '在线数/总数', width: 120, slot: 'online' },
                { prop: 'rate', label: '在线率', width: 120, slot: 'rate' },
              ]"
              :pagination="false"
              size="small"
            >
              <template #online="{ row }">
                <span>{{ row.online }} / {{ row.total }}</span>
              </template>
              <template #rate="{ row }">
                <SysTag :type="row.online / row.total >= 0.9 ? 'success' : row.online / row.total >= 0.7 ? 'warning' : 'danger'" size="small">
                  {{ Math.round(row.online / row.total * 100) }}%
                </SysTag>
              </template>
            </SysTable>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
.page-content {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-16);
}

/* ==================== 骨架屏 ==================== */
.skeleton-section {
  margin-bottom: var(--spacing-lg);
  padding: var(--spacing-lg);
  background: var(--fill-surface);
  border-radius: var(--radius-lg);
}

/* ============================================================
 * 统计看板标题行
 * ============================================================ */
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
  gap: var(--spacing-xs);
  flex-shrink: 0;
}

.stats-filter-label {
  font-size: var(--font-size-small);
  color: var(--text-secondary);
  white-space: nowrap;
}

.time-range-select {
  width: 120px;
}

/* ==================== 筛选栏（对齐 filter-bar-standards 规范） ==================== */
.filter-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-md);
  background: var(--fill-surface);
  border-radius: var(--radius-md);
  border: 1px solid var(--border-default);
  margin-bottom: var(--spacing-md);
}

.filter-bar-left {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.filter-bar-right {
  display: flex;
  align-items: center;
}

.filter-label {
  font-size: var(--font-size-small);
  color: var(--text-secondary);
  font-weight: var(--font-weight-medium);
  white-space: nowrap;
}

.filter-select {
  width: 140px;
}

/* ============================================================
 * 统计行
 * ============================================================ */
.stats-row {
  margin-bottom: 0;
  display: flex;
  flex-wrap: wrap;
}
.stats-col {
  flex: 1;
  min-width: 140px;
}

.stats-col--wide {
  flex: 2;
  min-width: 280px;
}

/* ============================================================
 * Top3 卡片
 * ============================================================ */
.top-types-card {
  background: var(--fill-secondary);
  border-radius: var(--radius-lg);
  border: 1px solid var(--border-default);
  padding: var(--spacing-sm);
  min-height: 82px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.top-types-header {
  margin-bottom: 2px;
}

.top-types-title {
  font-size: var(--font-size-small);
  color: var(--text-secondary);
}

.top-types-list {
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
  justify-content: center;
}

.top-type-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-6);
}

.top-type-rank {
  width: 24px;
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-bold);
  color: var(--text-muted);
}

.top-type-rank.rank-1 { color: var(--color-danger); }
.top-type-rank.rank-2 { color: var(--color-warning); }
.top-type-rank.rank-3 { color: var(--color-info); }

.top-type-name {
  flex: 1;
  font-size: var(--font-size-xs);
  color: var(--text-primary);
}

.top-type-count {
  font-size: var(--font-size-xs);
  color: var(--text-muted);
  flex-shrink: 0;
}

.top-type-empty {
  font-size: var(--font-size-xs);
  color: var(--text-muted);
  text-align: center;
  padding: 8px 0;
}

/* ============================================================
 * 区块卡片（非列表区域的其他区块）
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

/* ============================================================
 * 列表区域
 * ============================================================ */
.section {
  margin-bottom: var(--spacing-lg);
}

.section > .section-header {
  margin-bottom: var(--spacing-md);
}

.section-title {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  font-size: var(--font-size-h3);
  font-weight: var(--font-weight-medium);
  color: var(--text-primary);
  margin: 0 0 var(--spacing-sm) 0;
}

.section-title::before {
  content: '';
  display: inline-block;
  width: 3px;
  height: 1em;
  background: var(--color-primary);
  border-radius: 2px;
  flex-shrink: 0;
}

.text-muted {
  color: var(--text-muted);
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
 * 柱状图 - 预警总数 vs 误报
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
  width: 32px;
  height: 100%;
  display: flex;
  flex-direction: column-reverse;
  border-radius: var(--radius-xs) var(--radius-xs) 0 0;
  overflow: hidden;
}

.bar-total {
  background: var(--color-primary);
  display: flex;
  align-items: flex-start;
  justify-content: center;
  transition: height 0.4s ease;
  min-height: 0;
}

.bar-false-wrap {
  width: 32px;
  position: relative;
}

.bar-false-dot {
  background: var(--color-danger);
  display: flex;
  align-items: flex-start;
  justify-content: center;
  transition: height 0.4s ease;
  border-radius: var(--radius-xs);
  width: 16px;
  margin: 0 auto;
  min-height: 14px;
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
  margin-top: var(--spacing-4);
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

.legend-dot.total { background: var(--color-primary); }
.legend-dot.false { background: var(--color-danger); }

/* ============================================================
 * 准确率趋势线图
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

.line-fill-acc {
  background: var(--color-success);
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

.dist-row {
  display: flex;
  align-items: center;
  gap: var(--spacing-8);
}

.dist-label {
  width: 72px;
  font-size: var(--font-size-xs);
  color: var(--text-secondary);
  flex-shrink: 0;
  text-align: right;
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

.dist-num {
  width: 24px;
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
  color: var(--text-primary);
  text-align: right;
  flex-shrink: 0;
}

.dist-rate {
  width: 36px;
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-bold);
  text-align: right;
  flex-shrink: 0;
}

/* ============================================================
 * 响应式
 * ============================================================ */
@media (max-width: 1200px) {
  .analysis-grid {
    grid-template-columns: 1fr;
  }
}

/* ============================================================
 * 图表面板（历史趋势分析统一规范）
 * ============================================================ */
.chart-panel {
  background: var(--fill-surface);
  border-radius: var(--radius-lg);
  border: 1px solid var(--border-default);
  overflow: hidden;
}
.chart-panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-md) var(--spacing-lg);
  border-bottom: 1px solid var(--border-low);
  background: var(--fill-secondary);
}
.chart-panel-title {
  font-size: var(--font-size-body);
  font-weight: var(--font-weight-medium);
  color: var(--text-primary);
}
.chart-body {
  padding: var(--spacing-md);
}
/* 图例 */
.chart-legend {
  display: flex;
  gap: var(--spacing-md);
}
.chart-legend-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  font-size: var(--font-size-xs);
  color: var(--text-muted);
}
.chart-legend-dot {
  width: 10px;
  height: 10px;
  border-radius: var(--radius-round);
}
.chart-legend-dot--primary { background: var(--color-primary); }
.chart-legend-dot--success { background: var(--color-success); }
.chart-legend-dot--warning { background: var(--color-warning); }
.chart-legend-dot--danger  { background: var(--color-danger); }
</style>
