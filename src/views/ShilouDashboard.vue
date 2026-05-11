<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

// 模拟实时数据
const currentTime = ref('')
const onlineDevices = ref(128)
const totalVisitors = ref(3456)
const activeAlarms = ref(3)
const systemHealth = ref(98.5)
const dataThroughput = ref('1.2 TB')
const todayEvents = ref(267)

const deviceStatus = ref([
  { name: '温湿度传感器', status: 'online', value: '24.6°C / 58%RH', icon: 'Odometer' },
  { name: '烟雾报警器', status: 'online', value: '正常', icon: 'Bell' },
  { name: '门禁系统', status: 'online', value: '已锁定', icon: 'Lock' },
  { name: '视频监控', status: 'warning', value: '3路离线', icon: 'VideoCamera' },
  { name: '消防水泵', status: 'online', value: '0.8MPa', icon: 'Switch' },
  { name: '电梯运行', status: 'online', value: '2部运行', icon: 'Connection' },
])

const recentAlarms = ref([
  { id: 1, level: 'danger', time: '14:12:35', device: '视频监控 #12', message: '设备离线', status: '未处理' },
  { id: 2, level: 'warning', time: '13:58:22', device: '温湿度传感器 #03', message: '温度超过阈值(28°C)', status: '处理中' },
  { id: 3, level: 'danger', time: '13:45:10', device: '烟雾报警器 #07', message: '烟雾浓度异常', status: '未处理' },
  { id: 4, level: 'info', time: '13:32:08', device: '门禁系统 #01', message: '非法闯入告警', status: '已恢复' },
  { id: 5, level: 'warning', time: '13:15:44', device: '消防水泵 #02', message: '水压偏低(0.3MPa)', status: '已处理' },
])

const energyData = ref([
  { label: '一号楼', value: 45.6 },
  { label: '二号楼', value: 38.2 },
  { label: '三号楼', value: 52.1 },
  { label: '四号楼', value: 41.8 },
  { label: '五号楼', value: 35.5 },
  { label: '公共区域', value: 28.9 },
])

const dailyTrend = ref([
  { time: '08:00', value: 120 },
  { time: '09:00', value: 185 },
  { time: '10:00', value: 210 },
  { time: '11:00', value: 256 },
  { time: '12:00', value: 198 },
  { time: '13:00', value: 175 },
  { time: '14:00', value: 242 },
])

// 实时时钟
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

const getStatusColor = (status) => {
  const map = { online: '#67c23a', warning: '#e6a23c', offline: '#f56c6c' }
  return map[status] || '#909399'
}

const getStatusText = (status) => {
  const map = { online: '在线', warning: '警告', offline: '离线' }
  return map[status] || status
}

const getLevelType = (level) => {
  const map = { danger: 'danger', warning: 'warning', info: 'info' }
  return map[level] || 'info'
}

const getLevelText = (level) => {
  const map = { danger: '严重', warning: '警告', info: '提示' }
  return map[level] || level
}

const getAlarmStatusType = (status) => {
  const map = { '未处理': 'danger', '处理中': 'warning', '已恢复': 'success', '已处理': 'info' }
  return map[status] || 'info'
}

const maxEnergy = Math.max(...energyData.value.map(d => d.value))
const maxTrend = Math.max(...dailyTrend.value.map(d => d.value))
</script>

