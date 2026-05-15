<!--
  组件名称: OwnerDashboard
  用途: 消防维保监管看板一级页面，面向库区一把手，展示消防维保履约态势、重大风险、待办事项的一览视图
-->
<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Bell } from '@element-plus/icons-vue'
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
const dashboardStats = computed(() => ({
  criticalHiddenCount: 2,    // 未闭环重大隐患数（红色，不限时间）
  pendingConfirmCount: 3,    // 待确认维修数（橙色）
  contractRemainDays: 23,    // 合同剩余天数（橙色 ≤30天）
  taskCompletionRate: 82,    // 近7天维保任务完成率（橙色区间 70%-90%）
}))

// 合同剩余天数颜色计算：绿色 >30天 / 橙色 ≤30天 / 红色 ≤7天
const contractDaysColor = computed(() => {
  const days = dashboardStats.value.contractRemainDays
  if (days <= 7) return 'var(--color-danger)'
  if (days <= 30) return 'var(--color-warning)'
  return 'var(--color-success)'
})

const contractDaysStatus = computed(() => {
  const days = dashboardStats.value.contractRemainDays
  if (days <= 7) return 'danger'
  if (days <= 30) return 'warning'
  return 'success'
})

// 完成率环形图颜色
const completionRateColor = computed(() => {
  const rate = dashboardStats.value.taskCompletionRate
  if (rate >= 90) return 'var(--color-success)'
  if (rate >= 70) return 'var(--color-warning)'
  return 'var(--color-danger)'
})

const completionStroke = computed(() => {
  const rate = dashboardStats.value.taskCompletionRate
  const circumference = 2 * Math.PI * 40
  return {
    dashArray: circumference,
    dashOffset: circumference * (1 - rate / 100),
  }
})

// ============================================================
// 高优先级事项清单（示例数据 - 按文档4.1节，最多5条）
// ============================================================
const highPriorityList = ref([
  {
    id: 1,
    type: '重大隐患',
    typeIcon: '⚠️',
    typeColor: 'danger',
    description: '3号库烟感探测器故障（已超48小时未修复）',
    time: '2026-01-14',
    action: 'detail',
    actionLabel: '查看详情',
    hasUrge: true,
  },
  {
    id: 2,
    type: '待确认维修',
    typeIcon: '🔧',
    typeColor: 'warning',
    description: '2号库喷淋头漏水维修完成，待现场确认',
    time: '2026-01-16',
    action: 'confirm',
    actionLabel: '确认闭环',
    hasUrge: false,
  },
  {
    id: 3,
    type: '报告待阅',
    typeIcon: '📄',
    typeColor: 'info',
    description: '2025年12月维保报告已生成',
    time: '2026-01-15',
    action: 'download',
    actionLabel: '下载报告',
    hasUrge: false,
  },
  {
    id: 4,
    type: '合同到期',
    typeIcon: '📅',
    typeColor: 'warning',
    description: '维保合同将于2026-02-10到期',
    time: '2026-01-10',
    action: 'contract',
    actionLabel: '查看合同',
    hasUrge: false,
  },
])

// ============================================================
// 表格列配置
// ============================================================
const tableColumns = [
  { prop: 'type', label: '事项类型', width: 130, slot: 'type' },
  { prop: 'description', label: '描述', minWidth: 280 },
  { prop: 'time', label: '发生时间', width: 110 },
  { prop: 'action', label: '操作', width: 180, slot: 'action', align: 'center' },
]

// ============================================================
// 操作
// ============================================================
const goToDetail = () => {
  router.push('/owner-dashboard/detail')
}

const goToItem = (row) => {
  router.push(`/owner-dashboard/detail/${row.id}`)
}

const handleUrge = (row) => {
  ElMessage.success(`已向维保公司发送催办提醒：「${row.description}」`)
}

const handleConfirm = (row) => {
  ElMessage.success(`维修确认闭环：「${row.description}」`)
}

const handleDownload = () => {
  ElMessage.success('报告下载中，请稍候...')
}

const handleViewContract = () => {
  ElMessage.info('跳转至合同详情页')
}

const handleAction = (row) => {
  switch (row.action) {
    case 'detail':
      goToItem(row)
      break
    case 'confirm':
      handleConfirm(row)
      break
    case 'download':
      handleDownload()
      break
    case 'contract':
      handleViewContract()
      break
    default:
      goToItem(row)
  }
}
</script>

