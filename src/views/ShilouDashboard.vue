<!--
  组件名称: ShilouDashboard
  用途: 石楼镇安全综治指挥大屏 - 数据概览页
  布局模式: 统计卡片 + 图表 + 列表组合
-->
<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import StatsCard from '@/components/StatsCard.vue'
import SysButton from '@/components/SysButton.vue'
import {
  Monitor, User, View, Timer, Warning, DataLine,
  Document, CircleCheck, CircleClose,
  Lightning, Sunny, Service, Suitcase, Connection
} from '@element-plus/icons-vue'

const router = useRouter()

// ==================== 加载状态 ====================
const pageLoading = ref(true)
setTimeout(() => { pageLoading.value = false }, 800)

// ==================== 实时时间 ====================
const currentTime = ref('')
const updateTime = () => {
  const now = new Date()
  currentTime.value = now.toLocaleString('zh-CN', {
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit'
  })
}
onMounted(() => {
  updateTime()
  setInterval(updateTime, 1000)
})

// ==================== 统计卡片数据 ====================
const statsCards = [
  {
    key: 'monitor', icon: Monitor, label: '监测设备', value: '1,286', unit: '台',
    online: '1,263', onlineRate: '98.2', color: 'primary'
  },
  {
    key: 'personnel', icon: User, label: '在岗人员', value: '328', unit: '人',
    online: null, onlineRate: null, color: 'success'
  },
  {
    key: 'visitors', icon: View, label: '今日访客', value: '1,845', unit: '人次',
    online: null, onlineRate: null, color: 'warning'
  },
  {
    key: 'response', icon: Timer, label: '平均响应', value: '2.8', unit: '分钟',
    online: null, onlineRate: null, color: 'danger'
  },
]

// ==================== 实时预警数据 ====================
const alerts = ref([
  { id: 1, level: '严重', levelType: 'danger', title: '3号消防通道堵塞超过15分钟', location: 'C区2楼东侧', time: '10分钟前', status: '待处理' },
  { id: 2, level: '严重', levelType: 'danger', title: '配电房B-3温度异常升高至62°C', location: 'B区地下1层', time: '18分钟前', status: '待处理' },
  { id: 3, level: '一般', levelType: 'warning', title: 'D区2号电梯维保已逾期3天', location: 'D区', time: '25分钟前', status: '处理中' },
  { id: 4, level: '一般', levelType: 'warning', title: '北门人脸识别设备离线', location: '北门入口', time: '32分钟前', status: '待处理' },
  { id: 5, level: '提示', levelType: '', title: 'E区烟感传感器电量低于20%', location: 'E区3楼', time: '45分钟前', status: '已派单' },
])

const alertCount = computed(() => alerts.value.length)

// ==================== 设备监控数据 ====================
const equipmentData = [
  { label: 'AI摄像头', total: 512, online: 508, icon: Monitor },
  { label: '烟感探测器', total: 960, online: 952, icon: Sunny },
  { label: '电气监测', total: 120, online: 118, icon: Lightning },
  { label: '消防栓', total: 86, online: 86, icon: Service },
  { label: '应急广播', total: 64, online: 62, icon: DataLine },
  { label: '门禁闸机', total: 32, online: 30, icon: Suitcase },
]

const maxEquipmentTotal = computed(() => Math.max(...equipmentData.map(d => d.total)))

// ==================== 各场所用能数据（柱状图） ====================
const energyData = ref([
  { label: 'A区商场', value: 856 },
  { label: 'B区写字楼', value: 620 },
  { label: 'C区厂房', value: 1024 },
  { label: 'D区仓储', value: 380 },
  { label: 'E区宿舍', value: 245 },
])

const maxEnergy = computed(() => Math.max(...energyData.value.map(d => d.value)))

