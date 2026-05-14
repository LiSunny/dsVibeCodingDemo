<!--
  组件名称: PersonnelSupervisionDetail
  用途: 模块4 - 重点人员联勤二级专题页面，含综合统计看板、人员档案列表、历史趋势分析
-->
<script setup>
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { User, Calendar, TrendCharts, Warning } from '@element-plus/icons-vue'
import StatsCard from '@/components/StatsCard.vue'
import SysTable from '@/components/SysTable.vue'
import SysButton from '@/components/SysButton.vue'
import SysTag from '@/components/SysTag.vue'
import PageHeader from '@/components/PageHeader.vue'

const router = useRouter()

// ==================== 加载状态 ====================
const pageLoading = ref(true)
setTimeout(() => { pageLoading.value = false }, 600)

// ============================================================
// 筛选器状态
// ============================================================
const timeRange = ref('30')
const personTypeFilter = ref('all')
const visitStatusFilter = ref('all')
const communityFilter = ref('all')
const searchKeyword = ref('')
const currentPage = ref(1)
const pageSize = ref(10)

const timeOptions = [
  { label: '今日', value: 'today' },
  { label: '近7天', value: '7' },
  { label: '近30天', value: '30' },
  { label: '全部历史', value: 'all' },
]

const personTypeOptions = [
  { label: '全部类型', value: 'all' },
  { label: '独居老人', value: '独居老人' },
  { label: '残障', value: '残障' },
  { label: '涉稳', value: '涉稳' },
  { label: '刑满释放', value: '刑满释放' },
]

const visitStatusOptions = [
  { label: '全部状态', value: 'all' },
  { label: '已走访', value: 'visited' },
  { label: '未走访', value: 'unvisited' },
  { label: '漏访', value: 'missed' },
]

const communityOptions = [
  { label: '全部区域', value: 'all' },
  { label: '北村', value: '北村' },
  { label: '南村', value: '南村' },
  { label: '石楼村', value: '石楼村' },
  { label: '东村', value: '东村' },
  { label: '西村', value: '西村' },
]

// ============================================================
// 重点人员档案数据（模拟数据 - 按文档4.2节）
// ============================================================
const allPersonnel = ref([])

const generateMockData = () => {
  const types = ['独居老人', '残障', '涉稳', '刑满释放']
  const communities = ['北村', '南村', '石楼村', '东村', '西村']
  const assignees = ['张三', '李四', '王五', '赵六', '网格员A', '网格员B']
  const statuses = ['已走访', '未走访', '漏访']

  const list = []
  // 独居老人68人、残障42人、涉稳28人、刑满释放18人
  const typeCounts = { '独居老人': 68, '残障': 42, '涉稳': 28, '刑满释放': 18 }

  let id = 1
  for (const [type, count] of Object.entries(typeCounts)) {
    for (let i = 0; i < count; i++) {
      const community = communities[Math.floor(Math.random() * communities.length)]
      const status = statuses[Math.floor(Math.random() * statuses.length)]
      const lastVisitDays = Math.floor(Math.random() * 15)
      const age = 40 + Math.floor(Math.random() * 50)

      list.push({
        id: id++,
        name: `示例${type}${i + 1}`,
        gender: Math.random() > 0.5 ? '男' : '女',
        age,
        type,
        community,
        emergencyContact: '家',
        emergencyPhone: `138****${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`,
        visitCycle: type === '独居老人' ? '每周' : '每半月',
        lastVisitDate: lastVisitDays === 0 ? '今日' : `${lastVisitDays}天前`,
        status,
        assignee: assignees[id % assignees.length],
      })
    }
  }
  allPersonnel.value = list
}

generateMockData()

// ============================================================
// 筛选后的数据
// ============================================================
const filteredPersonnel = computed(() => {
  let data = [...allPersonnel.value]

  // 人员类型筛选
  if (personTypeFilter.value !== 'all') {
    data = data.filter(r => r.type === personTypeFilter.value)
  }

  // 走访状态筛选
  if (visitStatusFilter.value !== 'all') {
    data = data.filter(r => r.status === visitStatusFilter.value)
  }

  // 区域筛选
  if (communityFilter.value !== 'all') {
    data = data.filter(r => r.community === communityFilter.value)
  }

  // 搜索筛选
  if (searchKeyword.value.trim()) {
    const kw = searchKeyword.value.trim()
    data = data.filter(r => r.name.includes(kw))
  }

  return data
})

