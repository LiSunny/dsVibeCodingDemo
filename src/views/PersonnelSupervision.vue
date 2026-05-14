<!--
  组件名称: PersonnelSupervision
  用途: 模块4 - 重点人员联勤一级页面，展示今日应访、漏访预警及未访人员列表
-->
<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { User, Clock, Bell } from '@element-plus/icons-vue'
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
// 核心指标数据（示例数据 - 按文档4.1节）
// ============================================================
const todayStats = computed(() => ({
  todayUnvisited: 8,          // 今日未访人数（橙色，需今日完成）
  totalMissed: 5,             // 累计漏访人数（红色，严重漏访）
  todayShouldVisit: 25,       // 今日应访总数
  yesterdayShouldVisit: 22,   // 昨日应访总数（用于环比）
  coverageRate: 86,           // 走访覆盖率近7天（%）
}))

const ringChange = computed(() => {
  const diff = todayStats.value.todayShouldVisit - todayStats.value.yesterdayShouldVisit
  return diff >= 0 ? `环比昨日+${diff}` : `环比昨日${diff}`
})

// ============================================================
// 漏访/未访人员列表（前5条，按优先级排序 - 文档4.1节示例）
// ============================================================
const missedList = ref([
  {
    id: 1,
    name: '刘大妈',
    type: '独居老人',
    typeColor: 'warning',
    community: '南村',
    shouldVisitDate: '2026-05-08',
    missedDays: 3,
    status: '漏访',
    urgency: 1, // 最紧急
  },
  {
    id: 2,
    name: '张德福',
    type: '独居老人',
    typeColor: 'warning',
    community: '石楼村',
    shouldVisitDate: '2026-05-09',
    missedDays: 2,
    status: '漏访',
    urgency: 2,
  },
  {
    id: 3,
    name: '李秀英',
    type: '残障',
    typeColor: 'info',
    community: '东村',
    shouldVisitDate: '2026-05-10',
    missedDays: 1,
    status: '漏访',
    urgency: 3,
  },
  {
    id: 4,
    name: '王强',
    type: '涉稳',
    typeColor: 'danger',
    community: '西村',
    shouldVisitDate: '2026-05-11',
    missedDays: 0,
    status: '今日未访',
    urgency: 4,
  },
  {
    id: 5,
    name: '赵刚',
    type: '刑满释放',
    typeColor: 'primary',
    community: '石楼村',
    shouldVisitDate: '2026-05-11',
    missedDays: 0,
    status: '今日未访',
    urgency: 5,
  },
])

// 按优先级排序（漏访天数多的在前）
const sortedMissedList = computed(() => {
  return [...missedList.value].sort((a, b) => a.urgency - b.urgency)
})

// 获取漏访/未访显示文本
const getMissedText = (item) => {
  if (item.status === '今日未访') return '今日需访'
  return `漏访${item.missedDays}天`
}

// 获取漏访严重程度颜色
const getMissedColor = (item) => {
  if (item.status === '今日未访') return 'var(--color-warning)'
  if (item.missedDays >= 3) return 'var(--color-danger)'
  if (item.missedDays >= 1) return 'var(--color-warning)'
  return 'var(--text-muted)'
}

// 获取人员类型标签颜色
const getTypeTagType = (type) => {
  if (type === '独居老人') return 'warning'
  if (type === '残障') return 'info'
  if (type === '涉稳') return 'danger'
  if (type === '刑满释放') return 'primary'
  return 'default'
}

// ============================================================
// 表格列配置
// ============================================================
const tableColumns = [
  { prop: 'name', label: '姓名', width: 90 },
  { prop: 'type', label: '类型', width: 100, slot: 'type' },
  { prop: 'community', label: '所属村/社区', minWidth: 120 },
  { prop: 'shouldVisitDate', label: '应访日期', width: 110 },
  { prop: 'missedDays', label: '漏访/未访情况', width: 130, slot: 'missedDays' },
  { prop: 'action', label: '操作', width: 160, slot: 'action', align: 'center' },
]

// ============================================================
// 走访覆盖率环形图计算
// ============================================================
const coverageColor = computed(() => {
  const rate = todayStats.value.coverageRate
  if (rate >= 95) return 'var(--color-success)'
  if (rate >= 80) return 'var(--color-warning)'
  return 'var(--color-danger)'
})

