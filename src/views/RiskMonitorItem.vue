<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { WarningFilled, Clock, Phone, Message, VideoCamera, PictureFilled, ArrowDown } from '@element-plus/icons-vue'
import SysButton from '@/components/SysButton.vue'
import PageHeader from '@/components/PageHeader.vue'
import { ElMessage } from 'element-plus' 

const router = useRouter()
const route = useRoute()

// ============================================================
// 隐患详情数据（示例，按 ID 匹配的基础数据）
// ============================================================
const itemData = ref({
  id: Number(route.params.id) || 1,
  name: '东区厂房消防通道堵塞',
  desc: '东区厂房北侧消防通道堆积大量成品纸箱，宽度不足1米，严重阻碍消防车辆通行。现场勘查发现纸箱堆积高度约2.5米，占用通道长度约15米，仅留0.8米宽通道供人员通行，不符合《建筑设计防火规范》GB50016要求的最低4米消防通道宽度。',
  source: '网格员巡查',
  finder: '赵网格员',
  findTime: '2026-04-20 09:34',
  level: '高',
  status: '超期',
  requirement: '3日内清理纸箱，恢复4米以上消防通道，并在通道地面施划黄色禁停标线，设置永久性警示标识。整改完成后需拍照上传并申请现场复核。',
  deadline: '2026-05-09',
  unit: '宏达制造',
  person: '张三',
  phone: '138****1234',
  remainDays: -2,
    images: [
    { id: 1, label: '消防通道堵塞全貌', colorType: 'danger' },
    { id: 2, label: '堆积纸箱近景', colorType: 'warning' },
    { id: 3, label: '通道宽度测量', colorType: 'info' },
  ],
  fixRecords: [
    {
      time: '2026-04-25 14:30',
      content: '企业回复已清理50%纸箱，已上传清理后照片',
      hasPhoto: true,
      reviewer: '—',
      result: '—',
    },
    {
      time: '2026-05-08 10:15',
      content: '复核人现场查看，仍有约30%纸箱未清完，未达到整改要求',
      hasPhoto: true,
      reviewer: '王复核员',
      result: '不合格',
    },
  ],
  urgeHistory: [
    {
      time: '2026-05-10 08:30',
      method: '短信催办',
      receiver: '张三（企业负责人）',
      reply: '已收到，将尽快安排',
    },
    {
      time: '2026-05-11 09:15',
      method: '电话催办',
      receiver: '张三（企业负责人）',
      reply: '承诺5月12日前完成清理',
    },
    {
      time: '2026-05-12 14:00',
      method: '短信催办',
      receiver: '张三（企业负责人）',
      reply: '—（未回复）',
    },
  ],
})

// ============================================================
// 计算属性
// ============================================================
const overdueDays = computed(() => Math.abs(itemData.value.remainDays))
const isOverdue = computed(() => itemData.value.remainDays < 0)
const statusType = computed(() => {
  if (itemData.value.status === '已整改') return 'success'
  if (itemData.value.status === '超期') return 'danger'
  return 'warning'
})

// ============================================================
// 操作
// ============================================================
const handleUrge = () => {
  ElMessage.success(`已向「${itemData.value.unit} - ${itemData.value.person}」发送催办提醒`)
}

const handleReassign = () => {
  ElMessage.info('重新派发功能：选择新责任单位')
}

const handleExtend = () => {
  ElMessage.info('延期申请功能：需上级审批')
}

const handleEscalate = () => {
  ElMessage.warning('强制督办：已上报上级主管部门')
}

const handleComplete = () => {
  ElMessage.info('标记完成：请上传整改证明材料')
}

  const handleExport = () => {
  ElMessage.success('正在导出隐患档案为PDF...')
}

// 图片颜色映射
const imageColorMap = {
  danger: 'var(--color-danger)',
  warning: 'var(--color-warning)',
  info: 'var(--color-info)',
  primary: 'var(--color-primary)',
  success: 'var(--color-success)',
}
const imageColorBgMap = {
  danger: 'var(--color-danger-bg)',
  warning: 'var(--color-warning-bg)',
  info: 'var(--color-info-bg)',
  primary: 'var(--color-info-bg)',
  success: 'var(--color-success-bg)',
}
</script>