<template>
  <div class="dashboard">
    <!-- 顶部标题栏 -->
    <div class="dashboard-header">
      <div class="header-left">
        <h1>🏢 石楼智慧楼宇管理平台</h1>
        <span class="header-subtitle">Smart Building Management Dashboard</span>
      </div>
      <div class="header-right">
        <span class="time-display">{{ currentTime }}</span>
        <el-tag type="success" size="large" effect="dark">系统运行中</el-tag>
      </div>
    </div>

    <!-- 核心指标卡片 -->
    <el-row :gutter="16" class="metric-row">
      <el-col :span="4">
        <div class="metric-card metric-card--blue">
          <div class="metric-icon">
            <el-icon :size="32"><Connection /></el-icon>
          </div>
          <div class="metric-info">
            <div class="metric-value">{{ onlineDevices }}</div>
            <div class="metric-label">在线设备</div>
          </div>
        </div>
      </el-col>
      <el-col :span="4">
        <div class="metric-card metric-card--green">
          <div class="metric-icon">
            <el-icon :size="32"><User /></el-icon>
          </div>
          <div class="metric-info">
            <div class="metric-value">{{ totalVisitors.toLocaleString() }}</div>
            <div class="metric-label">累计访客</div>
          </div>
        </div>
      </el-col>
      <el-col :span="4">
        <div class="metric-card metric-card--red">
          <div class="metric-icon">
            <el-icon :size="32"><WarningFilled /></el-icon>
          </div>
          <div class="metric-info">
            <div class="metric-value">{{ activeAlarms }}</div>
            <div class="metric-label">活跃告警</div>
          </div>
        </div>
      </el-col>
      <el-col :span="4">
        <div class="metric-card metric-card--cyan">
          <div class="metric-icon">
            <el-icon :size="32"><Monitor /></el-icon>
          </div>
          <div class="metric-info">
            <div class="metric-value">{{ systemHealth }}%</div>
            <div class="metric-label">系统健康度</div>
          </div>
        </div>
      </el-col>
      <el-col :span="4">
        <div class="metric-card metric-card--orange">
          <div class="metric-icon">
            <el-icon :size="32"><DataAnalysis /></el-icon>
          </div>
          <div class="metric-info">
            <div class="metric-value">{{ dataThroughput }}</div>
            <div class="metric-label">数据吞吐量</div>
          </div>
        </div>
      </el-col>
      <el-col :span="4">
        <div class="metric-card metric-card--purple">
          <div class="metric-icon">
            <el-icon :size="32"><Document /></el-icon>
          </div>
          <div class="metric-info">
            <div class="metric-value">{{ todayEvents }}</div>
            <div class="metric-label">今日事件</div>
          </div>
        </div>
      </el-col>
    </el-row>

    <!-- 主要内容区域 -->
    <el-row :gutter="16" class="content-row">
      <!-- 左侧：设备状态 -->
      <el-col :span="8">
        <el-card shadow="hover" class="panel-card">
          <template #header>
            <div class="panel-header">
              <span>📡 设备状态监控</span>
              <el-tag size="small">共{{ deviceStatus.length }}台</el-tag>
            </div>
          </template>
          <div class="device-list">
            <div
              v-for="device in deviceStatus"
              :key="device.name"
              class="device-item"
            >
              <div class="device-left">
                <span
                  class="status-dot"
                  :style="{ backgroundColor: getStatusColor(device.status) }"
                ></span>
                <el-icon :size="18"><component :is="device.icon" /></el-icon>
                <span class="device-name">{{ device.name }}</span>
              </div>
              <div class="device-right">
                <span class="device-value">{{ device.value }}</span>
                <el-tag
                  :type="device.status === 'online' ? 'success' : 'warning'"
                  size="small"
                  effect="plain"
                >
                  {{ getStatusText(device.status) }}
                </el-tag>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>

      <!-- 中间：能耗统计 -->
      <el-col :span="8">
        <el-card shadow="hover" class="panel-card">
          <template #header>
            <div class="panel-header">
              <span>⚡ 各楼栋能耗 (kWh)</span>
              <el-tag size="small" type="info">今日</el-tag>
            </div>
          </template>
          <div class="chart-bar-container">
            <div
              v-for="item in energyData"
              :key="item.label"
              class="chart-bar-item"
            >
              <div class="chart-bar-label">{{ item.label }}</div>
              <div class="chart-bar-track">
                <div
                  class="chart-bar-fill"
                  :style="{ width: (item.value / maxEnergy * 100) + '%' }"
                ></div>
              </div>
              <div class="chart-bar-value">{{ item.value }}</div>
            </div>
          </div>
        </el-card>

        <!-- 实时趋势 -->
        <el-card shadow="hover" class="panel-card" style="margin-top: 16px;">
          <template #header>
            <div class="panel-header">
              <span>📈 实时人流量趋势</span>
              <el-tag size="small" type="primary">今日</el-tag>
            </div>
          </template>
          <div class="trend-chart">
            <div
              v-for="item in dailyTrend"
              :key="item.time"
              class="trend-bar-container"
            >
              <div
                class="trend-bar"
                :style="{ height: (item.value / maxTrend * 120) + 'px' }"
              >
                <span class="trend-bar-val">{{ item.value }}</span>
              </div>
              <div class="trend-bar-label">{{ item.time }}</div>
            </div>
          </div>
        </el-card>
      </el-col>

      <!-- 右侧：告警列表 -->
      <el-col :span="8">
        <el-card shadow="hover" class="panel-card">
          <template #header>
            <div class="panel-header">
              <span>🔔 最新告警</span>
              <el-button type="primary" link size="small">查看全部</el-button>
            </div>
          </template>
          <div class="alarm-list">
            <div
              v-for="alarm in recentAlarms"
              :key="alarm.id"
              class="alarm-item"
            >
              <div class="alarm-header">
                <el-tag :type="getLevelType(alarm.level)" size="small" effect="dark">
                  {{ getLevelText(alarm.level) }}
                </el-tag>
                <span class="alarm-time">{{ alarm.time }}</span>
              </div>
              <div class="alarm-body">
                <div class="alarm-device">{{ alarm.device }}</div>
                <div class="alarm-message">{{ alarm.message }}</div>
              </div>
              <div class="alarm-footer">
                <el-tag :type="getAlarmStatusType(alarm.status)" size="small" effect="plain">
                  {{ alarm.status }}
                </el-tag>
                <el-button type="primary" link size="small">处理</el-button>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<style scoped>
.dashboard {
  padding: var(--spacing-md);
  background: var(--fill-page);
  min-height: 100%;
}

/* 顶部标题栏 */
.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-md);
  padding: var(--spacing-16) var(--spacing-24);
  background: var(--sidebar-bg);
  border-radius: var(--radius-lg);
  color: var(--text-inverse);
}

.header-left h1 {
  font-size: var(--font-size-h3);
  margin: 0;
  font-weight: var(--font-weight-medium);
}

