<!--
  组件名称: AiWarningItem
  用途: 模块3 - 安消应AI预警单条预警明细页，展示预警详情、AI识别细节、处置记录
-->
<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { WarningFilled, Clock, VideoCamera, PictureFilled, UserFilled, Phone } from '@element-plus/icons-vue'
import SysButton from '@/components/SysButton.vue'
import SysTag from '@/components/SysTag.vue'
import PageHeader from '@/components/PageHeader.vue'

const router = useRouter()
const route = useRoute()

// ==================== 加载状态 ====================
const pageLoading = ref(true)
setTimeout(() => { pageLoading.value = false }, 500)

// ============================================================
// 预警明细数据（示例，按 ID 匹配）
// ============================================================
const itemId = computed(() => Number(route.params.id) || 1)

const itemData = ref({
  id: itemId.value,
  type: '火情',
  site: '石化园区储罐区东南角',
  cameraId: 'CAM-102',
  time: '2026-05-11 09:23:15',
  confidence: 92,
  status: '未处理',
  // AI识别细节
  aiDetail: '检测到明火区域，火焰面积约0.5㎡，伴随烟雾特征。目标框定位：储罐区东南角，画面坐标(320, 180)至(480, 340)。',
  images: [
    { id: 1, label: '火焰目标框截图', color: '#e74c3c' },
    { id: 2, label: '烟雾特征截图', color: '#e67e22' },
  ],
  hasVideo: true,
  videoLabel: '预警前后10秒视频',
  // 处置记录
  dispatchRecords: [
    {
      time: '2026-05-11 09:25:00',
      content: '派发给消防中队（王队长 138****1111）',
      type: 'dispatch',
    },
    {
      time: '2026-05-11 09:35:00',
      content: '核实人李消防员，结果：真实火情（油桶着火）',
      type: 'verify',
    },
    {
      time: '2026-05-11 09:45:00',
      content: '10分钟内扑灭，疏散周边20米内人员',
      type: 'action',
    },
    {
      time: '2026-05-11 10:10:00',
      content: '闭环确认：已清理现场，无复燃风险',
      type: 'close',
    },
  ],
})

const getStatusType = (status) => {
  if (status === '未处理') return 'danger'
  if (status === '处理中') return 'warning'
  if (status === '已闭环') return 'success'
  return 'info'
}

// ============================================================
// 操作
// ============================================================
const handleRedispatch = () => {
  ElMessage.success('已重新派发预警工单')
}

const handleMarkFalseAlarm = () => {
  ElMessage.info('已标记为误报，将反馈给AI模型')
}

const handleUploadMedia = () => {
  ElMessage.info('打开现场照片/视频上传')
}

const handleMarkClosed = () => {
  ElMessage.success('已标记闭环')
}

const handleExportPDF = () => {
  ElMessage.success('正在导出预警报告为PDF...')
}

const goBack = () => {
  router.push('/ai-warning/detail')
}
</script>

<template>
  <div class="page-content">
    <!-- ============================================================ -->
    <!-- 页面标题栏 -->
    <!-- ============================================================ -->
    <PageHeader
      title="预警明细"
      show-back
      back-text="返回列表"
      back-path="/ai-warning/detail"
    >
      <template #extra>
        <SysTag :type="getStatusType(itemData.status)" size="small" variant="solid">
          {{ itemData.status }}
        </SysTag>
      </template>
    </PageHeader>

    <!-- ==================== 骨架屏加载 ==================== -->
    <template v-if="pageLoading">
      <div class="skeleton-section">
        <el-skeleton :rows="6" animated />
      </div>
      <div class="skeleton-section">
        <el-skeleton :rows="4" animated />
      </div>
    </template>

    <template v-else>
      <!-- ============================================================ -->
      <!-- 3.3 预警信息 -->
      <!-- ============================================================ -->
      <div class="section-card">
        <div class="section-header"><h2>预警信息</h2></div>
        <div class="info-grid">
          <div class="info-item">
            <span class="info-label">预警时间</span>
            <span class="info-value">{{ itemData.time }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">预警类型</span>
            <span class="info-value">
              <SysTag :type="itemData.type === '火情' ? 'danger' : itemData.type === '烟雾' ? 'warning' : 'info'" size="small">
                {{ itemData.type }}
              </SysTag>
            </span>
          </div>
          <div class="info-item">
            <span class="info-label">发生点位</span>
            <span class="info-value">{{ itemData.site }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">摄像头ID</span>
            <span class="info-value code">{{ itemData.cameraId }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">AI置信度</span>
            <span class="info-value confidence">{{ itemData.confidence }}%</span>
          </div>
        </div>

        <!-- 预警截图 & 视频回放 -->
        <div class="image-section">
          <h3>预警截图 / 视频回放</h3>
          <div class="image-grid">
            <div
              v-for="img in itemData.images"
              :key="img.id"
              class="image-card"
              :style="{ borderColor: img.color }"
            >
              <div class="image-placeholder" :style="{ background: img.color + '22' }">
                <el-icon :size="32" :style="{ color: img.color }"><PictureFilled /></el-icon>
                <span>预警截图 {{ img.id }}</span>
              </div>
              <span class="image-label">{{ img.label }}</span>
            </div>
            <div v-if="itemData.hasVideo" class="image-card video-card">
              <div class="image-placeholder video" style="background: #9b59b622">
                <el-icon :size="32" :style="{ color: '#9b59b6' }"><VideoCamera /></el-icon>
                <span>视频片段</span>
              </div>
              <span class="image-label">{{ itemData.videoLabel }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- ============================================================ -->
      <!-- AI识别细节 -->
      <!-- ============================================================ -->
      <div class="section-card">
        <div class="section-header">
          <h2>
            <el-icon :size="18"><WarningFilled /></el-icon>
            AI识别细节
          </h2>
        </div>
        <p class="ai-detail-text">{{ itemData.aiDetail }}</p>
      </div>

      <!-- ============================================================ -->
      <!-- 处置记录 -->
      <!-- ============================================================ -->
      <div class="section-card">
        <div class="section-header"><h2>处置记录</h2></div>
        <div class="timeline">
          <div
            v-for="(record, idx) in itemData.dispatchRecords"
            :key="idx"
            class="timeline-item"
            :class="`timeline-${record.type}`"
          >
            <div class="timeline-dot" :class="record.type"></div>
            <div class="timeline-content">
              <div class="timeline-time">{{ record.time }}</div>
              <div class="timeline-text">{{ record.content }}</div>
              <div class="timeline-type-tag">
                <SysTag
                  v-if="record.type === 'dispatch'"
                  type="primary" size="mini" variant="outline"
                >派发</SysTag>
                <SysTag
                  v-else-if="record.type === 'verify'"
                  type="warning" size="mini" variant="outline"
                >现场核实</SysTag>
                <SysTag
                  v-else-if="record.type === 'action'"
                  type="info" size="mini" variant="outline"
                >处置动作</SysTag>
                <SysTag
                  v-else-if="record.type === 'close'"
                  type="success" size="mini" variant="outline"
                >闭环确认</SysTag>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ============================================================ -->
      <!-- 操作按钮区 -->
      <!-- ============================================================ -->
      <div class="action-bar">
        <SysButton type="primary" @click="handleRedispatch">
          重新派发
        </SysButton>
        <SysButton type="warning" @click="handleMarkFalseAlarm">
          标记误报
        </SysButton>
        <SysButton type="warning" variant="outline" @click="handleUploadMedia">
          上传现场照片/视频
        </SysButton>
        <SysButton type="success" @click="handleMarkClosed">
          标记闭环
        </SysButton>
        <SysButton type="default" variant="outline" @click="handleExportPDF">
          导出PDF
        </SysButton>
      </div>
    </template>
  </div>
</template>

<style scoped>
.page-content {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-16);
}

/* ==================== 骨架屏 ==================== */
.skeleton-section {
  padding: var(--spacing-lg);
  background: var(--fill-surface);
  border-radius: var(--radius-lg);
}

/* ==================== 区块卡片 ==================== */
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
  font-size: var(--font-size-body);
  font-weight: var(--font-weight-medium);
  color: var(--text-primary);
  margin: 0;
  display: flex;
  align-items: center;
  gap: var(--spacing-6);
}

/* ==================== 信息网格 ==================== */
.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-12) var(--spacing-24);
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-4);
}

