<!--
  组件名称: AiWarning
  用途: 模块3 - 安消应AI预警一级页面，展示今日未处理预警、实时视频流、最新预警列表
-->
<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { WarningFilled, VideoCamera, View, Bell } from '@element-plus/icons-vue'
import StatsCard from '@/components/StatsCard.vue'
import SysTable from '@/components/SysTable.vue'
import SysButton from '@/components/SysButton.vue'
import SysTag from '@/components/SysTag.vue'
import PageHeader from '@/components/PageHeader.vue'
import vcrFire from '@/assets/vcr-fire.mp4'

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

// ==================== 加载状态 ====================
const pageLoading = ref(true)
setTimeout(() => { pageLoading.value = false }, 600)

// ============================================================
// 今日核心指标数据（示例）
// ============================================================
const todayStats = computed(() => ({
  unprocessedCount: 5,        // 今日未处理预警数
  totalCount: 12,             // 今日预警总数
  yesterdayTotal: 10,         // 昨日预警总数
}))

const ringChange = computed(() => {
  const diff = todayStats.value.totalCount - todayStats.value.yesterdayTotal
  return diff >= 0 ? `环比昨日+${diff}` : `环比昨日${diff}`
})

// ============================================================
// 各类型预警分布（未处理）
// ============================================================
const typeDist = ref([
  { name: '火情', count: 2, color: 'var(--color-danger)' },
  { name: '烟雾', count: 1, color: 'var(--color-warning)' },
  { name: '违规闯入', count: 1, color: 'var(--color-info)' },
  { name: '未戴安全帽', count: 1, color: 'var(--color-primary)' },
])

const maxTypeCount = computed(() => Math.max(...typeDist.value.map(t => t.count), 1))

// ============================================================
// 视频流 - 可切换点位
// ============================================================
const cameraSites = ref([
  { id: 'cam-1', name: '石化园区东门', online: true, lastAlertTime: '10分钟前火情预警' },
  { id: 'cam-2', name: '学校门口', online: true, lastAlertTime: '—' },
  { id: 'cam-3', name: '河道北段', online: true, lastAlertTime: '—' },
  { id: 'cam-4', name: '宏达制造车间', online: true, lastAlertTime: '23分钟前烟雾预警' },
  { id: 'cam-5', name: '建筑工地', online: false, lastAlertTime: '—' },
])

const activeCamera = ref(cameraSites.value[0])

const switchCamera = (siteId) => {
  const found = cameraSites.value.find(s => s.id === siteId)
  if (found) activeCamera.value = found
}

// ============================================================
// 最新预警列表（示例，按时间倒序）
// ============================================================
const alertList = ref([
  {
    id: 1,
    type: '火情',
    site: '石化园区储罐区',
    time: '09:23:15',
    status: '未处理',
    confidence: 92,
    cameraId: 'CAM-102',
  },
  {
    id: 2,
    type: '烟雾',
    site: '宏达制造车间',
    time: '08:57:42',
    status: '处理中',
    confidence: 88,
    cameraId: 'CAM-201',
  },
  {
    id: 3,
    type: '违规闯入',
    site: '学校周界',
    time: '08:12:03',
    status: '未处理',
    confidence: 79,
    cameraId: 'CAM-305',
  },
  {
    id: 4,
    type: '未戴安全帽',
    site: '建筑工地',
    time: '07:45:20',
    status: '已闭环',
    confidence: 85,
    cameraId: 'CAM-408',
  },
  {
    id: 5,
    type: '烟雾',
    site: '石化园区储罐区',
    time: '07:20:08',
    status: '已闭环',
    confidence: 90,
    cameraId: 'CAM-103',
  },
])

const columns = [
  { prop: 'type', label: '预警类型', width: 110, slot: 'type' },
  { prop: 'site', label: '发生点位', minWidth: 150 },
  { prop: 'time', label: '预警时间', width: 100 },
  { prop: 'status', label: '当前状态', width: 100, slot: 'status' },
  { prop: 'confidence', label: 'AI置信度', width: 100, slot: 'confidence' },
  { prop: 'action', label: '操作', width: 120, slot: 'action', align: 'center' },
]