// ============================================================
// 综合统计看板数据（按文档4.2节示例数据）
// ============================================================
const totalPersonnel = computed(() => filteredPersonnel.value.length)

const typeStats = computed(() => {
  const map = {}
  filteredPersonnel.value.forEach(p => {
    if (!map[p.type]) map[p.type] = 0
    map[p.type]++
  })
  return map
})

// 按文档4.2节示例：重点人员156人，应走访468人次，实际412，漏访56，完成率88%
const statsData = computed(() => {
  const total = 156
  const shouldVisit = 468
  const actualVisit = 412
  const missedVisit = 56
  const completionRate = (actualVisit / shouldVisit * 100).toFixed(1)
  const avgResponseDays = 1.2
  const missedPersonCount = 32
  const missedRate = (missedVisit / shouldVisit * 100).toFixed(1)

  // 各类人员完成率
  const typeCompletionRate = {
    '独居老人': 91.9,
    '残障': 84.9,
    '涉稳': 78.6,
    '刑满释放': 83.3,
  }

  return { total, shouldVisit, actualVisit, missedVisit, completionRate, avgResponseDays, missedPersonCount, missedRate, typeCompletionRate }
})

// ============================================================
// 分页数据
// ============================================================
const pagedPersonnel = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  return filteredPersonnel.value.slice(start, start + pageSize.value)
})

const total = computed(() => filteredPersonnel.value.length)

const clearPage = () => { currentPage.value = 1 }
watch([timeRange, personTypeFilter, visitStatusFilter, communityFilter, searchKeyword], clearPage)

// ============================================================
// 筛选操作
// ============================================================
const handleSearch = () => {
  currentPage.value = 1
}

const handleReset = () => {
  searchKeyword.value = ''
  personTypeFilter.value = 'all'
  visitStatusFilter.value = 'all'
  communityFilter.value = 'all'
  currentPage.value = 1
}

const handleExport = () => {
  ElMessage.success('正在导出人员档案数据...')
}

// ============================================================
// 表格列配置
// ============================================================
const tableColumns = [
  { prop: 'name', label: '姓名', width: 90 },
  { prop: 'gender', label: '性别', width: 60 },
  { prop: 'age', label: '年龄', width: 60 },
  { prop: 'type', label: '类型', width: 100, slot: 'type' },
  { prop: 'community', label: '村/社区', minWidth: 100 },
  { prop: 'emergencyContact', label: '应急联系人', width: 100 },
  { prop: 'emergencyPhone', label: '联系电话', width: 120 },
  { prop: 'visitCycle', label: '走访周期', width: 90 },
  { prop: 'lastVisitDate', label: '最近走访', width: 90 },
  { prop: 'status', label: '当前状态', width: 90, slot: 'status' },
  { prop: 'assignee', label: '责任人', width: 80 },
  { prop: 'action', label: '操作', width: 200, slot: 'action', align: 'center' },
]

// 获取人员类型标签颜色
const getTypeTagType = (type) => {
  if (type === '独居老人') return 'warning'
  if (type === '残障') return 'info'
  if (type === '涉稳') return 'danger'
  if (type === '刑满释放') return 'primary'
  return 'default'
}

// 获取走访状态标签颜色
const getStatusType = (status) => {
  if (status === '已走访') return 'success'
  if (status === '未走访') return 'warning'
  if (status === '漏访') return 'danger'
  return 'default'
}

