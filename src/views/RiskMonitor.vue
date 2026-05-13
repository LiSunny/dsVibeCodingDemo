<!--
  组件名称: RiskMonitor
  用途: 模块2 - 隐患舆情监测主页面，包含核心指标看板、最新未改隐患列表
-->
<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { WarningFilled, ArrowLeft } from '@element-plus/icons-vue'
import StatsCard from '@/components/StatsCard.vue'
import SysTable from '@/components/SysTable.vue'
import SysButton from '@/components/SysButton.vue'
import SysTag from '@/components/SysTag.vue'
import PageHeader from '@/components/PageHeader.vue'

const router = useRouter()

// ============================================================
// 实时时钟
// ============================================================
const currentTime = ref('')
let timer = null

const updateTime = () => {
  const now = new Date()
  currentTime.value = now.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

onMounted(() => {
  updateTime()
  timer = setInterval(updateTime, 1000)
})

onBeforeUnmount(() => {
  if (timer) clearInterval(timer)
})

// ==================== 加载状态 ====================
const pageLoading = ref(true)
setTimeout(() => { pageLoading.value = false }, 600)

// ============================================================
// 核心指标数据（示例） - 一级页面使用固定数据范围
// ============================================================
const stats = computed(() => ({
  near7NeedFix: 8,       // 近7天需整改隐患数
  overdueUnfix: 3,       // 超期未整改隐患数
  fixRate: 62,           // 隐患整改率（近7天任务）
  highRiskUnfix: 2,      // 高风险未改隐患数
}))

// ============================================================
// 最新未改隐患列表（示例）
// ============================================================
const riskList = ref([
  {
    id: 1,
    name: '东区厂房消防通道堵塞',
    unit: '宏达制造',
    deadline: '2026-05-09',
    remainDays: -2,
    level: '高',
  },
  {
    id: 2,
    name: '西河堤坝裂缝',
    unit: '水利站',
    deadline: '2026-05-10',
    remainDays: -1,
    level: '高',
  },
  {
    id: 3,
    name: '学校食堂燃气泄漏报警器失效',
    unit: '教育办',
    deadline: '2026-05-12',
    remainDays: 0,
    level: '中',
  },
  {
    id: 4,
    name: '加油站防雷检测过期',
    unit: '中石化站点',
    deadline: '2026-05-14',
    remainDays: 2,
    level: '中',
  },
  {
    id: 5,
    name: '建筑工地深基坑支护变形',
    unit: '城建办',
    deadline: '2026-05-15',
    remainDays: 3,
    level: '中',
  },
])

// ============================================================
// 列表列配置
// ============================================================
const columns = [
  { prop: 'name', label: '隐患名称', minWidth: 200 },
  { prop: 'unit', label: '责任单位', width: 120 },
  { prop: 'deadline', label: '整改期限', width: 110 },
  { prop: 'remainText', label: '剩余天数', width: 100, slot: 'remain' },
  { prop: 'level', label: '等级', width: 70, slot: 'level' },
  { prop: 'action', label: '操作', width: 80, slot: 'action', align: 'center' },
]

// 列表增强计算属性
const computedList = ref(
  riskList.value.map((item) => ({
    ...item,
    remainText: item.remainDays < 0
      ? `超期${Math.abs(item.remainDays)}天`
      : item.remainDays === 0
        ? '今日到期'
        : `剩余${item.remainDays}天`,
  }))
)

// ============================================================
// 催办操作
// ============================================================
const handleUrge = (row) => {
  ElMessage.success(`已向「${row.unit}」发送催办提醒`)
}

// ============================================================
// 导航
// ============================================================
const goToDetail = () => {
  router.push('/risk-monitor/detail')
}

const goToItem = (row) => {
  router.push(`/risk-monitor/detail/${row.id}`)
}

// ============================================================
// 整改率状态计算
// ============================================================
const getFixRateStatus = (rate) => {
  if (rate >= 90) return 'success'
  if (rate >= 70) return 'warning'
  return 'danger'
}

const getRemainType = (days) => {
  if (days < 0) return 'danger'
  if (days === 0) return 'warning'
  return 'default'
}
</script>

<template>
  <div class="page-content">
    <!-- ============================================================ -->
    <!-- 顶部标题栏 -->
    <!-- ============================================================ -->

    <PageHeader
      title="隐患舆情监测"
      subtitle="聚焦未整改隐患，实时监控 • 即时催办 • 闭环管理"
      show-back
      back-text="返回一级页面"
      :back-path="'/home'"
    >
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
          <span class="text-muted" style="font-size: var(--font-size-xs)">
            数据范围：整改期限≤7天 + 超期
          </span>
        </div>
        <el-row :gutter="16" class="stats-row">
          <!-- 近7天需整改隐患数 -->
          <el-col class="stats-col">
            <StatsCard
              type="compact"
              :value="stats.near7NeedFix"
              label="近7天需整改隐患"
              status="warning"
              tag="需督办"
              tag-type="warning"
            />
          </el-col>

          <!-- 超期未整改隐患数 -->
          <el-col class="stats-col">
            <StatsCard
              type="compact"
              :value="stats.overdueUnfix"
              label="超期未整改隐患"
              status="danger"
              tag="严重超期"
              tag-type="danger"
            />
          </el-col>

          <!-- 隐患整改率（环形进度） -->
          <el-col class="stats-col">
            <StatsCard
              type="compact"
              :value="stats.fixRate"
              label="隐患整改率（近7天任务）"
              :progress="stats.fixRate"
            />
          </el-col>

          <!-- 高风险未改隐患数 -->
          <el-col class="stats-col">
            <StatsCard
              type="compact"
              :value="stats.highRiskUnfix"
              label="高风险未改隐患"
              status="danger"
              tag="重点监控"
              tag-type="danger"
            />
          </el-col>
        </el-row>
      </div>

      <!-- ============================================================ -->
      <!-- 最新未改隐患列表 -->
      <!-- ============================================================ -->
      <div class="section">
        <div class="section-header">
          <h3 class="section-title">最新未改隐患列表（按紧急程度排序）</h3>
          <SysButton type="primary" variant="ghost" @click="goToDetail">
            查看全部历史 →
          </SysButton>
        </div>

        <SysTable
          :data="computedList"
          :columns="columns"
          stripe
          :pagination="false"
        >
          <!-- 等级插槽 -->
          <template #level="{ row }">
            <SysTag
              :type="row.level === '高' ? 'danger' : row.level === '中' ? 'warning' : 'info'"
              size="small"
            >
              {{ row.level }}
            </SysTag>
          </template>

          <!-- 剩余天数插槽 -->
          <template #remain="{ row }">
            <SysTag :type="getRemainType(row.remainDays)">
              {{ row.remainText }}
            </SysTag>
          </template>

          <!-- 操作插槽 -->
          <template #action="{ row }">
            <SysButton
              type="danger"
              variant="ghost"
              size="small"
              @click="handleUrge(row)"
            >
              催办
            </SysButton>
          </template>
        </SysTable>
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

/* ==================== Section 通用（统计看板区域） ==================== */
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
  font-size: var(--font-size-h2);
  font-weight: var(--font-weight-bold);
  color: var(--text-primary);
  margin: 0 0 var(--spacing-md) 0;
  padding-left: var(--spacing-md);
  border-left: 4px solid var(--color-primary);
}

/* ==================== 统计卡片区域 ==================== */
.stats-row {
  margin-bottom: 0;
  display: flex;
}
.stats-col {
  flex: 1;
}

.text-muted {
  color: var(--text-muted);
}

</style>