// ============================================================
// 状态映射
// ============================================================
const getStatusType = (status) => {
  if (status === '未处理') return 'danger'
  if (status === '处理中') return 'warning'
  return 'success'
}

const getConfidenceType = (val) => {
  if (val >= 90) return 'success'
  if (val >= 80) return 'warning'
  return 'danger'
}

// ============================================================
// 导航 & 操作
// ============================================================
const goToDetail = () => {
  router.push('/ai-warning/detail')
}

const goToItem = (row) => {
  router.push(`/ai-warning/detail/${row.id}`)
}

const handleProcess = (row) => {
  ElMessage.success(`已为「${row.type}」预警创建处置工单，即将派发`)
  // 模拟状态变更
  row.status = '处理中'
}

const handleViewDetail = (row) => {
  router.push(`/ai-warning/detail/${row.id}`)
}
</script>

<template>
  <div class="page-content">
    <!-- ============================================================ -->
    <!-- 顶部标题栏 -->
    <!-- ============================================================ -->
    <PageHeader
      title="安消应AI预警"
      subtitle="视频监控 → AI识别 → 预警生成 → 派发处置 → 闭环反馈"
      show-back
      back-text="返回一级页面"
      back-path="/home"
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
            数据范围：今日（0点至今）· {{ currentTime }}
          </span>
        </div>
        <el-row :gutter="16" class="stats-row">
          <!-- 今日未处理预警数 - 红色大号 -->
          <el-col class="stats-col">
            <StatsCard
              type="compact"
              :value="todayStats.unprocessedCount"
              label="今日未处理预警数"
              status="danger"
              tag="需处置"
              tag-type="danger"
            />
          </el-col>

          <!-- 今日预警总数 -->
          <el-col class="stats-col">
            <StatsCard
              type="compact"
              :value="todayStats.totalCount"
              label="今日预警总数"
              status="primary"
              :tag="ringChange"
              tag-type="info"
            />
          </el-col>

          <!-- 各类型预警分布 -->
          <el-col :span="12" class="stats-col">
            <div class="type-dist-card">
              <div class="type-dist-header">
                <span class="type-dist-title">各类型预警分布（未处理）</span>
              </div>
              <div class="type-dist-list">
                <div v-for="t in typeDist" :key="t.name" class="type-dist-row">
                  <span class="type-dist-label">{{ t.name }}</span>
                  <div class="type-dist-bar-bg">
                    <div
                      class="type-dist-bar-fill"
                      :style="{ width: (t.count / maxTypeCount * 100) + '%', background: t.color }"
                    ></div>
                  </div>
                  <span class="type-dist-num" :style="{ color: t.color, fontWeight: 'var(--font-weight-bold)' }">{{ t.count }}</span>
                </div>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>

      <!-- ============================================================ -->
      <!-- 实时监控视频流 -->
      <!-- ============================================================ -->
      <div class="section">
        <div class="section-header">
          <h3 class="section-title">
            <el-icon :size="18" style="margin-right: 6px; vertical-align: middle"><VideoCamera /></el-icon>
            实时监控视频流
          </h3>
          <div class="camera-switch">
            <span class="filter-label">切换点位：</span>
            <el-select :model-value="activeCamera.id" size="small" style="width: 180px" @change="switchCamera">
              <el-option v-for="cam in cameraSites" :key="cam.id" :label="cam.name" :value="cam.id">
                <span>{{ cam.name }}</span>
                <SysTag v-if="!cam.online" type="danger" size="mini" style="margin-left: 6px">离线</SysTag>
              </el-option>
            </el-select>
          </div>
        </div>

        <div class="video-area">
          <!-- 主视频窗口 -->
          <div class="video-main">
            <!-- 在线：播放真实视频 -->
            <template v-if="activeCamera.online">
              <video
                :src="vcrFire"
                autoplay
                muted
                loop
                playsinline
                class="video-player"
              ></video>
              <span class="video-site-name video-site-name--overlay">{{ activeCamera.name }}</span>
              <!-- 最近预警浮动标记 -->
              <div v-if="activeCamera.lastAlertTime !== '—'" class="video-alert-tag">
                <el-icon :size="14"><WarningFilled /></el-icon>
                {{ activeCamera.lastAlertTime }}
              </div>
            </template>
            <!-- 离线：占位提示 -->
            <div v-else class="video-player-placeholder">
              <el-icon :size="48"><VideoCamera /></el-icon>
              <span class="video-site-name">{{ activeCamera.name }}</span>
              <span class="video-offline-tag">设备离线</span>
            </div>
          </div>

          <!-- 辅视频缩略图轮播 -->
          <div class="video-thumbnails">
            <div
              v-for="cam in cameraSites"
              :key="cam.id"
              class="video-thumb"
              :class="{ active: cam.id === activeCamera.id, offline: !cam.online }"
              @click="switchCamera(cam.id)"
            >
              <div class="thumb-placeholder">
                <el-icon :size="20"><VideoCamera /></el-icon>
              </div>
              <span class="thumb-label">{{ cam.name }}</span>
              <SysTag v-if="!cam.online" type="danger" size="mini">离线</SysTag>
            </div>
          </div>
        </div>
      </div>

      <!-- ============================================================ -->
      <!-- 最新预警列表 -->
      <!-- ============================================================ -->
      <div class="section">
        <div class="section-header">
          <h3 class="section-title">最新预警列表（按时间倒序）</h3>
          <SysButton type="primary" variant="ghost" @click="goToDetail">
            查看全部历史 →
          </SysButton>
        </div>

        <SysTable
          :data="alertList"
          :columns="columns"
          stripe
          :pagination="false"
        >
          <!-- 预警类型插槽 -->
          <template #type="{ row }">
            <SysTag
              :type="row.type === '火情' ? 'danger' : row.type === '烟雾' ? 'warning' : row.type === '违规闯入' ? 'info' : 'primary'"
              size="small"
            >
              {{ row.type }}
            </SysTag>
          </template>

          <!-- 状态插槽 -->
          <template #status="{ row }">
            <SysTag :type="getStatusType(row.status)" size="small">
              {{ row.status }}
            </SysTag>
          </template>

          <!-- AI置信度插槽 -->
          <template #confidence="{ row }">
            <SysTag :type="getConfidenceType(row.confidence)" size="small">
              {{ row.confidence }}%
            </SysTag>
          </template>

          <!-- 操作插槽 -->
          <template #action="{ row }">
            <div class="action-cell">
              <SysButton
                v-if="row.status !== '已闭环'"
                type="danger"
                size="small"
                variant="ghost"
                @click="handleProcess(row)"
              >
                处理
              </SysButton>
              <SysButton
                v-else
                type="primary"
                size="small"
                variant="ghost"
                @click="handleViewDetail(row)"
              >
                查看
              </SysButton>
              <SysButton
                type="default"
                size="small"
                variant="ghost"
                @click="handleViewDetail(row)"
                style="margin-left: 2px"
              >
                详情
              </SysButton>
            </div>
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
}

