<!--
  组件名称: NewsCenter
  用途: 模块1 - 石楼动态资讯二级专题页面，包含综合统计看板、通知列表、历史趋势分析
-->
<script setup>
import { ref, computed, reactive, watch } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'

const router = useRouter()

// ==================== 时间筛选 ====================
const timeRange = ref('30d')
const customDateRange = ref([])

const timeRangeOptions = [
  { label: '近7天', value: '7d' },
  { label: '近30天', value: '30d' },
  { label: '自定义', value: 'custom' },
  { label: '全部历史', value: 'all' },
]

// ==================== 示例数据 ====================

// 3.1 综合统计看板数据（按时间范围映射）
const statsDataMap = {
  '7d': {
    totalNotices: 5,
    totalShouldRead: 185,
    totalRead: 144,
    readRate: 77.8,
    totalUnread: 41,
    feedbackNotices: 2,
    feedbackRate: 65.0,
  },
  '30d': {
    totalNotices: 12,
    totalShouldRead: 420,
    totalRead: 336,
    readRate: 80.0,
    totalUnread: 84,
    feedbackNotices: 4,
    feedbackRate: 68.5,
  },
  'all': {
    totalNotices: 48,
    totalShouldRead: 1680,
    totalRead: 1488,
    readRate: 88.6,
    totalUnread: 192,
    feedbackNotices: 18,
    feedbackRate: 74.2,
  },
}

const stats = computed(() => {
  if (timeRange.value === 'custom') {
    return statsDataMap['30d']
  }
  return statsDataMap[timeRange.value] || statsDataMap['30d']
})

// 已读率颜色
const readRateColor = computed(() => {
  const rate = stats.value.readRate
  if (rate >= 90) return 'var(--color-success)'
  if (rate >= 70) return 'var(--color-warning)'
  return 'var(--color-danger)'
})

// 环形进度条参数
const ringCircumference = 2 * Math.PI * 54
const ringOffset = computed(() => {
  return ringCircumference - (stats.value.readRate / 100) * ringCircumference
})

// 反馈完成率颜色
const feedbackRateColor = computed(() => {
  const rate = stats.value.feedbackRate
  if (rate >= 80) return 'var(--color-success)'
  if (rate >= 60) return 'var(--color-warning)'
  return 'var(--color-danger)'
})

