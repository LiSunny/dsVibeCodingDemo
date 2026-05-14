<!--
  组件名称: NewsCenter
  用途: 模块1 - 石楼动态资讯二级专题页面，包含综合统计看板、通知列表、历史趋势分析
-->
<script setup>
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  ArrowLeft, Download, Top, Bottom, Right,
  Search
} from '@element-plus/icons-vue'
import StatsCard from '@/components/StatsCard.vue'
import SysButton from '@/components/SysButton.vue'
import SysTable from '@/components/SysTable.vue'
import SysTag from '@/components/SysTag.vue'
import PageHeader from '@/components/PageHeader.vue'

const router = useRouter()

// ==================== 加载状态 ====================
const pageLoading = ref(true)
setTimeout(() => { pageLoading.value = false }, 600)

// ==================== 时间筛选 ====================
const timeRange = ref('7d')
const customDateRange = ref([])

const timeRangeOptions = [
  { label: '近7天', value: '7d' },
  { label: '近30天', value: '30d' },
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

// ==================== 3.2 通知列表数据 ====================
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
    readCount: 28,
    unreadCount: 0,
    readRate: 100,
    needFeedback: true,
    feedbackRate: 70,
  },
  {
    id: 12,
    title: '关于春节期间安全生产的通知',
    publishTime: '2026-01-20',
    publisher: '应急办',
    targetCount: 45,
    readCount: 45,
    unreadCount: 0,
    readRate: 100,
    needFeedback: false,
    feedbackRate: null,
  },
])

// ==================== 分页 ====================
const currentPage = ref(1)
const pageSize = ref(8)
const totalNotices = computed(() => filteredNotices.value.length)

// 搜索关键字
const searchKeyword = ref('')

// 表格排序
const tableSort = ref({ prop: 'unreadCount', order: 'descending' })
const publisherFilter = ref('')

const publishers = computed(() => {
  const set = new Set(noticeList.value.map(n => n.publisher))
  return Array.from(set)
})

const filteredNotices = computed(() => {
  let list = [...noticeList.value]
  // 搜索过滤
  if (searchKeyword.value.trim()) {
    const kw = searchKeyword.value.trim().toLowerCase()
    list = list.filter(n => n.title.toLowerCase().includes(kw))
  }
  // 发布人过滤
  if (publisherFilter.value) {
    list = list.filter(n => n.publisher === publisherFilter.value)
  }
  // 排序
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

// 分页数据
const pagedNotices = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  return filteredNotices.value.slice(start, start + pageSize.value)
})

// 查询按钮
const handleSearch = () => {
  currentPage.value = 1
}

// 重置筛选
const handleReset = () => {
  searchKeyword.value = ''
  publisherFilter.value = ''
  currentPage.value = 1
}