.text-muted {
  color: var(--text-muted);
}

.filter-label {
  font-size: var(--font-size-small);
  color: var(--text-secondary);
  white-space: nowrap;
}

/* ==================== 统计卡片区域 ==================== */
.stats-row {
  margin-bottom: 0;
  display: flex;
}
.stats-col {
  flex: 1;
}

/* ==================== 类型分布卡片 ==================== */
.type-dist-card {
  background: var(--fill-secondary);
  border-radius: var(--radius-lg);
  border: 1px solid var(--border-default);
  padding: var(--spacing-sm);
  min-height: 82px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.type-dist-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
}

.type-dist-title {
  font-size: var(--font-size-small);
  color: var(--text-secondary);
}

.type-dist-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
  justify-content: center;
}

.type-dist-row {
  display: flex;
  align-items: center;
  gap: var(--spacing-6);
}

.type-dist-label {
  width: 72px;
  font-size: var(--font-size-xs);
  color: var(--text-secondary);
  flex-shrink: 0;
  text-align: right;
}

.type-dist-bar-bg {
  flex: 1;
  height: 10px;
  background: var(--fill-hover);
  border-radius: var(--radius-xs);
  overflow: hidden;
}

.type-dist-bar-fill {
  height: 100%;
  border-radius: var(--radius-xs);
  transition: width 0.4s ease;
  min-width: 4px;
}