// ==================== 实时趋势 ====================
const dailyTrend = ref([
  { time: '08:00', value: 320 },
  { time: '09:00', value: 680 },
  { time: '10:00', value: 920 },
  { time: '11:00', value: 1150 },
  { time: '12:00', value: 980 },
  { time: '13:00', value: 780 },
  { time: '14:00', value: 890 },
  { time: '15:00', value: 1020 },
  { time: '16:00', value: 1100 },
  { time: '17:00', value: 950 },
  { time: '18:00', value: 720 },
  { time: '19:00', value: 520 },
])

const maxTrend = computed(() => Math.max(...dailyTrend.value.map(d => d.value)))
const trendPoints = computed(() => {
  return dailyTrend.value.map((d, i) => ({
    x: (i / (dailyTrend.value.length - 1)) * 100,
    y: 100 - (d.value / (maxTrend.value || 1)) * 100
  }))
})
const trendLine = computed(() => {
  return trendPoints.value.map(p => `${p.x},${p.y}`).join(' ')
})

// ==================== 最近事件列表 ====================
const events = ref([
  { id: 1, type: 'success', title: '月度消防演练顺利完成', detail: '参与人数326人，达到预期目标', time: '1小时前' },
  { id: 2, type: 'warning', title: 'C区电力检修计划发布', detail: '5月15日 00:00-06:00 停电检修', time: '2小时前' },
  { id: 3, type: '', title: '外来人员登记系统升级', detail: '新版人脸识别系统已部署上线', time: '3小时前' },
  { id: 4, type: 'danger', title: '2号货梯故障报修', detail: '维保人员已到场处理', time: '4小时前' },
])

// ==================== 预警级别颜色 ====================
const getAlertLevelColor = (levelType) => {
  if (levelType === 'danger') return 'var(--color-danger)'
  if (levelType === 'warning') return 'var(--color-warning)'
  return 'var(--text-muted)'
}

const getEventTypeColor = (type) => {
  if (type === 'danger') return 'var(--color-danger)'
  if (type === 'warning') return 'var(--color-warning)'
  if (type === 'success') return 'var(--color-success)'
  return 'var(--text-muted)'
}

const getEventTypeBg = (type) => {
  if (type === 'danger') return 'var(--color-danger-bg)'
  if (type === 'warning') return 'var(--color-warning-bg)'
  if (type === 'success') return 'var(--color-success-bg)'
  return 'var(--fill-secondary)'
}
</script>

