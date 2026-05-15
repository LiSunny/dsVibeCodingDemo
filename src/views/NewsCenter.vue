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
import SysLineChart from '@/components/SysLineChart.vue'
import SysBarChart from '@/components/SysBarChart.vue'

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

// 折线图数据：转为多系列格式供 SysLineChart 使用
const lineChartData = computed(() => {
  const result = []
  trendData.value.forEach(d => {
    result.push({ month: d.month.substring(5) + '月', type: '通知数量', value: d.noticeCount })
    result.push({ month: d.month.substring(5) + '月', type: '未读企业数', value: d.unreadCount })
  })
  return result
})

// 水平柱状图数据：各月平均已读率
const rateBarData = computed(() =>
  trendData.value.map(d => ({
    month: d.month.substring(5) + '月',
    rate: d.avgReadRate,
  }))
)

// 3.4.2 企业历史已读率排名
const enterpriseRanking = ref([
  { name: '宏达制造', shouldRead: 12, read: 12, rate: 100, trend: 'up' },
  { name: '兴隆纺织', shouldRead: 12, read: 11, rate: 91.7, trend: 'flat' },
  { name: '永盛科技', shouldRead: 12, read: 10, rate: 83.3, trend: 'up' },
  { name: '新欣食品', shouldRead: 12, read: 8, rate: 66.7, trend: 'down' },
  { name: '宏远物流', shouldRead: 12, read: 6, rate: 50.0, trend: 'down' },
  { name: '德力机械', shouldRead: 12, read: 5, rate: 41.7, trend: 'down' },
])

// 柱状图数据：企业已读率排名供 SysBarChart 使用
const rankingBarData = computed(() => {
  return enterpriseRanking.value.map(item => ({
    name: item.name,
    rate: item.rate,
  }))
})

// 分组柱状图数据：各企业应读 vs 已读次数
const compareBarData = computed(() => {
  const result = []
  enterpriseRanking.value.forEach(item => {
    result.push({ name: item.name, type: '应读次数', value: item.shouldRead })
    result.push({ name: item.name, type: '已读次数', value: item.read })
  })
  return result
})

const getRateColor = (rate) => {
  if (rate >= 90) return 'var(--color-success)'
  if (rate >= 70) return 'var(--color-warning)'
  return 'var(--color-danger)'
}

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
          <el-col :span="12">
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
                <SysLineChart
                  :data="lineChartData"
                  x-field="month"
                  y-field="value"
                  series-field="type"
                  :colors="['#3678E3', '#DC2626']"
                  :smooth="true"
                  :point="true"
                  :height="280"
                  :legend="false"
                  :y-axis-grid="true"
                />
              </div>
            </div>
          </el-col>

          <!-- 各月平均已读率：纵向柱状图 -->
          <el-col :span="12">
            <div class="chart-panel">
              <div class="chart-panel-header">
                <span class="chart-panel-title">各月平均已读率</span>
              </div>
              <div class="chart-body">
                <SysBarChart
                  :data="rateBarData"
                  x-field="month"
                  y-field="rate"
                  :height="220"
                  :bar-radius="8"
                  :label="true"
                />
              </div>
            </div>
          </el-col>
        </el-row>

        <!-- 3.4.2 各企业历史已读率排名 -->
        <el-row :gutter="16" class="chart-row">
          <el-col :span="12">
            <div class="chart-panel">
              <div class="chart-panel-header">
                <span class="chart-panel-title">各企业历史已读率排名（近30天）</span>
              </div>
              <div class="chart-body">
                <SysBarChart
                  :data="rankingBarData"
                  x-field="rate"
                  y-field="name"
                  :is-horizontal="true"
                  :height="240"
                  :bar-radius="4"
                  :label="true"
                  label-position="right"
                />
              </div>
            </div>
          </el-col>

          <!-- 各企业应读 vs 已读次数对比 -->
          <el-col :span="12">
            <div class="chart-panel">
              <div class="chart-panel-header">
                <span class="chart-panel-title">各企业应读 vs 已读次数对比</span>
              </div>
              <div class="chart-body">
                <SysBarChart
                  :data="compareBarData"
                  x-field="name"
                  y-field="value"
                  series-field="type"
                  :colors="['#3678E3', '#059669']"
                  :height="240"
                  :bar-radius="4"
                  :label="true"
                />
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
  height: 100%;
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
  height: 100%;
}

.chart-row {
  margin-top: var(--spacing-md);
}

</style>
