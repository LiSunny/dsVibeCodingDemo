<script setup>
import { ref, onMounted, onBeforeUnmount, computed } from 'vue'
import {
  Bell, Search, Cpu, UserFilled, Lock, Sort, WarningFilled,
  Cloudy, AlarmClock, List, ChatDotSquare, Aim, Box, OfficeBuilding,
  Van, Connection
} from '@element-plus/icons-vue'

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
    second: '2-digit',
  })
}

onMounted(() => {
  updateTime()
  timer = setInterval(updateTime, 1000)
})

onBeforeUnmount(() => {
  if (timer) clearInterval(timer)
})

// ============================================================
// 16个板块核心数据（模拟数据）
// ============================================================
const modules = ref([
  {
    id: 1,
    icon: Bell,
    name: '石楼动态资讯',
    subtitle: '数据范围：近7天',
    metrics: [
      { label: '未读企业数', value: 12, color: 'danger', tag: '需催办' },
      { label: '整体已读率', value: '85%', type: 'ring', ringVal: 85 },
      { label: '待反馈通知', value: 3, color: 'warning' },
    ],
    link: '/news',
  },
  {
    id: 2,
    icon: Search,
    name: '隐患舆情监测',
    subtitle: '整改期限≤7天+超期',
    metrics: [
      { label: '需整改隐患', value: 8, color: 'warning', tag: '需督办' },
      { label: '超期未整改', value: 4, color: 'danger', tag: '严重超期' },
      { label: '整改率', value: '72%', type: 'ring', ringVal: 72 },
    ],
    link: '/risk-monitor',
  },
  {
    id: 3,
    icon: Cpu,
    name: '安消应AI预警',
    subtitle: '今日实时',
    metrics: [
      { label: '活跃预警', value: 15, color: 'danger' },
      { label: 'AI准确率', value: '94%', type: 'ring', ringVal: 94 },
      { label: '今日新增', value: 6, color: 'warning' },
    ],
    link: '/home',
  },
  {
    id: 4,
    icon: UserFilled,
    name: '重点人员联勤',
    subtitle: '实时监控',
    metrics: [
      { label: '在管人员', value: 47, color: 'primary' },
      { label: '今日关注', value: 5, color: 'warning', tag: '关注' },
      { label: '联勤完成率', value: '88%', type: 'ring', ringVal: 88 },
    ],
    link: '/home',
  },
  {
    id: 5,
    icon: Lock,
    name: '主体安全履责',
    subtitle: '本月统计',
    metrics: [
      { label: '履责到期', value: 9, color: 'warning', tag: '需督办' },
      { label: '超期未履责', value: 3, color: 'danger' },
      { label: '履责完成率', value: '76%', type: 'ring', ringVal: 76 },
    ],
    link: '/home',
  },
  {
    id: 6,
    icon: Sort,
    name: '分类流转督导',
    subtitle: '今日实时',
    metrics: [
      { label: '待流转工单', value: 11, color: 'warning' },
      { label: '流转超期', value: 2, color: 'danger', tag: '超期' },
      { label: '按时流转率', value: '91%', type: 'ring', ringVal: 91 },
    ],
    link: '/home',
  },
  {
    id: 7,
    icon: WarningFilled,
    name: '风险作业报备',
    subtitle: '今日统计',
    metrics: [
      { label: '进行中作业', value: 6, color: 'primary' },
      { label: '今日报备', value: 3, color: 'primary' },
      { label: '作业合规率', value: '95%', type: 'ring', ringVal: 95 },
    ],
    link: '/home',
  },
  {
    id: 8,
    icon: Cloudy,
    name: '自然灾害预警',
    subtitle: '实时生效中',
    metrics: [
      { label: '生效预警', value: 2, color: 'danger', tag: '预警中' },
      { label: '影响人数', value: '1.2万', color: 'warning' },
      { label: '响应率', value: '100%', type: 'ring', ringVal: 100 },
    ],
    link: '/home',
  },
  {
    id: 9,
    icon: AlarmClock,
    name: '疫情监测预警',
    subtitle: '实时监控',
    metrics: [
      { label: '监测风险点', value: 5, color: 'warning' },
      { label: '今日新增', value: 1, color: 'primary' },
      { label: '预警准确率', value: '97%', type: 'ring', ringVal: 97 },
    ],
    link: '/home',
  },
  {
    id: 10,
    icon: List,
    name: '聚众聚集报备',
    subtitle: '今日统计',
    metrics: [
      { label: '进行中活动', value: 4, color: 'primary' },
      { label: '今日报备', value: 2, color: 'primary' },
      { label: '审批通过率', value: '89%', type: 'ring', ringVal: 89 },
    ],
    link: '/home',
  },
  {
    id: 11,
    icon: ChatDotSquare,
    name: '网格员吹哨人',
    subtitle: '待处理',
    metrics: [
      { label: '待处理吹哨', value: 7, color: 'warning', tag: '待办' },
      { label: '今日新增', value: 3, color: 'primary' },
      { label: '吹哨办结率', value: '82%', type: 'ring', ringVal: 82 },
    ],
    link: '/home',
  },
  {
    id: 12,
    icon: Aim,
    name: '应急预案演练',
    subtitle: '年度统计',
    metrics: [
      { label: '待执行演练', value: 4, color: 'warning' },
      { label: '年度完成率', value: '65%', type: 'ring', ringVal: 65 },
      { label: '演练合格率', value: '93%', type: 'ring', ringVal: 93 },
    ],
    link: '/home',
  },
  {
    id: 13,
    icon: Box,
    name: '应急物资云仓',
    subtitle: '库存概览',
    metrics: [
      { label: '库存总量', value: '3.6万件', color: 'primary' },
      { label: '临期物资', value: 28, color: 'warning', tag: '临期' },
      { label: '库存充足率', value: '92%', type: 'ring', ringVal: 92 },
    ],
    link: '/home',
  },
  {
    id: 14,
    icon: OfficeBuilding,
    name: '平急两用场景',
    subtitle: '今日统计',
    metrics: [
      { label: '在用场景', value: 12, color: 'primary' },
      { label: '今日使用人次', value: 358, color: 'primary' },
      { label: '场景利用率', value: '78%', type: 'ring', ringVal: 78 },
    ],
    link: '/home',
  },
  {
    id: 15,
    icon: Van,
    name: '综治应急队伍',
    subtitle: '实时统计',
    metrics: [
      { label: '在岗人员', value: 86, color: 'primary' },
      { label: '今日值班', value: 24, color: 'primary' },
      { label: '队伍到位率', value: '96%', type: 'ring', ringVal: 96 },
    ],
    link: '/home',
  },
  {
    id: 16,
    icon: Connection,
    name: '救援指挥联动',
    subtitle: '实时状态',
    metrics: [
      { label: '待联动任务', value: 3, color: 'warning', tag: '待联动' },
      { label: '进行中联动', value: 2, color: 'primary' },
      { label: '联动完成率', value: '87%', type: 'ring', ringVal: 87 },
    ],
    link: '/home',
  },
])