<template>
  <div class="page-content">
    <!-- ============================================================ -->
    <!-- 页面标题栏 -->
    <!-- ============================================================ -->
    <PageHeader
      title="隐患明细"
      show-back
      back-text="返回列表"
    >
      <template #extra>
        <el-tag :type="statusType" size="large" effect="dark">
          {{ itemData.status }}
        </el-tag>
        <span v-if="isOverdue" class="overdue-badge">
          <el-icon><WarningFilled /></el-icon>
          超期 {{ overdueDays }} 天
        </span>
      </template>
    </PageHeader>

    <!-- ============================================================ -->
    <!-- 基本信息 -->
    <!-- ============================================================ -->
    <div class="section-card">
      <div class="section-header"><h2 class="section-title">基本信息</h2></div>
      <div class="info-grid">
        <div class="info-item full-width">
          <span class="info-label">隐患名称</span>
          <span class="info-value name">{{ itemData.name }}</span>
        </div>
        <div class="info-item full-width">
          <span class="info-label">隐患描述</span>
          <span class="info-value">{{ itemData.desc }}</span>
        </div>
        <div class="info-item">
          <span class="info-label">隐患等级</span>
          <span class="info-value">
            <el-tag :type="itemData.level === '高' ? 'danger' : itemData.level === '中' ? 'warning' : 'info'" size="small" effect="dark">
              {{ itemData.level }}
            </el-tag>
          </span>
        </div>
        <div class="info-item">
          <span class="info-label">发现来源</span>
          <span class="info-value">{{ itemData.source }}</span>
        </div>
        <div class="info-item">
          <span class="info-label">发现人</span>
          <span class="info-value">{{ itemData.finder }}</span>
        </div>
        <div class="info-item">
          <span class="info-label">发现时间</span>
          <span class="info-value">{{ itemData.findTime }}</span>
        </div>
      </div>

      <!-- 现场照片/视频 -->
      <div class="image-section">
        <h3>现场照片</h3>
        <div class="image-grid">
          <div
            v-for="img in itemData.images"
            :key="img.id"
            class="image-card"
            :style="{ borderColor: `var(--color-${img.colorType})` }"
          >
            <div class="image-placeholder" :style="{ background: `var(--color-${img.colorType}-bg)` }">
              <el-icon :size="32" :style="{ color: `var(--color-${img.colorType})` }"><PictureFilled /></el-icon>
              <span>照片 {{ img.id }}</span>
            </div>
            <span class="image-label">{{ img.label }}</span>
          </div>
          <div class="image-card video-card">
            <div class="image-placeholder video" style="background: var(--color-primary-bg)">
              <el-icon :size="32" style="color: var(--color-primary)"><VideoCamera /></el-icon>
              <span>现场视频</span>
            </div>
            <span class="image-label">通道现状视频</span>
          </div>
        </div>
      </div>
    </div>

    <!-- ============================================================ -->
    <!-- 整改信息 -->
    <!-- ============================================================ -->
    <div class="section-card">
      <div class="section-header"><h2 class="section-title">整改信息</h2></div>
      <div class="info-grid">
        <div class="info-item full-width">
          <span class="info-label">整改要求</span>
          <span class="info-value">{{ itemData.requirement }}</span>
        </div>
        <div class="info-item">
          <span class="info-label">整改期限</span>
          <span class="info-value deadline-value">
            {{ itemData.deadline }}
            <el-tag v-if="isOverdue" type="danger" size="small" effect="dark">已超期</el-tag>
            <el-tag v-else-if="itemData.remainDays === 0" type="warning" size="small" effect="dark">今日到期</el-tag>
          </span>
        </div>
        <div class="info-item">
          <span class="info-label">剩余/超期天数</span>
          <span class="info-value" :class="isOverdue ? 'text-danger' : itemData.remainDays === 0 ? 'text-warning' : ''">
            {{ isOverdue ? `超期 ${overdueDays} 天` : itemData.remainDays === 0 ? '今日到期' : `剩余 ${itemData.remainDays} 天` }}
          </span>
        </div>
        <div class="info-item">
          <span class="info-label">责任单位/企业</span>
          <span class="info-value">{{ itemData.unit }}</span>
        </div>
        <div class="info-item">
          <span class="info-label">整改负责人</span>
          <span class="info-value">{{ itemData.person }}</span>
        </div>
        <div class="info-item">
          <span class="info-label">联系方式</span>
          <span class="info-value">{{ itemData.phone }}</span>
        </div>
      </div>
    </div>

    <!-- ============================================================ -->
    <!-- 整改进度 -->
    <!-- ============================================================ -->
    <div class="section-card">
      <div class="section-header"><h2 class="section-title">整改进度</h2></div>
      <div class="timeline">
        <div
          v-for="(record, idx) in itemData.fixRecords"
          :key="idx"
          class="timeline-item"
          :class="{ 'timeline-fail': record.result === '不合格' }"
        >
          <div class="timeline-dot" :class="{ fail: record.result === '不合格' }"></div>
          <div class="timeline-content">
            <div class="timeline-time">{{ record.time }}</div>
            <div class="timeline-text">{{ record.content }}</div>
            <div class="timeline-meta">
              <span v-if="record.reviewer !== '—'" class="meta-item">
                <el-icon :size="14"><UserFilled /></el-icon>
                复核人：{{ record.reviewer }}
              </span>
              <span v-if="record.result !== '—'" class="meta-item" :class="{ 'result-fail': record.result === '不合格' }">
                复核结果：{{ record.result }}
              </span>
              <el-tag v-if="record.hasPhoto" size="small" type="info" effect="plain">含整改照片</el-tag>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ============================================================ -->
    <!-- 超期记录 & 催办历史 -->
    <!-- ============================================================ -->
    <div class="section-card">
      <div class="section-header">
        <h2 class="section-title">
          <el-icon :size="18"><Clock /></el-icon>
          超期记录 & 催办历史
        </h2>
        <span class="overdue-summary">累计超期 {{ overdueDays }} 天 · 催办 {{ itemData.urgeHistory.length }} 次</span>
      </div>
      <div class="urge-list">
        <div
          v-for="(urge, idx) in itemData.urgeHistory"
          :key="idx"
          class="urge-item"
        >
          <div class="urge-time">{{ urge.time }}</div>
          <div class="urge-body">
            <div class="urge-method">
              <el-icon :size="14" v-if="urge.method.includes('短信')"><Message /></el-icon>
              <el-icon :size="14" v-else><Phone /></el-icon>
              <span>{{ urge.method }}</span>
            </div>
            <div class="urge-receiver">接收人：{{ urge.receiver }}</div>
            <div class="urge-reply" :class="{ 'no-reply': urge.reply.includes('未回复') }">
              {{ urge.reply }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ============================================================ -->
    <!-- 操作按钮区 -->
    <!-- ============================================================ -->
    <div class="action-bar">
      <SysButton type="default" variant="outline" @click="handleReassign">
        重新派发
      </SysButton>
      <SysButton type="default" variant="outline" @click="handleExtend">
        延期申请
      </SysButton>
      <SysButton type="default" variant="outline" @click="handleExport">
        导出档案
      </SysButton>
      <el-dropdown trigger="click">
        <SysButton type="default" variant="outline">
          更多操作
          <el-icon class="el-icon--right"><ArrowDown /></el-icon>
        </SysButton>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="handleEscalate">
              <span class="dropdown-item--danger">强制督办</span>
            </el-dropdown-item>
            <el-dropdown-item @click="handleComplete">标记完成</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
      <SysButton type="primary" @click="handleUrge">
        一键催办
      </SysButton>
    </div>
  </div>
</template>

<script>
import { UserFilled } from '@element-plus/icons-vue'
export default {
  components: { UserFilled },
}
</script>


<style scoped>
.page-content {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-16);
}