// 3.2 通知列表数据
const noticeList = ref([
  {
    id: 1,
    title: '关于做好防汛准备的通知',
    publishTime: '2026-05-10',
    publisher: '应急办',
    targetCount: 35,
    readCount: 27,
    unreadCount: 8,
    readRate: 77.1,
    needFeedback: true,
    feedbackRate: 60,
  },
  {
    id: 2,
    title: '2025年企业安全责任书签署',
    publishTime: '2026-05-09',
    publisher: '安监站',
    targetCount: 42,
    readCount: 37,
    unreadCount: 5,
    readRate: 88.1,
    needFeedback: false,
    feedbackRate: null,
  },
  {
    id: 3,
    title: '石楼镇消防安全自查通知',
    publishTime: '2026-05-08',
    publisher: '消防救援',
    targetCount: 50,
    readCount: 42,
    unreadCount: 8,
    readRate: 84.0,
    needFeedback: true,
    feedbackRate: 75,
  },
  {
    id: 4,
    title: '关于开展安全生产月活动的通知',
    publishTime: '2026-05-07',
    publisher: '安监站',
    targetCount: 38,
    readCount: 30,
    unreadCount: 8,
    readRate: 78.9,
    needFeedback: true,
    feedbackRate: 55,
  },
  {
    id: 5,
    title: '关于环保检查整改要求的通知',
    publishTime: '2026-05-05',
    publisher: '环保办',
    targetCount: 30,
    readCount: 28,
    unreadCount: 2,
    readRate: 93.3,
    needFeedback: false,
    feedbackRate: null,
  },
  {
    id: 6,
    title: '2026年税务申报提醒通知',
    publishTime: '2026-05-03',
    publisher: '税务所',
    targetCount: 55,
    readCount: 48,
    unreadCount: 7,
    readRate: 87.3,
    needFeedback: false,
    feedbackRate: null,
  },
  {
    id: 7,
    title: '关于五一节前安全检查的通知',
    publishTime: '2026-04-28',
    publisher: '应急办',
    targetCount: 40,
    readCount: 35,
    unreadCount: 5,
    readRate: 87.5,
    needFeedback: true,
    feedbackRate: 80,
  },
  {
    id: 8,
    title: '企业用工规范及社保缴纳通知',
    publishTime: '2026-04-25',
    publisher: '人社所',
    targetCount: 48,
    readCount: 40,
    unreadCount: 8,
    readRate: 83.3,
    needFeedback: true,
    feedbackRate: 62,
  },
  {
    id: 9,
    title: '关于开展消防演练的通知',
    publishTime: '2026-04-20',
    publisher: '消防救援',
    targetCount: 32,
    readCount: 30,
    unreadCount: 2,
    readRate: 93.8,
    needFeedback: true,
    feedbackRate: 85,
  },
  {
    id: 10,
    title: '关于食品安全专项检查的通知',
    publishTime: '2026-04-15',
    publisher: '食药监',
    targetCount: 25,
    readCount: 22,
    unreadCount: 3,
    readRate: 88.0,
    needFeedback: false,
    feedbackRate: null,
  },
  {
    id: 11,
    title: '关于开展职业病防治宣传的通知',
    publishTime: '2026-04-10',
    publisher: '卫健办',
    targetCount: 28,
    readCount: 24,
    unreadCount: 4,
    readRate: 85.7,
    needFeedback: true,
    feedbackRate: 70,
  },
  {
    id: 12,
    title: '关于春节期间安全生产的通知',
    publishTime: '2026-01-20',
    publisher: '应急办',
    targetCount: 45,
    readCount: 41,
    unreadCount: 4,
    readRate: 91.1,
    needFeedback: false,
    feedbackRate: null,
  },
])

// 表格排序
const tableSort = ref({ prop: 'unreadCount', order: 'descending' })
const publisherFilter = ref('')

const publishers = computed(() => {
  const set = new Set(noticeList.value.map(n => n.publisher))
  return Array.from(set)
})

const filteredNotices = computed(() => {
  let list = [...noticeList.value]
  if (publisherFilter.value) {
    list = list.filter(n => n.publisher === publisherFilter.value)
  }
  if (tableSort.value.prop && tableSort.value.order) {
    const { prop, order } = tableSort.value
    list.sort((a, b) => {
      const valA = a[prop] ?? 0
      const valB = b[prop] ?? 0
      return order === 'ascending' ? valA - valB : valB - valA
    })
  }
  return list
})

const handleTableSort = ({ prop, order }) => {
  tableSort.value = { prop, order }
}

// 催办
const handleUrge = (notice) => {
  ElMessageBox.confirm(
    `确认向"${notice.title}"的 ${notice.unreadCount} 家未读企业发送催办提醒？`,
    '一键催办',
    { confirmButtonText: '确认催办', cancelButtonText: '取消', type: 'warning' }
  ).then(() => {
    ElMessage.success(`已向 ${notice.unreadCount} 家未读企业发送催办提醒`)
  }).catch(() => {})
}

// 查看详情
const handleViewDetail = (notice) => {
  router.push(`/news/${notice.id}`)
}

// ==================== 3.4 历史趋势分析数据 ====================
const trendData = ref([
  { month: '2026-01', noticeCount: 8, avgReadRate: 92, unreadCount: 32 },
  { month: '2026-02', noticeCount: 6, avgReadRate: 88, unreadCount: 28 },
  { month: '2026-03', noticeCount: 10, avgReadRate: 85, unreadCount: 45 },
  { month: '2026-04', noticeCount: 7, avgReadRate: 91, unreadCount: 24 },
  { month: '2026-05', noticeCount: 5, avgReadRate: 78, unreadCount: 38 },
])

const trendMonths = computed(() => trendData.value.map(d => d.month.substring(5)))
const maxNoticeCount = computed(() => Math.max(...trendData.value.map(d => d.noticeCount)))
const maxUnreadCount = computed(() => Math.max(...trendData.value.map(d => d.unreadCount)))