// ============================================================
// 环形进度条计算
// ============================================================
const ringCircumference = 2 * Math.PI * 18 // r=18

const getRingDasharray = (val) => {
  const dash = (val / 100) * ringCircumference
  return `${dash} ${ringCircumference}`
}

const getRingColor = (val) => {
  if (val >= 90) return 'var(--color-success)'
  if (val >= 70) return 'var(--color-warning)'
  return 'var(--color-danger)'
}

// ============================================================
// 数字指标语义色映射
// ============================================================
const getNumColorVar = (colorKey) => {
  const map = {
    primary: 'var(--color-primary)',
    success: 'var(--color-success)',
    warning: 'var(--color-warning)',
    danger: 'var(--color-danger)',
    info: 'var(--color-info)',
  }
  return map[colorKey] || 'var(--text-primary)'
}

const getTagType = (colorKey) => {
  return colorKey === 'danger' ? 'danger' : 'warning'
}

// ============================================================
// 统计总览
// ============================================================
const overviewStats = computed(() => {
  let totalAlerts = 0
  let totalDanger = 0
  modules.value.forEach((m) => {
    m.metrics.forEach((metric) => {
      if (metric.tag) totalAlerts++
      if (metric.color === 'danger') totalDanger++
    })
  })
  return { totalAlerts, totalDanger, totalModules: modules.value.length }
})
</script>