.type-dist-num {
  width: 20px;
  font-size: var(--font-size-small);
  color: var(--text-primary);
  text-align: center;
  flex-shrink: 0;
}

/* ==================== 实时视频流 ==================== */
.video-area {
  display: flex;
  gap: var(--spacing-8);
}

.video-main {
  flex: 1;
  position: relative;
  border-radius: var(--radius-lg);
  overflow: hidden;
  aspect-ratio: 16 / 9;
}

.video-player {
  width: 100%;
  height: 100%;
  object-fit: cover;
  background: var(--text-primary);
}

.video-player-placeholder {
  width: 100%;
  aspect-ratio: 16 / 9;
  background: var(--text-primary);
  border-radius: var(--radius-lg);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-8);
  color: var(--text-muted);
  position: relative;
  overflow: hidden;
  border: 2px solid var(--border-default);
}

.video-player-placeholder::before {
  content: '';
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 2px,
    rgba(255,255,255,0.02) 2px,
    rgba(255,255,255,0.02) 4px
  );
  pointer-events: none;
}

.video-site-name {
  font-size: var(--font-size-body);
  color: var(--text-inverse);
  font-weight: var(--font-weight-medium);
}

.video-site-name--overlay {
  position: absolute;
  bottom: var(--spacing-md);
  left: var(--spacing-md);
  z-index: 2;
  text-shadow: 0 0 8px rgba(0,0,0,0.7);
}

.video-offline-tag {
  font-size: var(--font-size-small);
  color: var(--color-danger);
  background: var(--color-danger-bg);
  padding: var(--spacing-2) var(--spacing-12);
  border-radius: var(--radius-md);
  font-weight: var(--font-weight-bold);
}

.video-alert-tag {
  position: absolute;
  bottom: var(--spacing-md);
  right: var(--spacing-md);
  display: flex;
  align-items: center;
  gap: var(--spacing-4);
  font-size: var(--font-size-xs);
  color: var(--color-danger);
  background: rgba(229, 83, 83, 0.15);
  border: 1px solid var(--color-danger-border);
  padding: var(--spacing-4) var(--spacing-12);
  border-radius: var(--radius-md);
  font-weight: var(--font-weight-bold);
  pointer-events: none;
}

/* ==================== 视频缩略图 ==================== */
.video-thumbnails {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-8);
  width: 160px;
  flex-shrink: 0;
  overflow-y: auto;
}

.video-thumb {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  padding: var(--spacing-8);
  border-radius: var(--radius-md);
  border: 2px solid var(--border-default);
  cursor: pointer;
  transition: border-color 0.2s ease;
  background: var(--fill-secondary);
}

.video-thumb.active {
  border-color: var(--color-primary);
  background: var(--color-primary-bg);
}

.video-thumb.offline {
  opacity: 0.5;
}

.thumb-placeholder {
  width: 100%;
  aspect-ratio: 16 / 9;
  background: var(--text-primary);
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-muted);
}

.thumb-label {
  font-size: var(--font-size-xs);
  color: var(--text-secondary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
}

/* ==================== 操作按钮组 ==================== */
.action-cell {
  display: flex;
  align-items: center;
  gap: 0;
}

.camera-switch {
  display: flex;
  align-items: center;
  gap: var(--spacing-8);
}

@media (max-width: 900px) {
  .video-area {
    flex-direction: column;
  }
  .video-thumbnails {
    flex-direction: row;
    width: 100%;
    overflow-x: auto;
  }
  .video-thumb {
    min-width: 100px;
  }
}
</style>