.info-label {
  font-size: var(--font-size-xs);
  color: var(--text-muted);
  font-weight: var(--font-weight-medium);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.info-value {
  font-size: var(--font-size-small);
  color: var(--text-primary);
  line-height: 1.6;
}

.info-value.code {
  font-family: monospace;
  color: var(--color-primary);
  font-weight: var(--font-weight-medium);
}

.info-value.confidence {
  font-size: var(--font-size-body);
  font-weight: var(--font-weight-bold);
  color: var(--color-success);
}

/* ==================== 图片区域 ==================== */
.image-section {
  margin-top: var(--spacing-16);
}

.image-section h3 {
  font-size: var(--font-size-small);
  font-weight: var(--font-weight-medium);
  color: var(--text-secondary);
  margin: 0 0 var(--spacing-8) 0;
}

.image-grid {
  display: flex;
  gap: var(--spacing-12);
  flex-wrap: wrap;
}

.image-card {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-4);
  border: 2px solid var(--border-low);
  border-radius: var(--radius-md);
  overflow: hidden;
  border-top-width: 3px;
}

.image-placeholder {
  width: 140px;
  height: 100px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-4);
  font-size: var(--font-size-xs);
  color: var(--text-muted);
}

.image-placeholder.video {
  position: relative;
}

.image-label {
  font-size: var(--font-size-xs);
  color: var(--text-secondary);
  text-align: center;
  padding: var(--spacing-4);
  background: var(--fill-secondary);
}

/* ==================== AI细节文本 ==================== */
.ai-detail-text {
  font-size: var(--font-size-small);
  color: var(--text-primary);
  line-height: 1.8;
  padding: var(--spacing-12);
  background: var(--fill-secondary);
  border-radius: var(--radius-md);
  margin: 0;
}

/* ==================== 时间线 ==================== */
.timeline {
  display: flex;
  flex-direction: column;
  gap: 0;
  padding-left: var(--spacing-4);
  border-left: 2px solid var(--border-default);
}

.timeline-item {
  position: relative;
  padding-left: var(--spacing-16);
  padding-bottom: var(--spacing-16);
}

.timeline-item:last-child {
  padding-bottom: 0;
}

.timeline-dot {
  position: absolute;
  left: -7px;
  top: 4px;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: var(--color-success);
  border: 2px solid var(--fill-surface);
}

.timeline-dot.dispatch { background: var(--color-primary); }
.timeline-dot.verify { background: var(--color-warning); }
.timeline-dot.action { background: var(--color-info); }
.timeline-dot.close { background: var(--color-success); }

.timeline-content {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-4);
}

.timeline-time {
  font-size: var(--font-size-xs);
  color: var(--text-muted);
}

.timeline-text {
  font-size: var(--font-size-small);
  color: var(--text-primary);
  line-height: 1.5;
}

.timeline-type-tag {
  margin-top: 2px;
}

/* ==================== 操作按钮区 ==================== */
.action-bar {
  display: flex;
  gap: var(--spacing-8);
  flex-wrap: wrap;
  padding: var(--spacing-16);
  background: var(--fill-surface);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--border-low);
}
</style>