<template>
  <div class="page-content">
    <!-- ============================================================ -->
    <!-- 顶部标题栏 -->
    <!-- ============================================================ -->
    <div class="dashboard-header">
      <div class="header-left">
        <h1>石楼镇智慧治理平台</h1>
        <span class="header-subtitle">16个板块 · 核心数据概览 Dashboard</span>
      </div>
      <div class="header-center">
        <div class="header-summary">
          <span class="summary-item">
            <span class="summary-num">{{ overviewStats.totalModules }}</span>
            <span class="summary-label">业务模块</span>
          </span>
          <span class="summary-divider">|</span>
          <span class="summary-item">
            <span class="summary-num danger">{{ overviewStats.totalDanger }}</span>
            <span class="summary-label">需重点关注</span>
          </span>
          <span class="summary-divider">|</span>
          <span class="summary-item">
            <span class="summary-num warning">{{ overviewStats.totalAlerts }}</span>
            <span class="summary-label">待处理事项</span>
          </span>
        </div>
      </div>
      <div class="header-right">
        <span class="time-display">{{ currentTime }}</span>
        <el-tag type="success" size="large" effect="dark">系统运行中</el-tag>
      </div>
    </div>

    <!-- ============================================================ -->
    <!-- 16模块网格 -->
    <!-- ============================================================ -->
    <div class="module-grid">
      <div
        v-for="mod in modules"
        :key="mod.id"
        class="module-card"
      >
        <!-- 卡片头部 -->
        <div class="card-header">
          <div class="card-title-row">
            <span class="card-icon">
              <!-- <el-icon :size="24"><component :is="mod.icon" /></el-icon> -->
            </span>
            <div class="card-title-info">
              <span class="card-name">{{ mod.name }}</span>
              <span class="card-subtitle">{{ mod.subtitle }}</span>
            </div>
          </div>
          <el-tag size="small" type="info" effect="plain" class="card-badge">
            {{ String(mod.id).padStart(2, '0') }}
          </el-tag>
        </div>

        <!-- 指标区 -->
        <div class="card-metrics">
          <template v-for="(metric, idx) in mod.metrics" :key="idx">
            <!-- 环形进度条类型 -->
            <div v-if="metric.type === 'ring'" class="metric-item metric-ring">
              <div class="ring-wrapper">
                <svg class="ring-svg" viewBox="0 0 44 44" width="44" height="44">
                  <circle
                    class="ring-bg"
                    cx="22" cy="22" r="18"
                    fill="none"
                    stroke="var(--border-default)"
                    stroke-width="4"
                  />
                  <circle
                    class="ring-fill"
                    cx="22" cy="22" r="18"
                    fill="none"
                    :stroke="getRingColor(metric.ringVal)"
                    stroke-width="4"
                    stroke-linecap="round"
                    :stroke-dasharray="getRingDasharray(metric.ringVal)"
                    transform="rotate(-90 22 22)"
                  />
                </svg>
                <span class="ring-value">{{ metric.value }}</span>
              </div>
              <span class="metric-label">{{ metric.label }}</span>
            </div>

            <!-- 数字类型 -->
            <div v-else class="metric-item metric-num">
              <span class="num-value" :style="{ color: getNumColorVar(metric.color) }">
                {{ metric.value }}
                <el-tag
                  v-if="metric.tag"
                  :type="getTagType(metric.color)"
                  size="small"
                  effect="dark"
                  class="num-tag"
                >
                  {{ metric.tag }}
                </el-tag>
              </span>
              <span class="metric-label">{{ metric.label }}</span>
            </div>
          </template>
        </div>

        <!-- 底部链接 -->
        <div class="card-footer">
          <router-link :to="mod.link" class="card-link">查看全部 →</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* ============================================================
 * 整体布局
 * ============================================================ */


/* ============================================================
 * 顶部标题栏
 * ============================================================ */
.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-md);
  padding: var(--spacing-16) var(--spacing-24);
  background: var(--fill-surface);
  border-radius: var(--radius-lg);
  color: var(--text-primary);
  flex-wrap: wrap;
  gap: var(--spacing-12);
}