// 搜索/筛选变更时重置到第一页
watch([searchKeyword, publisherFilter], () => {
  currentPage.value = 1
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

// 趋势图标：使用 Element Plus 图标替代 emoji
const getTrendIcon = (trend) => {
  if (trend === 'up') return Top
  if (trend === 'down') return Bottom
  return Right
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

// ==================== 通知列表列配置 ====================
const noticeColumns = [
  { prop: 'title', label: '通知标题', minWidth: 220, showOverflowTooltip: true },
  { prop: 'publishTime', label: '发布时间', width: 120, sortable: 'custom' },
  { prop: 'publisher', label: '发布人', width: 100 },
  { prop: 'targetCount', label: '目标企业数', width: 110, sortable: 'custom', align: 'right' },
  { prop: 'readCount', label: '已读数', width: 80, sortable: 'custom', align: 'right' },
  { prop: 'unreadCount', label: '未读数', width: 80, sortable: 'custom', align: 'right', slot: 'unreadCount' },
  { prop: 'readRate', label: '已读率', width: 100, sortable: 'custom', align: 'center', slot: 'readRate' },
  { prop: 'needFeedback', label: '是否需反馈', width: 110, align: 'center', slot: 'needFeedback' },
  { prop: 'feedbackRate', label: '反馈完成率', width: 110, align: 'center', slot: 'feedbackRate' },
  { prop: 'actions', label: '操作', width: 120, align: 'right', slot: 'actions', fixed: 'right' },
]

// ==================== 企业排名表列配置 ====================
const rankingColumns = [
  { prop: 'rank', label: '排名', width: 60, align: 'center', slot: 'rank' },
  { prop: 'name', label: '企业名称', minWidth: 100 },
  { prop: 'rate', label: '已读率', width: 80, align: 'center', slot: 'rate' },
  { prop: 'trend', label: '趋势', width: 60, align: 'center', slot: 'trend' },
]

// ==================== 导出 ====================
const handleExport = () => {
  ElMessage.success('导出功能开发中，即将支持导出为Excel格式')
}
</script>

<template>
  <div class="page-content">
    <!-- ==================== 页面标题 ==================== -->
    <PageHeader
      title="石楼动态资讯"
      subtitle="通知下发 → 阅读 → 反馈 → 催办 闭环管理"
      show-back
      back-text="返回一级页面"
    >
    </PageHeader>

    <!-- ==================== 骨架屏加载 ==================== -->
    <template v-if="pageLoading">
      <el-skeleton :rows="5" animated class="skeleton-section" />
      <el-skeleton :rows="8" animated class="skeleton-section" />
    </template>

    <template v-else>
      <!-- ==================== 3.1 综合统计看板 ==================== -->
      <div class="section">
        <div class="stats-title-row">
          <h3 class="section-title">综合统计看板</h3>
          <div class="stats-title-filter">
            <span class="stats-filter-label">数据范围：</span>
            <el-select v-model="timeRange" class="time-range-select">
              <el-option
                v-for="opt in timeRangeOptions"
                :key="opt.value"
                :label="opt.label"
                :value="opt.value"
              />
            </el-select>
          </div>
        </div>
        <el-row :gutter="16" class="stats-row">
          <el-col class="stats-col">
            <StatsCard type="compact" :value="stats.totalNotices" label="通知总数" status="primary" />
          </el-col>
          <el-col class="stats-col">
            <StatsCard type="compact" :value="stats.totalShouldRead" label="应读总人次" />
          </el-col>
          <el-col class="stats-col">
            <StatsCard type="compact" :value="stats.totalRead" label="已读总人次" status="success" />
          </el-col>
          <el-col class="stats-col">
            <StatsCard
              type="compact"
              :value="stats.readRate"
              label="整体已读率"
              :progress="stats.readRate"
            />
          </el-col>
          <el-col class="stats-col">
            <StatsCard
              type="compact"
              :value="stats.totalUnread"
              label="未读总人次"
              status="danger"
              tag="需催办"
              tag-type="danger"
            />
          </el-col>
          <el-col class="stats-col">
            <StatsCard
              type="compact"
              :value="stats.feedbackNotices"
              label="要求反馈通知数"
              status="warning"
              tag="需提醒"
              tag-type="warning"
            />
          </el-col>
        </el-row>
      </div>

      <!-- ==================== 3.2 通知列表 ==================== -->
      <div class="section">
        <h3 class="section-title">通知列表</h3>

        <!-- 筛选栏（独立于标题行） -->
        <div class="filter-bar">
          <div class="filter-bar-left">
            <el-input
              v-model="searchKeyword"
              placeholder="搜索通知标题"
              clearable
              :prefix-icon="Search"
              class="search-input"
            />
            <span class="filter-label">发布人：</span>
            <el-select
              v-model="publisherFilter"
              placeholder="全部"
              clearable
              class="publisher-select"
            >
              <el-option
                v-for="pub in publishers"
                :key="pub"
                :label="pub"
                :value="pub"
              />
            </el-select>
            <SysButton type="primary" @click="handleSearch">查询</SysButton>
            <SysButton type="default" variant="ghost" @click="handleReset">重置</SysButton>
          </div>
          <div class="filter-bar-right">
            <SysButton type="default" :icon="Download" @click="handleExport">
              导出Excel
            </SysButton>
          </div>
        </div>

        <!-- 空状态 -->
        <div v-if="filteredNotices.length === 0" class="empty-state">
          <el-empty description="暂无匹配的通知数据" />
        </div>

        <!-- 通知表格 -->
        <template v-else>
          <SysTable
            :data="pagedNotices"
            :columns="noticeColumns"
            stripe
            :pagination="{ layout: 'total, sizes, prev, pager, next', pageSize: pageSize }"
            :total="totalNotices"
            v-model:current-page="currentPage"
            :default-sort="{ prop: 'unreadCount', order: 'descending' }"
            @sort-change="handleTableSort"
          >
            <template #unreadCount="{ row }">
              <span :class="{ 'unread-highlight': row.unreadCount > 4 }">{{ row.unreadCount }}</span>
            </template>
            <template #readRate="{ row }">
              <span :style="{ color: getRateColor(row.readRate), fontWeight: 'var(--font-weight-medium)' }">
                {{ row.readRate }}%
              </span>
            </template>
            <template #needFeedback="{ row }">
              <SysTag size="small" :type="row.needFeedback ? 'warning' : 'info'" variant="outline">
                {{ row.needFeedback ? '是' : '否' }}
              </SysTag>
            </template>
            <template #feedbackRate="{ row }">
              <template v-if="row.needFeedback && row.feedbackRate !== null">
                <span :style="{ color: getRateColor(row.feedbackRate), fontWeight: 'var(--font-weight-medium)' }">
                  {{ row.feedbackRate }}%
                </span>
              </template>
              <template v-else>
                <span class="text-muted">—</span>
              </template>
            </template>
            <template #actions="{ row }">
              <SysButton type="primary" variant="link" size="small" @click="handleViewDetail(row)">
                详情
              </SysButton>
              <SysButton
                type="warning"
                variant="ghost"
                size="small"
                :disabled="row.unreadCount === 0"
                @click="handleUrge(row)"
              >
                催办
              </SysButton>
            </template>
          </SysTable>
        </template>
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
        <el-row :gutter="16" class="ranking-row">
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
                <SysTable :data="enterpriseRanking" :columns="rankingColumns" stripe :pagination="false" size="small">
                  <template #rank="{ row, index }">
                    <span
                      class="rank-badge"
                      :class="{
                        'rank-badge--gold': index === 0,
                        'rank-badge--silver': index === 1,
                        'rank-badge--bronze': index === 2,
                      }"
                    >{{ index + 1 }}</span>
                  </template>
                  <template #rate="{ row }">
                    <span :style="{ color: getRateColor(row.rate), fontWeight: 'var(--font-weight-medium)' }">
                      {{ row.rate }}%
                    </span>
                  </template>
                  <template #trend="{ row }">
                    <span :style="{ color: getTrendColor(row.trend) }">
                      <el-icon :size="14"><component :is="getTrendIcon(row.trend)" /></el-icon>
                    </span>
                  </template>
                </SysTable>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
    </template>
  </div>
</template>

<style scoped>
/* ==================== 骨架屏 ==================== */
.skeleton-section {
  margin-bottom: var(--spacing-lg);
  padding: var(--spacing-lg);
  background: var(--fill-surface);
  border-radius: var(--radius-lg);
}

/* ==================== 筛选栏（独立于表格标题行） ==================== */
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

/* ==================== Section 通用 ==================== */
.section {
  margin-bottom: var(--spacing-lg);
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
}

/* ==================== 搜索 & 发布人筛选 ==================== */
.search-input {
  width: 200px;
}

.publisher-select {
  width: 140px;
}

/* ==================== 统计卡片区域 ==================== */
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
.stats-row {
  margin-bottom: 0;
  display: flex;
}
.stats-col {
  flex: 1;
}

/* ==================== 通知表格 ==================== */
.unread-highlight {
  color: var(--color-danger);
  font-weight: var(--font-weight-bold);
}

.text-muted {
  color: var(--text-muted);
}

/* ==================== 空状态 ==================== */
.empty-state {
  padding: var(--spacing-lg) 0;
  background: var(--fill-surface);
  border-radius: var(--radius-lg);
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
  gap: var(--spacing-xs);
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
  font-size: var(--font-size-xs);
}

.chart-point-label {
  font-size: var(--font-size-xs);
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
  font-size: var(--font-size-xs);
}

/* 排名行间距 */
.ranking-row {
  margin-top: var(--spacing-md);
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
  gap: var(--spacing-xs);
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
  background: var(--color-warning);
  color: var(--text-inverse);
}

.rank-badge--silver {
  background: var(--text-muted);
  color: var(--text-inverse);
}

.rank-badge--bronze {
  background: var(--color-warning-bg);
  color: var(--color-warning);
}
</style>