<template>
  <div class="page-content">
    <!-- ==================== 骨架屏加载 ==================== -->
    <template v-if="pageLoading">
      <div class="skeleton-row">
        <el-skeleton animated class="skeleton-card" v-for="n in 4" :key="'sc-' + n">
          <template #template>
            <el-skeleton-item variant="text" style="width: 50%" />
            <el-skeleton-item variant="text" style="width: 30%" />
          </template>
        </el-skeleton>
      </div>
      <el-skeleton :rows="6" animated class="skeleton-panel" />
      <el-skeleton :rows="4" animated class="skeleton-panel" />
    </template>

    <template v-else>
      <!-- ==================== 顶部栏 ==================== -->
      <div class="dashboard-topbar">
        <div class="topbar-left">
          <h1 class="topbar-title">石楼镇安全综治指挥中心</h1>
        </div>
        <div class="topbar-right">
          <span class="topbar-time">{{ currentTime }}</span>
          <el-tag type="success" size="small" effect="dark">系统运行中</el-tag>
        </div>
      </div>

      <!-- ==================== 统计卡片行 ==================== -->
      <div class="stats-row">
        <StatsCard
          v-for="card in statsCards"
          :key="card.key"
          type="dashboard"
          :value="card.value"
          :label="card.label"
          :status="card.color"
          :unit="card.unit"
          :footer-text="card.online ? `在线 ${card.online} · 在线率 ${card.onlineRate}%` : ''"
        >
          <template #icon>
            <el-icon :size="24"><component :is="card.icon" /></el-icon>
          </template>
          <template v-if="card.online" #footerIcon>
            <CircleCheck />
          </template>
        </StatsCard>
      </div>

      <!-- ==================== 实时预警 & 事件列表 ==================== -->
      <div class="content-row">
        <!-- 实时预警 -->
        <div class="panel-card panel-card--alerts">
          <div class="panel-header">
            <div class="panel-title">
              <el-icon :size="18"><Warning /></el-icon>
              实时预警
            </div>
            <el-tag type="danger" size="small" effect="dark">共{{ alertCount }}条</el-tag>
          </div>
          <div class="panel-body panel-body--alerts">
            <el-empty v-if="alerts.length === 0" description="暂无预警信息，系统运行正常" :image-size="80" />
            <div v-else class="alert-list">
              <div
                v-for="item in alerts"
                :key="item.id"
                class="alert-item"
              >
                <div class="alert-dot" :style="{ background: getAlertLevelColor(item.levelType) }"></div>
                <div class="alert-content">
                  <div class="alert-title">
                    <el-tag
                      v-if="item.levelType"
                      :type="item.levelType"
                      size="small"
                      effect="dark"
                      class="alert-tag"
                    >{{ item.level }}</el-tag>
                    <span v-else class="alert-level-text">{{ item.level }}</span>
                    {{ item.title }}
                  </div>
                  <div class="alert-meta">
                    <span><el-icon :size="12"><Connection /></el-icon> {{ item.location }}</span>
                    <span class="alert-meta-divider">·</span>
                    <span><el-icon :size="12"><Timer /></el-icon> {{ item.time }}</span>
                  </div>
                </div>
                <el-button type="primary" plain size="small">处理</el-button>
              </div>
            </div>
          </div>
        </div>

        <!-- 最近事件 -->
        <div class="panel-card panel-card--events">
          <div class="panel-header">
            <div class="panel-title">
              <el-icon :size="18"><Document /></el-icon>
              最近事件
            </div>
            <el-button type="primary" link size="small">全部</el-button>
          </div>
          <div class="panel-body panel-body--events">
            <el-empty v-if="events.length === 0" description="暂无最近事件" :image-size="80" />
            <div v-else class="event-list">
              <div
                v-for="item in events"
                :key="item.id"
                class="event-item"
              >
                <div class="event-dot" :style="{ background: getEventTypeColor(item.type), boxShadow: `0 0 6px ${getEventTypeColor(item.type)}` }"></div>
                <div class="event-content">
                  <div class="event-title">{{ item.title }}</div>
                  <div class="event-detail">{{ item.detail }}</div>
                </div>
                <span class="event-time">{{ item.time }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ==================== 设备监控 & 用能情况 ==================== -->
      <div class="content-row">
        <!-- 设备监控 -->
        <div class="panel-card panel-card--equipment">
          <div class="panel-header">
            <div class="panel-title">
              <el-icon :size="18"><Monitor /></el-icon>
              设备监控
            </div>
            <el-tag size="small" type="success" effect="plain">整体在线率 98.5%</el-tag>
          </div>
          <div class="panel-body panel-body--equipment">
            <el-empty v-if="equipmentData.length === 0" description="暂无设备数据" :image-size="80" />
            <div v-else class="equipment-list">
              <div
                v-for="item in equipmentData"
                :key="item.label"
                class="equipment-item"
              >
                <div class="equipment-icon">
                  <el-icon :size="18"><component :is="item.icon" /></el-icon>
                </div>
                <div class="equipment-info">
                  <div class="equipment-label">{{ item.label }}</div>
                  <div
                    class="equipment-bar-track"
                  >
                    <div
                      class="equipment-bar-fill"
                      :class="{ 'equipment-bar-fill--warning': item.online / item.total < 0.95 }"
                      :style="{ width: (item.online / maxEquipmentTotal * 100) + '%' }"
                    ></div>
                  </div>
                </div>
                <div class="equipment-count">
                  <span class="equipment-count-online">{{ item.online }}</span>
                  <span class="equipment-count-divider">/</span>
                  <span class="equipment-count-total">{{ item.total }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 各场所用能情况 -->
        <div class="panel-card panel-card--energy">
          <div class="panel-header">
            <div class="panel-title">
              <el-icon :size="18"><Lightning /></el-icon>
              各场所用能情况（kW·h）
            </div>
          </div>
          <div class="panel-body panel-body--energy">
            <el-empty v-if="energyData.length === 0" description="暂无用能数据" :image-size="80" />
            <div v-else class="energy-bars">
              <div
                v-for="item in energyData"
                :key="item.label"
                class="energy-bar-item"
              >
                <div class="energy-bar-label">{{ item.label }}</div>
                <div class="energy-bar-track">
                  <div
                    class="energy-bar-fill"
                    :style="{ width: (item.value / maxEnergy * 100) + '%' }"
                  ></div>
                </div>
                <div class="energy-bar-value">{{ item.value }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ==================== 实时人流量趋势 ==================== -->
      <div class="panel-card panel-card--trend">
        <div class="panel-header">
          <div class="panel-title">
            <el-icon :size="18"><DataLine /></el-icon>
            实时人流量趋势
          </div>
          <el-tag size="small" type="primary">今日</el-tag>
        </div>
        <div class="panel-body panel-body--trend">
          <el-empty v-if="dailyTrend.length === 0" description="暂无趋势数据" :image-size="80" />
          <div v-else class="trend-chart">
            <!-- SVG 趋势线 -->
            <div class="trend-svg-wrap">
              <svg
                class="trend-svg"
                viewBox="0 0 100 50"
                preserveAspectRatio="none"
              >
                <defs>
                  <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stop-color="var(--color-primary)" stop-opacity="0.25" />
                    <stop offset="100%" stop-color="var(--color-primary)" stop-opacity="0.02" />
                  </linearGradient>
                </defs>
                <polygon
                  :points="`0,50 ${trendLine} 100,50`"
                  fill="url(#trendGradient)"
                />
                <polyline
                  :points="trendLine"
                  fill="none"
                  stroke="var(--color-primary)"
                  stroke-width="2"
                  stroke-linejoin="round"
                />
              </svg>
            </div>
            <!-- 柱状图 -->
            <div class="trend-bars">
              <div
                v-for="item in dailyTrend"
                :key="item.time"
                class="trend-bar-container"
              >
                <div
                  class="trend-bar"
                  :style="{ height: (item.value / maxTrend * 100) + '%' }"
                >
                  <span class="trend-bar-val">{{ item.value }}</span>
                </div>
                <div class="trend-bar-label">{{ item.time }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ==================== 快捷入口（SysButton 组件演示） ==================== -->
      <div class="quick-links">
        <SysButton
          v-for="item in [
            { label: '通知公告', path: '/news' },
            { label: '应急预警', path: '/alerts' },
            { label: '重点人员', path: '/personnel' },
            { label: '安全履责', path: '/safety' },
            { label: '物资云仓', path: '/warehouse' },
            { label: '救援指挥', path: '/rescue' },
          ]"
          :key="item.path"
          type="default"
          size="small"
          @click="router.push(item.path)"
        >
          {{ item.label }}
        </SysButton>
      </div>
    </template>
  </div>
</template>

<style scoped>

/* ==================== 骨架屏 ==================== */
.skeleton-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--spacing-16);
  margin-bottom: var(--spacing-16);
}

.skeleton-card {
  padding: var(--spacing-lg);
  background: var(--fill-surface);
  border-radius: var(--radius-lg);
}

.skeleton-panel {
  margin-bottom: var(--spacing-16);
  padding: var(--spacing-lg);
  background: var(--fill-surface);
  border-radius: var(--radius-lg);
}

/* ==================== 顶部栏 ==================== */
.dashboard-topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-lg) var(--spacing-16);
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-hover) 100%);
  border-radius: var(--radius-lg);
  margin-bottom: var(--spacing-16);
}