// SVG 折线图配置（通知数量 + 未读企业数 双线）
const trendChartWidth = 600
const trendChartHeight = 280
const trendPadding = { top: 20, right: 40, bottom: 40, left: 50 }
const trendPlotWidth = trendChartWidth - trendPadding.left - trendPadding.right
const trendPlotHeight = trendChartHeight - trendPadding.top - trendPadding.bottom

const noticePoints = computed(() => {
  return trendData.value.map((d, i) => {
    const x = trendPadding.left + (i / (trendData.value.length - 1)) * trendPlotWidth
    const y = trendPadding.top + trendPlotHeight - (d.noticeCount / (maxNoticeCount.value || 1)) * trendPlotHeight
    return { x, y, label: d.noticeCount }
  })
})

const unreadPoints = computed(() => {
  return trendData.value.map((d, i) => {
    const x = trendPadding.left + (i / (trendData.value.length - 1)) * trendPlotWidth
    const y = trendPadding.top + trendPlotHeight - (d.unreadCount / (maxUnreadCount.value || 1)) * trendPlotHeight
    return { x, y, label: d.unreadCount }
  })
})

const noticeLinePath = computed(() => {
  if (noticePoints.value.length === 0) return ''
  return noticePoints.value.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')
})

const unreadLinePath = computed(() => {
  if (unreadPoints.value.length === 0) return ''
  return unreadPoints.value.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')
})

// SVG Y轴刻度
const noticeYAxisTicks = computed(() => {
  const max = maxNoticeCount.value || 10
  const step = Math.ceil(max / 4)
  return Array.from({ length: 5 }, (_, i) => i * step).reverse()
})

// 3.4.2 企业历史已读率排名
const enterpriseRanking = ref([
  { name: '宏达制造', shouldRead: 12, read: 12, rate: 100, trend: 'up' },
  { name: '兴隆纺织', shouldRead: 12, read: 11, rate: 91.7, trend: 'flat' },
  { name: '永盛科技', shouldRead: 12, read: 10, rate: 83.3, trend: 'up' },
  { name: '新欣食品', shouldRead: 12, read: 8, rate: 66.7, trend: 'down' },
  { name: '宏远物流', shouldRead: 12, read: 6, rate: 50.0, trend: 'down' },
  { name: '德力机械', shouldRead: 12, read: 5, rate: 41.7, trend: 'down' },
])

const getRateColor = (rate) => {
  if (rate >= 90) return 'var(--color-success)'
  if (rate >= 70) return 'var(--color-warning)'
  return 'var(--color-danger)'
}

const getRateBarColor = (rate) => {
  if (rate >= 90) return 'var(--color-success)'
  if (rate >= 70) return 'var(--color-warning)'
  return 'var(--color-danger)'
}

const getTrendIcon = (trend) => {
  if (trend === 'up') return '↑'
  if (trend === 'down') return '↓'
  return '→'
}

const getTrendColor = (trend) => {
  if (trend === 'up') return 'var(--color-success)'
  if (trend === 'down') return 'var(--color-danger)'
  return 'var(--text-muted)'
}

// 企业排名柱状图配置
const barChartWidth = 560
const barChartHeight = 240
const barPadding = { top: 10, right: 20, bottom: 36, left: 50 }
const barPlotWidth = barChartWidth - barPadding.left - barPadding.right
const barPlotHeight = barChartHeight - barPadding.top - barPadding.bottom

const barWidth = computed(() => Math.min(48, (barPlotWidth / enterpriseRanking.value.length) * 0.6))
const barGap = computed(() => barPlotWidth / enterpriseRanking.value.length)

// 选中的月份筛选
const selectedMonth = ref('2026-05')

// ==================== 导出 ====================
const handleExport = () => {
  ElMessage.success('导出功能开发中，即将支持导出为Excel格式')
}
</script>