// ============================================================
// 历史趋势数据（按文档4.3节示例数据 - 近7天）
// ============================================================
const trendData = ref([
  { label: '05-05', shouldVisit: 24, actualVisit: 22, missed: 2, completionRate: 91.7, totalMissed: 5 },
  { label: '05-06', shouldVisit: 26, actualVisit: 23, missed: 3, completionRate: 88.5, totalMissed: 6 },
  { label: '05-07', shouldVisit: 28, actualVisit: 24, missed: 4, completionRate: 85.7, totalMissed: 8 },
  { label: '05-08', shouldVisit: 30, actualVisit: 25, missed: 5, completionRate: 83.3, totalMissed: 10 },
  { label: '05-09', shouldVisit: 25, actualVisit: 20, missed: 5, completionRate: 80.0, totalMissed: 12 },
  { label: '05-10', shouldVisit: 22, actualVisit: 18, missed: 4, completionRate: 81.8, totalMissed: 14 },
  { label: '05-11', shouldVisit: 25, actualVisit: 17, missed: 8, completionRate: null, totalMissed: 5 },
])

const maxTrendVal = computed(() => {
  let max = 0
  trendData.value.forEach(d => { max = Math.max(max, d.shouldVisit) })
  return max || 1
})

// ============================================================
// 各类人员走访完成率（按文档4.4节示例）
// ============================================================
const typeCompletionData = ref([
  { type: '独居老人', totalPeople: 68, shouldVisit: 272, actualVisit: 250, rate: 91.9, missedRate: 8.1 },
  { type: '残障', totalPeople: 42, shouldVisit: 126, actualVisit: 107, rate: 84.9, missedRate: 15.1 },
  { type: '涉稳', totalPeople: 28, shouldVisit: 56, actualVisit: 44, rate: 78.6, missedRate: 21.4 },
  { type: '刑满释放', totalPeople: 18, shouldVisit: 36, actualVisit: 30, rate: 83.3, missedRate: 16.7 },
])

const maxTypeVal = computed(() => {
  let max = 0
  typeCompletionData.value.forEach(d => { max = Math.max(max, d.shouldVisit) })
  return max || 1
})

// ============================================================
// 各村/社区走访完成率排名（按文档4.4节示例）
// ============================================================
const communityRankData = ref([
  { rank: 1, community: '北村', shouldVisit: 52, actualVisit: 50, rate: 96.2, missed: 2 },
  { rank: 2, community: '南村', shouldVisit: 68, actualVisit: 63, rate: 92.6, missed: 5 },
  { rank: 3, community: '石楼村', shouldVisit: 120, actualVisit: 108, rate: 90.0, missed: 12 },
  { rank: 4, community: '东村', shouldVisit: 98, actualVisit: 84, rate: 85.7, missed: 14 },
  { rank: 5, community: '西村', shouldVisit: 85, actualVisit: 70, rate: 82.4, missed: 15 },
])

const getRankColor = (rank) => {
  if (rank === 1) return 'var(--color-success)'
  if (rank === 2) return 'var(--color-warning)'
  if (rank <= 4) return 'var(--color-info)'
  return 'var(--text-muted)'
}

// ============================================================
// 导航 & 操作
// ============================================================
const goToItem = (row) => {
  router.push(`/personnel-supervision/detail/${row.id}`)
}

const handleDispatch = (row) => {
  ElMessage.success(`已为「${row.name}」派发走访任务`)
}

const handleUrge = (row) => {
  ElMessage.success(`已向责任人发送催办提醒`)
}

const goBack = () => {
  router.push('/personnel-supervision')
}
</script>