.topbar-title {
  font-size: var(--font-size-h2);
  font-weight: var(--font-weight-bold);
  color: var(--text-inverse);
  margin: 0;
  letter-spacing: 1px;
}

.topbar-right {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.topbar-time {
  font-size: var(--font-size-small);
  color: rgba(255, 255, 255, 0.9);
  font-variant-numeric: tabular-nums;
}

/* ==================== 统计卡片行 ==================== */
.stats-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--spacing-16);
  margin-bottom: var(--spacing-16);
}

/* ==================== 内容行 ==================== */
.content-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-16);
  margin-bottom: var(--spacing-16);
}

/* ==================== 面板卡片 ==================== */
.panel-card {
  background: var(--fill-surface);
  border-radius: var(--radius-lg);
  border: 1px solid var(--border-default);
  overflow: hidden;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-md) var(--spacing-lg);
  border-bottom: 1px solid var(--border-low);
  background: var(--fill-secondary);
}

.panel-title {
  font-size: var(--font-size-body);
  font-weight: var(--font-weight-bold);
  color: var(--text-primary);
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.panel-body {
  padding: var(--spacing-md);
}

.panel-body--alerts {
  max-height: 380px;
  overflow-y: auto;
  padding: 0;
}

.panel-body--events {
  max-height: 380px;
  overflow-y: auto;
  padding: 0;
}

.panel-body--equipment {
  padding: var(--spacing-lg);
}

.panel-body--energy {
  padding: var(--spacing-lg);
}

.panel-body--trend {
  padding: var(--spacing-lg);
}

/* ==================== 预警列表 ==================== */
.alert-list {
  display: flex;
  flex-direction: column;
}

.alert-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-md) var(--spacing-lg);
  border-bottom: 1px solid var(--border-low);
  transition: background-color 0.2s ease;
}