<template>
  <div class="news-center">
    <!-- 页面标题 -->
    <div class="page-header">
      <div class="page-header-left">
        <h2 class="page-title">石楼动态资讯</h2>
        <span class="page-breadcrumb">通知下发 → 阅读 → 反馈 → 催办 闭环管理</span>
      </div>
      <div class="page-header-right">
        <el-button type="default" @click="router.push('/home')">
          <el-icon><ArrowLeft /></el-icon>
          返回一级页面
        </el-button>
      </div>
    </div>

    <!-- 时间筛选器 -->
    <div class="filter-bar">
      <span class="filter-label">时间范围：</span>
      <el-radio-group v-model="timeRange" size="default">
        <el-radio-button
          v-for="opt in timeRangeOptions"
          :key="opt.value"
          :value="opt.value"
        >
          {{ opt.label }}
        </el-radio-button>
      </el-radio-group>
      <template v-if="timeRange === 'custom'">
        <el-date-picker
          v-model="customDateRange"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          style="margin-left: var(--spacing-md);"
        />
      </template>
    </div>

    <!-- ==================== 3.1 综合统计看板 ==================== -->
    <div class="section">
      <h3 class="section-title">综合统计看板</h3>
      <el-row :gutter="16" class="stats-row">
        <!-- 通知总数 -->
        <el-col :span="3">
          <div class="stat-card">
            <div class="stat-card-value stat-card-value--primary">{{ stats.totalNotices }}</div>
            <div class="stat-card-label">通知总数</div>
          </div>
        </el-col>
        <!-- 应读总人次 -->
        <el-col :span="3">
          <div class="stat-card">
            <div class="stat-card-value">{{ stats.totalShouldRead }}</div>
            <div class="stat-card-label">应读总人次</div>
          </div>
        </el-col>
        <!-- 已读总人次 -->
        <el-col :span="3">
          <div class="stat-card">
            <div class="stat-card-value stat-card-value--success">{{ stats.totalRead }}</div>
            <div class="stat-card-label">已读总人次</div>
          </div>
        </el-col>
        <!-- 整体已读率（环形） -->
        <el-col :span="4">
          <div class="stat-card stat-card--ring">
            <svg width="130" height="130" viewBox="0 0 130 130" class="ring-chart">
              <circle
                cx="65" cy="65" r="54"
                fill="none"
                stroke="var(--border-low)"
                stroke-width="10"
              />
              <circle
                cx="65" cy="65" r="54"
                fill="none"
                :stroke="readRateColor"
                stroke-width="10"
                stroke-linecap="round"
                :stroke-dasharray="ringCircumference"
                :stroke-dashoffset="ringOffset"
                transform="rotate(-90 65 65)"
                class="ring-chart-fill"
              />
              <text x="65" y="61" text-anchor="middle" class="ring-chart-value" :fill="readRateColor">
                {{ stats.readRate }}%
              </text>
              <text x="65" y="80" text-anchor="middle" class="ring-chart-label" fill="var(--text-muted)">
                整体已读率
              </text>
            </svg>
          </div>
        </el-col>
        <!-- 未读总人次 -->
        <el-col :span="3">
          <div class="stat-card stat-card--highlight">
            <div class="stat-card-value stat-card-value--danger">{{ stats.totalUnread }}</div>
            <div class="stat-card-label">未读总人次<el-tag size="small" type="danger" effect="plain" style="margin-left: 4px;">需催办</el-tag></div>
          </div>
        </el-col>
        <!-- 要求反馈的通知数 -->
        <el-col :span="4">
          <div class="stat-card stat-card--highlight">
            <div class="stat-card-value stat-card-value--warning">{{ stats.feedbackNotices }}</div>
            <div class="stat-card-label">要求反馈通知数 <el-tag size="small" type="warning" effect="plain" style="margin-left: 4px;">需提醒</el-tag></div>
          </div>
        </el-col>
        <!-- 反馈完成率 -->
        <el-col :span="4">
          <div class="stat-card">
            <div class="stat-card-value" :style="{ color: feedbackRateColor }">{{ stats.feedbackRate }}%</div>
            <div class="stat-card-label">反馈完成率</div>
          </div>
        </el-col>
      </el-row>
    </div>

    <!-- ==================== 3.2 通知列表 ==================== -->
    <div class="section">
      <div class="section-header">
        <h3 class="section-title">通知列表</h3>
        <div class="section-header-actions">
          <span class="filter-label">发布人：</span>
          <el-select
            v-model="publisherFilter"
            placeholder="全部"
            clearable
            style="width: 140px;"
          >
            <el-option
              v-for="pub in publishers"
              :key="pub"
              :label="pub"
              :value="pub"
            />
          </el-select>
          <el-button type="primary" @click="handleExport" style="margin-left: var(--spacing-sm);">
            <el-icon><Download /></el-icon>
            导出Excel
          </el-button>
        </div>
      </div>

      <el-table
        :data="filteredNotices"
        stripe
        class="notice-table"
        @sort-change="handleTableSort"
        :default-sort="{ prop: 'unreadCount', order: 'descending' }"
      >
        <el-table-column prop="title" label="通知标题" min-width="220" show-overflow-tooltip />
        <el-table-column prop="publishTime" label="发布时间" width="120" sortable="custom" />
        <el-table-column prop="publisher" label="发布人" width="100" />
        <el-table-column prop="targetCount" label="目标企业数" width="110" sortable="custom" align="center" />
        <el-table-column prop="readCount" label="已读数" width="80" sortable="custom" align="center" />
        <el-table-column prop="unreadCount" label="未读数" width="80" sortable="custom" align="center">
          <template #default="{ row }">
            <span :class="{ 'unread-highlight': row.unreadCount > 4 }">{{ row.unreadCount }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="readRate" label="已读率" width="100" sortable="custom" align="center">
          <template #default="{ row }">
            <span :style="{ color: getRateColor(row.readRate), fontWeight: 'var(--font-weight-medium)' }">
              {{ row.readRate }}%
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="needFeedback" label="是否需反馈" width="110" align="center">
          <template #default="{ row }">
            <el-tag :type="row.needFeedback ? 'warning' : 'info'" size="small" effect="plain">
              {{ row.needFeedback ? '是' : '否' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="feedbackRate" label="反馈完成率" width="110" align="center">
          <template #default="{ row }">
            <template v-if="row.needFeedback && row.feedbackRate !== null">
              <span :style="{ color: getRateColor(row.feedbackRate), fontWeight: 'var(--font-weight-medium)' }">
                {{ row.feedbackRate }}%
              </span>
            </template>
            <template v-else>
              <span class="text-muted">-</span>
            </template>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="160" fixed="right" align="center">
          <template #default="{ row }">
            <el-button type="primary" link size="small" @click="handleViewDetail(row)">
              详情
            </el-button>
            <el-button
              type="danger"
              link
              size="small"
              :disabled="row.unreadCount === 0"
              @click="handleUrge(row)"
            >
              催办
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- ==================== 3.4 历史趋势分析 ==================== -->
    <div class="section">
      <h3 class="section-title">历史趋势分析</h3>

      <el-row :gutter="16">
        <!-- 折线图：通知数量 & 未读企业数变化 -->
        <el-col :span="14">
          <div class="chart-panel">
            <div class="chart-panel-header">
              <span class="chart-panel-title">通知发布数量 & 未读企业数变化（按月）</span>
              <div class="chart-legend">
                <span class="chart-legend-item">
                  <span class="chart-legend-dot chart-legend-dot--primary"></span>
                  通知数量
                </span>
                <span class="chart-legend-item">
                  <span class="chart-legend-dot chart-legend-dot--danger"></span>
                  未读企业数
                </span>
              </div>
            </div>
            <div class="chart-body">
              <svg :width="trendChartWidth" :height="trendChartHeight" viewBox="0 0 600 280" class="trend-svg">
                <!-- Y轴网格线 -->
                <line
                  v-for="(tick, i) in noticeYAxisTicks"
                  :key="'grid-' + i"
                  :x1="trendPadding.left"
                  :y1="trendPadding.top + (trendPlotHeight / 4) * i"
                  :x2="trendChartWidth - trendPadding.right"
                  :y2="trendPadding.top + (trendPlotHeight / 4) * i"
                  stroke="var(--border-low)"
                  stroke-width="1"
                />
                <!-- Y轴刻度 -->
                <text
                  v-for="(tick, i) in noticeYAxisTicks"
                  :key="'tick-' + i"
                  :x="trendPadding.left - 8"
                  :y="trendPadding.top + (trendPlotHeight / 4) * i + 5"
                  text-anchor="end"
                  class="chart-axis-text"
                  fill="var(--text-muted)"
                >{{ tick }}</text>
                <!-- X轴标签 -->
                <text
                  v-for="(d, i) in trendData"
                  :key="'x-' + i"
                  :x="trendPadding.left + (i / (trendData.length - 1)) * trendPlotWidth"
                  :y="trendChartHeight - 8"
                  text-anchor="middle"
                  class="chart-axis-text"
                  fill="var(--text-muted)"
                >{{ d.month.substring(5) }}月</text>
                <!-- 通知数量折线 -->
                <polyline
                  :points="noticePoints.map(p => `${p.x},${p.y}`).join(' ')"
                  fill="none"
                  stroke="var(--color-primary)"
                  stroke-width="2.5"
                  stroke-linejoin="round"
                />
                <!-- 未读企业数折线 -->
                <polyline
                  :points="unreadPoints.map(p => `${p.x},${p.y}`).join(' ')"
                  fill="none"
                  stroke="var(--color-danger)"
                  stroke-width="2.5"
                  stroke-linejoin="round"
                  stroke-dasharray="6,3"
                />
                <!-- 数据点 & 标签 -->
                <g v-for="(p, i) in noticePoints" :key="'np-' + i">
                  <circle :cx="p.x" :cy="p.y" r="4" fill="var(--color-primary)" stroke="var(--fill-surface)" stroke-width="2" />
                  <text :x="p.x" :y="p.y - 12" text-anchor="middle" class="chart-point-label" fill="var(--color-primary)">{{ p.label }}</text>
                </g>
                <g v-for="(p, i) in unreadPoints" :key="'up-' + i">
                  <circle :cx="p.x" :cy="p.y" r="4" fill="var(--color-danger)" stroke="var(--fill-surface)" stroke-width="2" />
                  <text :x="p.x" :y="p.y - 12" text-anchor="middle" class="chart-point-label" fill="var(--color-danger)">{{ p.label }}</text>
                </g>
              </svg>
            </div>
          </div>
        </el-col>

        <!-- 各月平均已读率 -->
        <el-col :span="10">
          <div class="chart-panel">
            <div class="chart-panel-header">
              <span class="chart-panel-title">各月平均已读率</span>
            </div>
            <div class="chart-body">
              <div class="rate-bar-list">
                <div
                  v-for="d in trendData"
                  :key="d.month"
                  class="rate-bar-item"
                >
                  <div class="rate-bar-header">
                    <span class="rate-bar-month">{{ d.month.substring(5) }}月</span>
                    <span
                      class="rate-bar-value"
                      :style="{ color: getRateColor(d.avgReadRate) }"
                    >{{ d.avgReadRate }}%</span>
                  </div>
                  <div class="rate-bar-track">
                    <div
                      class="rate-bar-fill"
                      :style="{
                        width: d.avgReadRate + '%',
                        background: getRateBarColor(d.avgReadRate),
                      }"
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>

      <!-- 3.4.2 各企业历史已读率排名 -->
      <el-row :gutter="16" style="margin-top: var(--spacing-16);">
        <el-col :span="14">
          <div class="chart-panel">
            <div class="chart-panel-header">
              <span class="chart-panel-title">各企业历史已读率排名（近30天）</span>
            </div>
            <div class="chart-body">
              <svg :width="barChartWidth" :height="barChartHeight" viewBox="0 0 560 240" class="bar-svg">
                <!-- Y轴网格线 -->
                <line
                  v-for="n in 5"
                  :key="'bgrid-' + n"
                  :x1="barPadding.left"
                  :y1="barPadding.top + (barPlotHeight / 4) * (n - 1)"
                  :x2="barChartWidth - barPadding.right"
                  :y2="barPadding.top + (barPlotHeight / 4) * (n - 1)"
                  stroke="var(--border-low)"
                  stroke-width="1"
                />
                <!-- Y轴刻度 -->
                <text
                  v-for="n in 5"
                  :key="'btick-' + n"
                  :x="barPadding.left - 8"
                  :y="barPadding.top + (barPlotHeight / 4) * (n - 1) + 5"
                  text-anchor="end"
                  class="chart-axis-text"
                  fill="var(--text-muted)"
                >{{ (100 - (n - 1) * 25) }}%</text>
                <!-- 柱状图 -->
                <g v-for="(item, i) in enterpriseRanking" :key="'bar-' + i">
                  <rect
                    :x="barPadding.left + barGap * i + (barGap - barWidth) / 2"
                    :y="barPadding.top + barPlotHeight - (item.rate / 100) * barPlotHeight"
                    :width="barWidth"
                    :height="(item.rate / 100) * barPlotHeight"
                    :rx="4"
                    :fill="getRateBarColor(item.rate)"
                    class="bar-rect"
                  />
                  <text
                    :x="barPadding.left + barGap * i + barGap / 2"
                    :y="barPadding.top + barPlotHeight - (item.rate / 100) * barPlotHeight - 8"
                    text-anchor="middle"
                    class="chart-point-label"
                    :fill="getRateColor(item.rate)"
                  >{{ item.rate }}%</text>
                  <text
                    :x="barPadding.left + barGap * i + barGap / 2"
                    :y="barChartHeight - 6"
                    text-anchor="middle"
                    class="chart-axis-text bar-label"
                    fill="var(--text-secondary)"
                  >{{ item.name }}</text>
                </g>
              </svg>
            </div>
          </div>
        </el-col>

        <!-- 企业排名表格 -->
        <el-col :span="10">
          <div class="chart-panel">
            <div class="chart-panel-header">
              <span class="chart-panel-title">企业已读率排名明细</span>
            </div>
            <div class="chart-body chart-body--table">
              <el-table :data="enterpriseRanking" stripe size="small" class="ranking-table">
                <el-table-column label="排名" width="60" align="center">
                  <template #default="{ $index }">
                    <span
                      class="rank-badge"
                      :class="{
                        'rank-badge--gold': $index === 0,
                        'rank-badge--silver': $index === 1,
                        'rank-badge--bronze': $index === 2,
                      }"
                    >{{ $index + 1 }}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="name" label="企业名称" min-width="100" />
                <el-table-column prop="rate" label="已读率" width="80" align="center">
                  <template #default="{ row }">
                    <span :style="{ color: getRateColor(row.rate), fontWeight: 'var(--font-weight-medium)' }">
                      {{ row.rate }}%
                    </span>
                  </template>
                </el-table-column>
                <el-table-column label="趋势" width="60" align="center">
                  <template #default="{ row }">
                    <span :style="{ color: getTrendColor(row.trend), fontSize: 'var(--font-size-h4)' }">
                      {{ getTrendIcon(row.trend) }}
                    </span>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<style scoped>
.news-center {
  padding: var(--spacing-lg);
  background: var(--fill-page);
  min-height: 100%;
}

/* ==================== 页面标题 ==================== */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: var(--spacing-lg);
  padding: var(--spacing-lg);
  background: var(--fill-surface);
  border-radius: var(--radius-lg);
  border: 1px solid var(--border-default);
}