<template>
  <div class="page-content">
    <!-- ============================================================ -->
    <!-- 页面标题栏 -->
    <!-- ============================================================ -->
    <PageHeader
      title="重点人员联勤 · 专题分析"
      show-back
      back-text="返回一级页面"
      back-path="/personnel-supervision"
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
            <StatsCard type="compact" :value="statsData.total" label="重点人员总数" status="primary" />
          </el-col>
          <el-col class="stats-col">
            <StatsCard type="compact" :value="statsData.shouldVisit" label="应走访总人次" status="primary" />
          </el-col>
          <el-col class="stats-col">
            <StatsCard type="compact" :value="statsData.actualVisit" label="实际走访人次" status="success" />
          </el-col>
          <el-col class="stats-col">
            <StatsCard type="compact" :value="statsData.missedVisit" label="漏访人次" status="danger" tag="需追访" tag-type="danger" />
          </el-col>
          <el-col class="stats-col">
            <StatsCard type="compact" :value="statsData.completionRate + '%'" label="走访完成率" status="primary" />
          </el-col>
          <el-col class="stats-col">
            <StatsCard type="compact" :value="statsData.avgResponseDays + '天'" label="平均响应时长" status="primary" tag="仅已走访" tag-type="info" />
          </el-col>
          <el-col class="stats-col">
            <StatsCard type="compact" :value="statsData.missedPersonCount + '人'" label="漏访人员数" status="warning" />
          </el-col>
          <el-col class="stats-col">
            <StatsCard type="compact" :value="statsData.missedRate + '%'" label="漏访率" status="warning" />
          </el-col>
        </el-row>

        <!-- 各类人员走访完成率对比 -->
        <div class="type-comparison">
          <div class="type-comparison-header">
            <span class="type-comparison-title">各类人员走访完成率对比</span>
          </div>
          <div class="type-comparison-list">
            <div v-for="item in typeCompletionData" :key="item.type" class="type-comparison-row">
              <SysTag :type="getTypeTagType(item.type)" size="small">{{ item.type }}</SysTag>
              <div class="type-bar-bg">
                <div
                  class="type-bar-fill"
                  :style="{
                    width: (item.rate / 100 * 100) + '%',
                    background: item.rate >= 90 ? 'var(--color-success)' : item.rate >= 80 ? 'var(--color-warning)' : 'var(--color-danger)'
                  }"
                ></div>
              </div>
              <span class="type-rate" :style="{ color: item.rate >= 90 ? 'var(--color-success)' : item.rate >= 80 ? 'var(--color-warning)' : 'var(--color-danger)' }">
                {{ item.rate }}%
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- ============================================================ -->
      <!-- 3.2 人员档案列表 -->
      <!-- ============================================================ -->
      <div class="section">
        <div class="section-header">
          <h3 class="section-title">人员档案列表（{{ total }} 人）</h3>
        </div>

        <!-- 筛选栏 -->
        <div class="filter-bar">
          <div class="filter-bar-left">
            <el-input
              v-model="searchKeyword"
              placeholder="搜索姓名"
              clearable
              class="search-input"
            />
            <span class="filter-label">类型：</span>
            <el-select v-model="personTypeFilter" placeholder="全部" clearable class="filter-select">
              <el-option v-for="opt in personTypeOptions" :key="opt.value" :label="opt.label" :value="opt.value" />
            </el-select>
            <span class="filter-label">状态：</span>
            <el-select v-model="visitStatusFilter" placeholder="全部" clearable class="filter-select">
              <el-option v-for="opt in visitStatusOptions" :key="opt.value" :label="opt.label" :value="opt.value" />
            </el-select>
            <span class="filter-label">区域：</span>
            <el-select v-model="communityFilter" placeholder="全部" clearable class="filter-select">
              <el-option v-for="opt in communityOptions" :key="opt.value" :label="opt.label" :value="opt.value" />
            </el-select>
            <SysButton type="primary" @click="handleSearch">查询</SysButton>
            <SysButton type="default" variant="ghost" @click="handleReset">重置</SysButton>
          </div>
          <div class="filter-bar-right">
            <SysButton type="default" @click="handleExport">导出Excel</SysButton>
          </div>
        </div>

        <!-- 空状态 -->
        <div v-if="filteredPersonnel.length === 0" class="empty-state">
          <el-empty description="暂无匹配的人员档案" />
        </div>

        <template v-else>
          <SysTable
            :data="pagedPersonnel"
            :columns="tableColumns"
            stripe
            :pagination="{ layout: 'total, sizes, prev, pager, next', pageSize: pageSize }"
            :total="total"
            v-model:current-page="currentPage"
          >
            <!-- 类型插槽 -->
            <template #type="{ row }">
              <SysTag :type="getTypeTagType(row.type)" size="small">
                {{ row.type }}
              </SysTag>
            </template>

            <!-- 状态插槽 -->
            <template #status="{ row }">
              <SysTag :type="getStatusType(row.status)" size="small">
                {{ row.status }}
              </SysTag>
            </template>

            <!-- 操作插槽 -->
            <template #action="{ row }">
              <div class="action-cell">
                <SysButton type="primary" variant="ghost" size="small" @click="goToItem(row)">
                  详情
                </SysButton>
                <SysButton
                  v-if="row.status !== '已走访'"
                  type="primary"
                  size="small"
                  variant="ghost"
                  @click="handleDispatch(row)"
                  style="margin-left: 4px"
                >
                  派发任务
                </SysButton>
                <SysButton
                  v-if="row.status !== '已走访'"
                  type="warning"
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
        </template>
      </div>

      <!-- ============================================================ -->
      <!-- 3.4 历史趋势与效率分析 -->
      <!-- ============================================================ -->
      <div class="analysis-grid">
        <!-- 每日应访 vs 实际走访 vs 漏访 -->
        <div class="section-card chart-card">
          <div class="section-header"><h2>每日应访 vs 实际走访 vs 漏访（近7天）</h2></div>
          <div class="chart-bar-group">
            <div v-for="d in trendData" :key="d.label" class="bar-col">
              <div class="bar-stack-wrap">
                <div class="bar-stack">
                  <div class="bar-should" :style="{ height: (d.shouldVisit / maxTrendVal * 100) + '%' }">
                    <span class="bar-val">{{ d.shouldVisit }}</span>
                  </div>
                </div>
                <div class="bar-actual-wrap">
                  <div class="bar-actual" :style="{ height: (d.actualVisit / maxTrendVal * 100) + '%' }">
                    <span class="bar-val">{{ d.actualVisit }}</span>
                  </div>
                </div>
                <div class="bar-missed-wrap" v-if="d.missed > 0">
                  <div class="bar-missed" :style="{ height: (d.missed / maxTrendVal * 100) + '%' }">
                    <span class="bar-val-small">{{ d.missed }}</span>
                  </div>
                </div>
              </div>
              <span class="bar-label">{{ d.label }}</span>
            </div>
          </div>
          <div class="chart-legend">
            <span class="legend-item"><span class="legend-dot should"></span>应访人数</span>
            <span class="legend-item"><span class="legend-dot actual"></span>实际走访</span>
            <span class="legend-item"><span class="legend-dot missed"></span>漏访</span>
          </div>
        </div>

        <!-- 走访完成率趋势 -->
        <div class="section-card chart-card">
          <div class="section-header"><h2>走访完成率趋势</h2></div>
          <div class="chart-line-group">
            <div v-for="d in trendData" :key="d.label" class="line-col">
              <div class="line-track">
                <div
                  class="line-fill-rate"
                  :style="{
                    height: (d.completionRate || 0) + '%',
                    background: (d.completionRate || 0) >= 95 ? 'var(--color-success)' : (d.completionRate || 0) >= 80 ? 'var(--color-warning)' : 'var(--color-danger)'
                  }"
                ></div>
              </div>
              <span class="line-pct">{{ d.completionRate ? d.completionRate + '%' : '—' }}</span>
              <span class="bar-label">{{ d.label }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 各村/社区走访完成率排名 -->
      <div class="section-card">
        <div class="section-header"><h2 class="section-title-text">各村/社区走访完成率排名</h2></div>
        <SysTable
          :data="communityRankData"
          :columns="[
            { prop: 'rank', label: '排名', width: 60, slot: 'rank' },
            { prop: 'community', label: '村/社区', minWidth: 100 },
            { prop: 'shouldVisit', label: '应访总人次', width: 100 },
            { prop: 'actualVisit', label: '实际走访人次', width: 120 },
            { prop: 'rate', label: '完成率', width: 100, slot: 'rate' },
            { prop: 'missed', label: '漏访人次', width: 100 },
          ]"
          :pagination="false"
          :bordered="true"
        >
          <template #rank="{ row }">
            <span class="rank-badge" :style="{ color: getRankColor(row.rank) }">#{{ row.rank }}</span>
          </template>
          <template #rate="{ row }">
            <SysTag
              :type="row.rate >= 95 ? 'success' : row.rate >= 80 ? 'warning' : 'danger'"
              size="small"
            >
              {{ row.rate }}%
            </SysTag>
          </template>
        </SysTable>
      </div>
    </template>
  </div>