const coverageStroke = computed(() => {
  const rate = todayStats.value.coverageRate
  const circumference = 2 * Math.PI * 40
  const dashArray = circumference
  const dashOffset = circumference * (1 - rate / 100)
  return { dashArray, dashOffset }
})

// ============================================================
// 操作
// ============================================================
const goToDetail = () => {
  router.push('/personnel-supervision/detail')
}

const goToItem = (row) => {
  router.push(`/personnel-supervision/detail/${row.id}`)
}

const handleDispatch = (row) => {
  ElMessage.success(`已为「${row.name}」派发走访任务`)
}

const handleUrge = (row) => {
  ElMessage.success(`已向责任人发送催办提醒`)
}
</script>

<template>
  <div class="page-content">
    <!-- ============================================================ -->
    <!-- 页面标题栏 -->
    <!-- ============================================================ -->
    <PageHeader
      title="重点人员联勤"
      subtitle="独居老人 · 残障人士 · 涉稳人员 · 刑满释放人员"
      show-back
      back-text="返回首页"
      back-path="/home"
    >
      <template #extra>
        <SysTag type="info" size="small" variant="outline">
          数据范围：今日应访+累计漏访
        </SysTag>
      </template>
    </PageHeader>

    <!-- ==================== 骨架屏加载 ==================== -->
    <template v-if="pageLoading">
      <el-skeleton :rows="5" animated class="skeleton-section" />
      <el-skeleton :rows="8" animated class="skeleton-section" />
    </template>

    <template v-else>
      <!-- ============================================================ -->
      <!-- 核心指标看板 -->
      <!-- ============================================================ -->
      <div class="section">
        <div class="section-header">
          <h3 class="section-title">核心指标看板</h3>
          <span class="scope-tag">数据范围：今日应访 + 累计漏访</span>
        </div>
        <el-row :gutter="16" class="stats-row">
          <!-- 今日未访人数 - 橙色大号 -->
          <el-col class="stats-col">
            <StatsCard
              type="compact"
              :value="todayStats.todayUnvisited"
              label="今日未访人数"
              status="warning"
              tag="需今日完成"
              tag-type="warning"
            />
          </el-col>

          <!-- 累计漏访人数 - 红色大号 -->
          <el-col class="stats-col">
            <StatsCard
              type="compact"
              :value="todayStats.totalMissed"
              label="累计漏访人数"
              status="danger"
              tag="严重漏访"
              tag-type="danger"
            />
          </el-col>

          <!-- 今日应访总数 -->
          <el-col class="stats-col">
            <StatsCard
              type="compact"
              :value="todayStats.todayShouldVisit"
              label="今日应访总数"
              status="primary"
              :tag="ringChange"
              tag-type="info"
            />
          </el-col>

          <!-- 走访覆盖率近7天 - 环形图 -->
          <el-col class="stats-col stats-col--ring">
            <div class="coverage-card">
              <div class="coverage-ring">
                <svg width="100" height="100" viewBox="0 0 100 100">
                  <circle
                    cx="50" cy="50" r="40"
                    fill="none"
                    stroke="var(--fill-hover)"
                    stroke-width="8"
                  />
                  <circle
                    cx="50" cy="50" r="40"
                    fill="none"
                    :stroke="coverageColor"
                    stroke-width="8"
                    stroke-linecap="round"
                    :stroke-dasharray="coverageStroke.dashArray"
                    :stroke-dashoffset="coverageStroke.dashOffset"
                    transform="rotate(-90 50 50)"
                    class="ring-progress"
                  />
                </svg>
                <div class="ring-center">
                  <span class="ring-value" :style="{ color: coverageColor }">{{ todayStats.coverageRate }}%</span>
                  <span class="ring-label">覆盖率</span>
                </div>
              </div>
              <div class="coverage-info">
                <span class="coverage-label">走访覆盖率（近7天）</span>
                <div class="coverage-legend">
                  <span class="legend-dot success"></span><span class="legend-text">≥95% 优</span>
                  <span class="legend-dot warning"></span><span class="legend-text">80-95% 中</span>
                  <span class="legend-dot danger"></span><span class="legend-text"><80% 差</span>
                </div>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>

      <!-- ============================================================ -->
      <!-- 漏访/未访人员列表 -->
      <!-- ============================================================ -->
      <div class="section">
        <div class="section-header">
          <h3 class="section-title">漏访/未访人员列表（按优先级排序）</h3>
          <SysButton type="primary" variant="ghost" @click="goToDetail">
            查看全部历史 →
          </SysButton>
        </div>

        <SysTable
          :data="sortedMissedList"
          :columns="tableColumns"
          stripe
          :pagination="false"
        >
          <!-- 类型插槽 -->
          <template #type="{ row }">
            <SysTag :type="getTypeTagType(row.type)" size="small">
              {{ row.type }}
            </SysTag>
          </template>

          <!-- 漏访/未访情况插槽 -->
          <template #missedDays="{ row }">
            <span :style="{ color: getMissedColor(row), fontWeight: 'var(--font-weight-bold)' }">
              {{ getMissedText(row) }}
            </span>
          </template>

          <!-- 操作插槽 -->
          <template #action="{ row }">
            <div class="action-cell">
              <SysButton
                v-if="row.status !== '今日未访'"
                type="primary"
                size="small"
                variant="ghost"
                @click="handleDispatch(row)"
              >
                派发任务
              </SysButton>
              <SysButton
                v-else
                type="warning"
                size="small"
                variant="ghost"
                @click="handleUrge(row)"
              >
                催办
              </SysButton>
              <SysButton
                type="default"
                size="small"
                variant="ghost"
                @click="goToItem(row)"
                style="margin-left: 4px"
              >
                详情
              </SysButton>
            </div>
          </template>
        </SysTable>
      </div>

      <!-- ============================================================ -->
      <!-- 说明提示 -->
      <!-- ============================================================ -->
      <div class="info-tips">
        <el-icon :size="16"><Bell /></el-icon>
        <span class="tips-text">
          <strong>使用说明：</strong>橙色数字表示今日需完成走访的重点人员，红色数字表示已漏访的人员（需追访）。
          点击"派发任务"可将走访任务指派给网格员，点击"催办"可提醒责任人及时处理。
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