.header-left h1 {
  font-size: var(--font-size-h3);
  margin: 0;
  font-weight: var(--font-weight-medium);
  white-space: nowrap;
}

.header-subtitle {
  font-size: var(--font-size-xs);
  opacity: 0.8;
  letter-spacing: 1px;
}

/* 中间统计概览 */
.header-center {
  flex: 1;
  display: flex;
  justify-content: center;
}

.header-summary {
  display: flex;
  align-items: center;
  gap: var(--spacing-12);
  font-size: var(--font-size-small);
}

.summary-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-2);
}

.summary-num {
  font-size: var(--font-size-h2);
  font-weight: var(--font-weight-bold);
  color: var(--text-inverse);
}

.summary-num.danger {
  color: var(--color-danger);
}

.summary-num.warning {
  color: var(--color-warning);
}

.summary-label {
  font-size: var(--font-size-xs);
  opacity: 0.8;
}

.summary-divider {
  opacity: 0.3;
  font-size: var(--font-size-h3);
}

.header-right {
  display: flex;
  align-items: center;
  gap: var(--spacing-16);
  white-space: nowrap;
}

.time-display {
  font-size: var(--font-size-body);
  font-family: var(--font-family-mono);
  letter-spacing: 1px;
}

/* ============================================================
 * 16模块网格
 * ============================================================ */
.module-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--spacing-16);
}

/* 大屏适配：更大列间距 */
@media (min-width: 1600px) {
  .module-grid {
    grid-template-columns: repeat(4, 1fr);
    gap: var(--spacing-24);
  }
}

/* 中等屏幕：3列 */
@media (max-width: 1400px) {
  .module-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

/* 小屏幕：2列 */
@media (max-width: 1024px) {
  .module-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* 手机：1列 */
@media (max-width: 640px) {
  .module-grid {
    grid-template-columns: 1fr;
  }
}

/* ============================================================
 * 模块卡片
 * ============================================================ */
.module-card {
  background: var(--fill-secondary);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  padding: var(--spacing-16);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-12);
  border: 1px solid var(--border-primary);
  min-height: 180px;
}

.module-card:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
  border-color: var(--color-primary);
}

/* ---- 卡片头部 ---- */
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.card-title-row {
  display: flex;
  align-items: center;
  gap: var(--spacing-8);
}

.card-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: var(--radius-md);
  background: var(--color-primary);
  color: var(--text-inverse);
  flex-shrink: 0;
}

.card-title-info {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2);
}

.card-name {
  font-size: var(--font-size-h3);
  font-weight: var(--font-weight-medium);
  color: var(--text-primary);
}

.card-subtitle {
  font-size: var(--font-size-small);
  color: var(--text-muted);
}

.card-badge {
  flex-shrink: 0;
}

/* ---- 指标区 ---- */
.card-metrics {
  flex: 1;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--spacing-4);
  align-items: stretch;
}

/* 数字指标 */
.metric-item {
  display: flex;
  flex-direction: column;
  justify-content: space-between;   /* 数值贴顶、label贴底 */
  align-items: center;
  gap: var(--spacing-4);
  min-width: 0;
  padding: var(--spacing-4) 0;
}

.metric-num {
  min-width: 0;
}

.num-value {
  font-size: var(--font-size-h2);
  font-weight: var(--font-weight-bold);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-2);
  line-height: 1.2;
}

.num-tag {
  font-size: var(--font-size-xs);
}

.metric-label {
  font-size: var(--font-size-small);
  color: var(--text-muted);
  white-space: nowrap;
  text-align: center;
}

/* 环形进度条 */
.ring-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.ring-svg {
  display: block;
}

.ring-bg {
  opacity: 0.15;
}

.ring-fill {
  transition: stroke-dasharray 0.8s ease, stroke 0.8s ease;
}

.ring-value {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-bold);
  color: var(--text-primary);
  line-height: 1;
}

/* ---- 底部链接 ---- */
.card-footer {
  border-top: 1px solid var(--border-default);
  padding-top: var(--spacing-8);
}

.card-link {
  font-size: var(--font-size-xs);
  color: var(--color-primary);
  text-decoration: none;
  transition: color 0.2s;
}

.card-link:hover {
  color: var(--color-primary-dark);
}
</style>