</template>

<style scoped>
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

/* ==================== 筛选栏 ==================== */
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

.search-input {
  width: 160px;
}

/* ============================================================
 * 统计行
 * ============================================================ */
.stats-row {
  margin-bottom: var(--spacing-md);
  display: flex;
  flex-wrap: wrap;
}

.stats-col {
  flex: 1;
  min-width: 140px;
}

/* ==================== 类型对比 ==================== */
.type-comparison {
  background: var(--fill-surface);
  border-radius: var(--radius-lg);
  border: 1px solid var(--border-default);
  padding: var(--spacing-md);
}

.type-comparison-header {
  margin-bottom: var(--spacing-8);
}

.type-comparison-title {
  font-size: var(--font-size-small);
  color: var(--text-secondary);
  font-weight: var(--font-weight-medium);
}

.type-comparison-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-6);
}

.type-comparison-row {
  display: flex;
  align-items: center;
  gap: var(--spacing-8);
}

.type-bar-bg {
  flex: 1;
  height: 12px;
  background: var(--fill-hover);
  border-radius: var(--radius-xs);
  overflow: hidden;
}

.type-bar-fill {
  height: 100%;
  border-radius: var(--radius-xs);
  transition: width 0.4s ease;
  min-width: 4px;
}

.type-rate {
  font-size: var(--font-size-small);
  font-weight: var(--font-weight-bold);
  width: 50px;
  text-align: right;
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
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  font-size: var(--font-size-body);
  font-weight: var(--font-weight-medium);
  color: var(--text-primary);
  margin: 0;
}