.alert-item:last-child {
  border-bottom: none;
}

.alert-item:hover {
  background: var(--fill-secondary);
}

.alert-dot {
  width: 8px;
  height: 8px;
  border-radius: var(--radius-round);
  flex-shrink: 0;
}

.alert-content {
  flex: 1;
  min-width: 0;
}

.alert-title {
  font-size: var(--font-size-small);
  color: var(--text-primary);
  font-weight: var(--font-weight-medium);
  display: flex;
  align-items: center;
  gap: var(--spacing-4);
  flex-wrap: wrap;
}

.alert-tag {
  font-size: var(--font-size-xs);
}

.alert-level-text {
  font-size: var(--font-size-xs);
  color: var(--text-muted);
}

.alert-meta {
  font-size: var(--font-size-xs);
  color: var(--text-muted);
  margin-top: var(--spacing-4);
  display: flex;
  align-items: center;
  gap: var(--spacing-4);
}

.alert-meta-divider {
  color: var(--border-primary);
}

/* ==================== 事件列表 ==================== */
.event-list {
  display: flex;
  flex-direction: column;
}

.event-item {
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-md);
  padding: var(--spacing-md) var(--spacing-lg);
  border-bottom: 1px solid var(--border-low);
  transition: background-color 0.2s ease;
}

.event-item:last-child {
  border-bottom: none;
}

.event-item:hover {
  background: var(--fill-secondary);
}

.event-dot {
  width: 8px;
  height: 8px;
  border-radius: var(--radius-round);
  flex-shrink: 0;
  margin-top: 6px;
}

.event-content {
  flex: 1;
  min-width: 0;
}

.event-title {
  font-size: var(--font-size-small);
  color: var(--text-primary);
  font-weight: var(--font-weight-medium);
}

.event-detail {
  font-size: var(--font-size-xs);
  color: var(--text-muted);
  margin-top: var(--spacing-2);
}