.page-title {
  font-size: var(--font-size-h1);
  font-weight: var(--font-weight-bold);
  color: var(--text-primary);
  margin: 0 0 var(--spacing-4) 0;
}

.page-breadcrumb {
  font-size: var(--font-size-small);
  color: var(--text-muted);
}

/* ==================== 筛选栏 ==================== */
.filter-bar {
  display: flex;
  align-items: center;
  padding: var(--spacing-md);
  background: var(--fill-surface);
  border-radius: var(--radius-md);
  border: 1px solid var(--border-default);
  margin-bottom: var(--spacing-md);
}

.filter-label {
  font-size: var(--font-size-small);
  color: var(--text-secondary);
  font-weight: var(--font-weight-medium);
  margin-right: var(--spacing-sm);
  white-space: nowrap;
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

.section-header-actions {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.section-title {
  font-size: var(--font-size-h2);
  font-weight: var(--font-weight-bold);
  color: var(--text-primary);
  margin: 0 0 var(--spacing-md) 0;
  padding-left: var(--spacing-md);
  border-left: 4px solid var(--color-primary);
}

/* ==================== 统计卡片 ==================== */
.stats-row {
  margin-bottom: 0;
}

.stat-card {
  background: var(--fill-surface);
  border-radius: var(--radius-lg);
  border: 1px solid var(--border-default);
  padding: var(--spacing-lg) var(--spacing-md);
  text-align: center;
  min-height: 130px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  transition: box-shadow 0.2s ease;
}

.stat-card:hover {
  box-shadow: var(--shadow-md);
}

.stat-card--highlight {
  border-color: var(--color-warning-border);
  background: var(--color-warning-bg);
}

.stat-card--ring {
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-card-value {
  font-size: var(--font-size-h1);
  font-weight: var(--font-weight-heavy);
  color: var(--text-primary);
  line-height: 1.2;
}

.stat-card-value--primary {
  color: var(--color-primary);
}

.stat-card-value--success {
  color: var(--color-success);
}

.stat-card-value--danger {
  color: var(--color-danger);
}

.stat-card-value--warning {
  color: var(--color-warning);
}

.stat-card-label {
  font-size: var(--font-size-small);
  color: var(--text-muted);
  margin-top: var(--spacing-4);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
}

/* 环形进度条 */
.ring-chart-fill {
  transition: stroke-dashoffset 0.6s ease;
}

.ring-chart-value {
  font-size: var(--font-size-h3);
  font-weight: var(--font-weight-heavy);
}

.ring-chart-label {
  font-size: var(--font-size-xs);
}

/* ==================== 通知表格 ==================== */
.notice-table {
  border-radius: var(--radius-lg);
  overflow: hidden;
}

.notice-table :deep(.el-table__header th) {
  background: var(--fill-secondary);
  color: var(--text-primary);
  font-weight: var(--font-weight-medium);
}

.unread-highlight {
  color: var(--color-danger);
  font-weight: var(--font-weight-bold);
}

.text-muted {
  color: var(--text-muted);
}

/* ==================== 图表面板 ==================== */
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

.chart-legend {
  display: flex;
  gap: var(--spacing-md);
}

.chart-legend-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-4);
  font-size: var(--font-size-xs);
  color: var(--text-muted);
}

.chart-legend-dot {
  width: 10px;
  height: 10px;
  border-radius: var(--radius-round);
}

.chart-legend-dot--primary {
  background: var(--color-primary);
}

.chart-legend-dot--danger {
  background: var(--color-danger);
}

.chart-body {
  padding: var(--spacing-md);
}

.chart-body--table {
  padding: var(--spacing-sm);
}

.chart-axis-text {
  font-size: 11px;
}

.chart-point-label {
  font-size: 10px;
  font-weight: var(--font-weight-medium);
}

.trend-svg,
.bar-svg {
  display: block;
  width: 100%;
  height: auto;
}

.bar-rect {
  transition: height 0.5s ease, y 0.5s ease;
}

.bar-label {
  font-size: 11px;
}

/* 已读率柱状条 */
.rate-bar-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  padding: var(--spacing-sm) 0;
}

.rate-bar-item {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-4);
}

.rate-bar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.rate-bar-month {
  font-size: var(--font-size-small);
  font-weight: var(--font-weight-medium);
  color: var(--text-secondary);
}

.rate-bar-value {
  font-size: var(--font-size-small);
  font-weight: var(--font-weight-bold);
}

.rate-bar-track {
  height: 22px;
  background: var(--fill-page);
  border-radius: var(--radius-round);
  overflow: hidden;
}

.rate-bar-fill {
  height: 100%;
  border-radius: var(--radius-round);
  transition: width 0.6s ease;
  min-width: 4px;
}

/* 排名 */
.rank-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: var(--radius-round);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-bold);
  background: var(--fill-secondary);
  color: var(--text-secondary);
}

.rank-badge--gold {
  background: #FFD700;
  color: #5D4037;
}

.rank-badge--silver {
  background: #C0C0C0;
  color: #37474F;
}

.rank-badge--bronze {
  background: #CD7F32;
  color: #3E2723;
}

.ranking-table :deep(.el-table__header th) {
  background: var(--fill-secondary);
}
</style>