.section-header h2::before {
  content: '';
  display: inline-block;
  width: 3px;
  height: 1em;
  background: var(--color-primary);
  border-radius: 2px;
  flex-shrink: 0;
  margin-right: var(--spacing-6);
}

/* ============================================================
 * 列表区域
 * ============================================================ */
.section {
  margin-bottom: var(--spacing-lg);
}

.section-header {
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

/* ==================== 空状态 ==================== */
.empty-state {
  padding: var(--spacing-lg) 0;
  background: var(--fill-surface);
  border-radius: var(--radius-lg);
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
  height: 180px;
  padding: 0 var(--spacing-8);
}

.bar-col {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-4);
  flex: 1;
}

.bar-stack-wrap {
  width: 48px;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.bar-stack {
  flex: 1;
  display: flex;
  flex-direction: column-reverse;
}

.bar-should {
  background: var(--color-primary);
  display: flex;
  align-items: flex-start;
  justify-content: center;
  border-radius: var(--radius-xs) var(--radius-xs) 0 0;
  transition: height 0.4s ease;
  min-height: 0;
}

.bar-actual-wrap {
  width: 24px;
  align-self: flex-end;
  margin-right: 4px;
}

.bar-actual {
  background: var(--color-success);
  display: flex;
  align-items: flex-start;
  justify-content: center;
  border-radius: var(--radius-xs);
  transition: height 0.4s ease;
  min-height: 0;
}

.bar-missed-wrap {
  width: 12px;
  align-self: flex-end;
}

.bar-missed {
  background: var(--color-danger);
  display: flex;
  align-items: flex-start;
  justify-content: center;
  border-radius: var(--radius-xs);
  transition: height 0.4s ease;
  min-height: 8px;
}

.bar-val {
  font-size: 10px;
  color: var(--text-inverse);
  font-weight: var(--font-weight-bold);
  padding-top: 2px;
}

.bar-val-small {
  font-size: 8px;
  color: var(--text-inverse);
  font-weight: var(--font-weight-bold);
  padding-top: 1px;
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

.legend-dot.should { background: var(--color-primary); }
.legend-dot.actual { background: var(--color-success); }
.legend-dot.missed { background: var(--color-danger); }

/* ============================================================
 * 准确率趋势线图
 * ============================================================ */
.chart-line-group {
  display: flex;
  align-items: flex-end;
  justify-content: space-around;
  height: 180px;
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

.line-fill-rate {
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
 * 排名徽章
 * ============================================================ */
.rank-badge {
  font-size: var(--font-size-body);
  font-weight: var(--font-weight-bold);
}

/* ============================================================
 * 操作按钮组
 * ============================================================ */
.action-cell {
  display: flex;
  align-items: center;
  gap: 0;
}
</style>