.event-time {
  font-size: var(--font-size-xs);
  color: var(--text-muted);
  white-space: nowrap;
  flex-shrink: 0;
}

/* ==================== 设备监控 ==================== */
.equipment-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.equipment-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.equipment-icon {
  width: 36px;
  height: 36px;
  border-radius: var(--radius-md);
  background: var(--fill-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary);
  flex-shrink: 0;
}

.equipment-info {
  flex: 1;
  min-width: 0;
}

.equipment-label {
  font-size: var(--font-size-small);
  color: var(--text-secondary);
  margin-bottom: var(--spacing-4);
}

.equipment-bar-track {
  width: 100%;
  height: 8px;
  background: var(--fill-page);
  border-radius: var(--radius-round);
  overflow: hidden;
}

.equipment-bar-fill {
  height: 100%;
  background: var(--color-success);
  border-radius: var(--radius-round);
  transition: width 0.6s ease;
}

.equipment-bar-fill--warning {
  background: var(--color-warning);
}

.equipment-count {
  font-size: var(--font-size-small);
  font-weight: var(--font-weight-medium);
  white-space: nowrap;
  flex-shrink: 0;
}

.equipment-count-online {
  color: var(--color-success);
}

.equipment-count-divider {
  color: var(--text-muted);
  margin: 0 2px;
}

.equipment-count-total {
  color: var(--text-secondary);
}

/* ==================== 用能柱状图 ==================== */
.energy-bars {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.energy-bar-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.energy-bar-label {
  width: 80px;
  font-size: var(--font-size-xs);
  color: var(--text-secondary);
  text-align: right;
  flex-shrink: 0;
}

.energy-bar-track {
  flex: 1;
  height: 20px;
  background: var(--fill-page);
  border-radius: var(--radius-round);
  overflow: hidden;
}

.energy-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--color-primary), var(--color-primary-hover));
  border-radius: var(--radius-round);
  transition: width 0.6s ease;
}

.energy-bar-value {
  width: 56px;
  font-size: var(--font-size-small);
  font-weight: var(--font-weight-medium);
  color: var(--text-primary);
  text-align: right;
  flex-shrink: 0;
}

/* ==================== 实时趋势 ==================== */
.trend-chart {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.trend-svg-wrap {
  width: 100%;
  height: 80px;
}

.trend-svg {
  width: 100%;
  height: 100%;
}

.trend-bars {
  display: flex;
  align-items: flex-end;
  gap: 4px;
  height: 140px;
}

.trend-bar-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-4);
  height: 100%;
  justify-content: flex-end;
}

.trend-bar {
  width: 100%;
  max-width: 28px;
  background: linear-gradient(180deg, var(--color-primary-hover), var(--color-primary));
  border-radius: var(--radius-sm) var(--radius-sm) 0 0;
  transition: height 0.4s ease;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  position: relative;
  min-height: 4px;
}

.trend-bar-val {
  font-size: 10px;
  color: var(--text-muted);
  margin-top: -18px;
  white-space: nowrap;
}

.trend-bar-label {
  font-size: var(--font-size-xs);
  color: var(--text-muted);
  white-space: nowrap;
}

/* ==================== 快捷入口 ==================== */
.quick-links {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
  margin-top: var(--spacing-16);
  padding: var(--spacing-md);
}


/* ==================== 响应式 ==================== */
@media (max-width: 1024px) {
  .stats-row {
    grid-template-columns: repeat(2, 1fr);
  }

  .content-row {
    grid-template-columns: 1fr;
  }

  .skeleton-row {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .stats-row {
    grid-template-columns: 1fr;
  }

  .skeleton-row {
    grid-template-columns: 1fr;
  }

  .dashboard-topbar {
    flex-direction: column;
    gap: var(--spacing-md);
    align-items: flex-start;
  }
}
</style>