.header-subtitle {
  font-size: var(--font-size-xs);
  opacity: 0.8;
  letter-spacing: 2px;
}

.header-right {
  display: flex;
  align-items: center;
  gap: var(--spacing-16);
}

.time-display {
  font-size: var(--font-size-body);
  font-family: var(--font-family-mono);
  letter-spacing: 1px;
}

/* 指标卡片 */
.metric-row {
  margin-bottom: var(--spacing-16);
}

.metric-card {
  display: flex;
  align-items: center;
  gap: var(--spacing-12);
  padding: var(--spacing-16);
  border-radius: var(--radius-lg);
  color: var(--text-inverse);
  height: 88px;
  box-sizing: border-box;
}

.metric-card--blue   { background: var(--color-info); }
.metric-card--green  { background: var(--color-success); }
.metric-card--red    { background: var(--color-danger); }
.metric-card--cyan   { background: var(--color-primary); }
.metric-card--orange { background: var(--color-warning); }
.metric-card--purple { background: var(--color-primary-dark); }

.metric-icon {
  opacity: 0.9;
  flex-shrink: 0;
}

.metric-info {
  min-width: 0;
}

.metric-value {
  font-size: var(--font-size-h2);
  font-weight: var(--font-weight-bold);
  line-height: 1.2;
}

.metric-label {
  font-size: var(--font-size-xs);
  opacity: 0.85;
  margin-top: var(--spacing-2);
}

/* 面板卡片 */
.panel-card {
  border-radius: var(--radius-lg);
  margin-bottom: var(--spacing-16);
}

.panel-card :deep(.el-card__header) {
  padding: var(--spacing-12) var(--spacing-16);
  background: var(--fill-secondary);
  border-bottom: 1px solid var(--border-low);
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: var(--font-weight-medium);
  font-size: var(--font-size-body);
}

/* 设备列表 */
.device-list {
  max-height: 420px;
  overflow-y: auto;
}

.device-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-12) 0;
  border-bottom: 1px solid var(--border-low);
}

.device-item:last-child {
  border-bottom: none;
}

.device-left {
  display: flex;
  align-items: center;
  gap: var(--spacing-8);
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: var(--radius-round);
  flex-shrink: 0;
}

.device-name {
  font-size: var(--font-size-small);
  color: var(--text-primary);
}

.device-right {
  display: flex;
  align-items: center;
  gap: var(--spacing-8);
}

.device-value {
  font-size: var(--font-size-small);
  color: var(--text-secondary);
  font-family: var(--font-family-mono);
}

/* 柱状图 */
.chart-bar-container {
  padding: 4px 0;
}

.chart-bar-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-4);
  margin-bottom: var(--spacing-12);
}

.chart-bar-item:last-child {
  margin-bottom: 0;
}

.chart-bar-label {
  width: 64px;
  font-size: var(--font-size-xs);
  color: var(--text-secondary);
  text-align: right;
  flex-shrink: 0;
}

.chart-bar-track {
  flex: 1;
  height: 22px;
  background: var(--fill-page);
  border-radius: var(--radius-round);
  overflow: hidden;
}

.chart-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--color-primary), var(--color-info));
  border-radius: var(--radius-round);
  transition: width 0.6s ease;
}

.chart-bar-value {
  width: 40px;
  font-size: var(--font-size-small);
  color: var(--text-primary);
  font-weight: var(--font-weight-medium);
  font-family: var(--font-family-mono);
}

/* 趋势图 */
.trend-chart {
  display: flex;
  justify-content: space-around;
  align-items: flex-end;
  height: 160px;
  padding: 0 8px;
}

.trend-bar-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-4);
  flex: 1;
}

.trend-bar {
  width: 28px;
  background: linear-gradient(180deg, var(--color-primary), var(--color-info));
  border-radius: var(--radius-sm) var(--radius-sm) 0 0;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  transition: height 0.5s ease;
  min-height: 8px;
}

.trend-bar-val {
  font-size: var(--font-size-xs);
  color: var(--text-inverse);
  padding-top: var(--spacing-4);
  font-weight: var(--font-weight-medium);
}

.trend-bar-label {
  font-size: var(--font-size-xs);
  color: var(--text-muted);
}

/* 告警列表 */
.alarm-list {
  max-height: 500px;
  overflow-y: auto;
}

.alarm-item {
  padding: var(--spacing-12);
  margin-bottom: var(--spacing-8);
  background: var(--fill-secondary);
  border-radius: var(--radius-md);
  border-left: 3px solid var(--border-default);
}

.alarm-item:last-child {
  margin-bottom: 0;
}

.alarm-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
}

.alarm-time {
  font-size: var(--font-size-xs);
  color: var(--text-muted);
  font-family: var(--font-family-mono);
}

.alarm-body {
  margin-bottom: var(--spacing-8);
}

.alarm-device {
  font-size: var(--font-size-small);
  font-weight: var(--font-weight-medium);
  color: var(--text-primary);
}

.alarm-message {
  font-size: var(--font-size-body);
  color: var(--text-secondary);
  margin-top: var(--spacing-2);
}

.alarm-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>