.overdue-badge {
  display: flex;
  align-items: center;
  gap: var(--spacing-4);
  font-size: var(--font-size-small);
  font-weight: var(--font-weight-bold);
  color: var(--color-danger);
  background: var(--color-danger-bg);
  padding: var(--spacing-4) var(--spacing-12);
  border-radius: var(--radius-md);
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
}

.section-header .section-title {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  font-size: var(--font-size-h3);
  font-weight: var(--font-weight-medium);
  color: var(--text-primary);
  margin: 0 0 var(--spacing-sm) 0;
}

.section-header .section-title::before {
  content: '';
  display: inline-block;
  width: 3px;
  height: 1em;
  background: var(--color-primary);
  border-radius: 2px;
  flex-shrink: 0;
}

.overdue-summary {
  font-size: var(--font-size-xs);
  color: var(--text-muted);
}

/* ============================================================
 * 信息网格
 * ============================================================ */
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

.info-item.full-width {
  grid-column: 1 / -1;
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

.info-value.name {
  font-size: var(--font-size-body);
  font-weight: var(--font-weight-bold);
}

.info-value.deadline-value {
  display: flex;
  align-items: center;
  gap: var(--spacing-8);
}

.text-danger {
  color: var(--color-danger);
  font-weight: var(--font-weight-bold);
}

.text-warning {
  color: var(--color-warning);
  font-weight: var(--font-weight-bold);
}

/* ============================================================
 * 现场照片
 * ============================================================ */
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
  height: 120px;
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

/* ============================================================
 * 整改进度时间线
 * ============================================================ */
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

.timeline-dot.fail {
  background: var(--color-danger);
}

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

.timeline-meta {
  display: flex;
  align-items: center;
  gap: var(--spacing-12);
  flex-wrap: wrap;
}

.meta-item {
  font-size: var(--font-size-xs);
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
}

.result-fail {
  color: var(--color-danger);
  font-weight: var(--font-weight-bold);
}

.timeline-fail {
  /* marker styling handled by .timeline-dot.fail */
}

/* ============================================================
 * 催办历史
 * ============================================================ */
.urge-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-8);
}

.urge-item {
  display: flex;
  gap: var(--spacing-12);
  padding: var(--spacing-12);
  background: var(--fill-secondary);
  border-radius: var(--radius-md);
}

.urge-time {
  font-size: var(--font-size-xs);
  color: var(--text-muted);
  white-space: nowrap;
  min-width: 130px;
  padding-top: 2px;
}

.urge-body {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-4);
}

.urge-method {
  display: flex;
  align-items: center;
  gap: var(--spacing-4);
  font-size: var(--font-size-small);
  font-weight: var(--font-weight-medium);
  color: var(--text-primary);
}

.urge-receiver {
  font-size: var(--font-size-xs);
  color: var(--text-secondary);
}

.urge-reply {
  font-size: var(--font-size-xs);
  color: var(--color-success);
  font-weight: var(--font-weight-medium);
}

.urge-reply.no-reply {
  color: var(--text-muted);
}

/* ============================================================
 * 操作按钮区
 * ============================================================ */
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