<template>
  <div class="page-content">
    <!-- ============================================================ -->
    <!-- 页面标题栏 -->
    <!-- ============================================================ -->
    <PageHeader
      title="消防维保监管看板"
      subtitle="消防维保履约态势、重大风险、待办事项一览视图"
    >
      <template #extra>
        <SysTag type="info" size="small" variant="outline">
          数据范围：近7天（重大隐患不限）
        </SysTag>
      </template>
      <template #actions>
        <SysButton type="primary" variant="ghost" @click="goToDetail">
          查看全部历史 →
        </SysButton>
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
          <span class="scope-tag">数据范围：近7天（重大隐患不限）</span>
        </div>
        <el-row :gutter="16" class="stats-row">
          <!-- 未闭环重大隐患数 - 红色大号 -->
          <el-col class="stats-col">
            <StatsCard
              type="compact"
              :value="dashboardStats.criticalHiddenCount"
              label="未闭环重大隐患数"
              status="danger"
              tag="需立即督办"
              tag-type="danger"
            />
          </el-col>

          <!-- 待确认维修数 - 橙色 -->
          <el-col class="stats-col">
            <StatsCard
              type="compact"
              :value="dashboardStats.pendingConfirmCount"
              label="待确认维修数"
              status="warning"
              tag="需确认"
              tag-type="warning"
            />
          </el-col>

          <!-- 合同剩余天数 - 自定义卡片（根据阈值变色） -->
          <el-col class="stats-col">

            <StatsCard
              type="compact"
              :value="dashboardStats.contractRemainDays"
              label="合同剩余天数"
              status="danger"
              tag="需续签"
              tag-type="danger"
            />

            <!-- <div class="contract-days-card" :class="`contract-days--${contractDaysStatus}`">
              <div class="contract-days-header">
                <span class="contract-days-title">合同剩余天数</span>
              </div>
              <div class="contract-days-body">
                <span class="contract-days-value" :style="{ color: contractDaysColor }">
                  {{ dashboardStats.contractRemainDays }}
                </span>
                <span class="contract-days-unit">天</span>
              </div>
              <div class="contract-days-desc">
                {{ contractDaysStatus === 'danger' ? '即将到期，请立即续签' : contractDaysStatus === 'warning' ? '请尽快安排续签' : '合同状态正常' }}
              </div>
            </div> -->
          </el-col>

          <!-- 近7天维保任务完成率 - 环形图 -->
          <el-col class="stats-col stats-col--ring">
            <div class="completion-card">
              <div class="completion-ring">
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
                    :stroke="completionRateColor"
                    stroke-width="8"
                    stroke-linecap="round"
                    :stroke-dasharray="completionStroke.dashArray"
                    :stroke-dashoffset="completionStroke.dashOffset"
                    transform="rotate(-90 50 50)"
                    class="ring-progress"
                  />
                </svg>
                <div class="ring-center">
                  <span class="ring-value" :style="{ color: completionRateColor }">
                    {{ dashboardStats.taskCompletionRate }}%
                  </span>
                  <span class="ring-label">完成率</span>
                </div>
              </div>
              <div class="completion-info">
                <span class="completion-label">近7天维保任务完成率</span>
                <div class="completion-legend">
                  <span class="legend-dot success"></span><span class="legend-text">≥90% 优</span>
                  <span class="legend-dot warning"></span><span class="legend-text">70-90% 中</span>
                  <span class="legend-dot danger"></span><span class="legend-text"><70% 差</span>
                </div>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>

      <!-- ============================================================ -->
      <!-- 高优先级事项清单 -->
      <!-- ============================================================ -->
      <div class="section">
        <div class="section-header">
          <h3 class="section-title">高优先级事项清单（近7天）</h3>
          <SysButton type="primary" variant="ghost" @click="goToDetail">
            查看全部历史 →
          </SysButton>
        </div>

        <SysTable
          :data="highPriorityList"
          :columns="tableColumns"
          stripe
          :pagination="false"
        >
          <!-- 事项类型插槽 -->
          <template #type="{ row }">
            <SysTag :type="row.typeColor" size="small">
              {{ row.typeIcon }} {{ row.type }}
            </SysTag>
          </template>

          <!-- 操作插槽 -->
          <template #action="{ row }">
            <div class="action-cell">
              <SysButton
                type="primary"
                size="small"
                variant="ghost"
                @click="handleAction(row)"
              >
                {{ row.actionLabel }}
              </SysButton>
              <SysButton
                v-if="row.hasUrge"
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
      <!-- 说明提示 -->
      <!-- ============================================================ -->
      <div class="info-tips">
        <el-icon :size="16"><Bell /></el-icon>
        <span class="tips-text">
          <strong>使用说明：</strong>红色数字表示当前最严重的安全风险，需立即督办；橙色数字表示需要管理者关注或确认的事项。
          合同剩余天数<30天将显示橙色预警，<7天将显示红色预警。维保任务完成率反映维保公司的履约及时性。
          点击"查看详情"可下钻到具体事项的全流程时间轴，点击"催办"可向维保公司发送催办消息。
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

/* ==================== 合同剩余天数卡片 ==================== */
.contract-days-card {
  background: var(--fill-surface);
  border-radius: var(--radius-lg);
  border: 1px solid var(--border-default);
  padding: var(--spacing-sm);
  min-height: 82px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.contract-days--success {
  border-top: 3px solid var(--color-success);
}

.contract-days--warning {
  border-top: 3px solid var(--color-warning);
}

.contract-days--danger {
  border-top: 3px solid var(--color-danger);
  background: var(--color-danger-bg);
}

.contract-days-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.contract-days-title {
  font-size: var(--font-size-small);
  color: var(--text-secondary);
  line-height: 1.4;
}

.contract-days-body {
  display: flex;
  align-items: baseline;
  gap: var(--spacing-4);
  flex: 1;
}

.contract-days-value {
  font-size: var(--font-size-h2);
  font-weight: var(--font-weight-bold);
  line-height: 1.2;
}

.contract-days-unit {
  font-size: var(--font-size-xs);
  color: var(--text-muted);
}

.contract-days-desc {
  font-size: var(--font-size-xs);
  color: var(--text-muted);
  margin-top: var(--spacing-4);
}

/* ==================== 完成率环形卡片 ==================== */
.completion-card {
  background: var(--fill-surface);
  border-radius: var(--radius-lg);
  border: 1px solid var(--border-default);
  padding: var(--spacing-md);
  display: flex;
  align-items: center;
  gap: var(--spacing-12);
  min-height: 82px;
}

.completion-ring {
  position: relative;
  width: 100px;
  height: 100px;
  flex-shrink: 0;
}

.completion-ring svg {
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

.completion-info {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-4);
}

.completion-label {
  font-size: var(--font-size-small);
  color: var(--text-secondary);
  font-weight: var(--font-weight-medium);
}

.completion-legend {
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