/* ==================== 数据范围标签 ==================== */
.scope-tag {
  font-size: var(--font-size-xs);
  color: var(--text-muted);
  background: var(--fill-secondary);
  padding: var(--spacing-2) var(--spacing-8);
  border-radius: var(--radius-sm);
  border: 1px solid var(--border-low);
}

/* ==================== 统计卡片区域 ==================== */
.stats-row {
  margin-bottom: 0;
  display: flex;
}

.stats-col {
  flex: 1;
}

.stats-col--ring {
  flex: 1.5;
}

/* ==================== 环形覆盖率卡片 ==================== */
.coverage-card {
  background: var(--fill-surface);
  border-radius: var(--radius-lg);
  border: 1px solid var(--border-default);
  padding: var(--spacing-md);
  display: flex;
  align-items: center;
  gap: var(--spacing-12);
  min-height: 82px;
}

.coverage-ring {
  position: relative;
  width: 100px;
  height: 100px;
  flex-shrink: 0;
}

.coverage-ring svg {
  display: block;
}

.ring-progress {
  transition: stroke-dashoffset 0.6s ease;
}

.ring-center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.ring-value {
  font-size: var(--font-size-h3);
  font-weight: var(--font-weight-bold);
  line-height: 1;
}

.ring-label {
  font-size: var(--font-size-xs);
  color: var(--text-muted);
}

.coverage-info {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-4);
}

.coverage-label {
  font-size: var(--font-size-small);
  color: var(--text-secondary);
  font-weight: var(--font-weight-medium);
}

.coverage-legend {
  display: flex;
  align-items: center;
  gap: var(--spacing-8);
}

.legend-dot {
  width: 8px;
  height: 8px;
  border-radius: 2px;
}

.legend-dot.success { background: var(--color-success); }
.legend-dot.warning { background: var(--color-warning); }
.legend-dot.danger { background: var(--color-danger); }

.legend-text {
  font-size: var(--font-size-xs);
  color: var(--text-muted);
  margin-right: var(--spacing-4);
}

/* ==================== 操作按钮组 ==================== */
.action-cell {
  display: flex;
  align-items: center;
  gap: 0;
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