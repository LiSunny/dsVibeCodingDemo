<!--
  组件名称: NewsDetail
  用途: 模块1 - 单条通知明细页，展示通知全文、目标企业列表及已读/反馈状态
-->
<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'

const route = useRoute()
const router = useRouter()

const noticeId = computed(() => route.params.id)

// ==================== 通知数据 ====================
const noticeDataMap = {
  1: {
    id: 1,
    title: '关于做好防汛准备的通知',
    publishTime: '2026-05-10 09:00',
    publisher: '应急办',
    content: '各企业请注意，根据气象预报，5月15-17日将有强降雨，请提前做好防汛物资储备、排水系统检查，确保厂房、仓库排水畅通，做好低洼区域设备转移预案。请各企业负责人高度重视，并于5月12日前完成自查并反馈情况。',
    attachments: [{ name: '防汛检查表.xlsx', size: '256KB' }],
    targetCount: 35,
    readCount: 27,
    unreadCount: 8,
    needFeedback: true,
  },
  2: {
    id: 2,
    title: '2025年企业安全责任书签署',
    publishTime: '2026-05-09 14:30',
    publisher: '安监站',
    content: '根据安全生产法要求，各企业需签署2025年度安全生产责任书，明确企业主体责任。请各企业在5月20日前完成签署并回传至安监站备案。逾期未签署的企业将纳入重点监管名单。',
    attachments: [{ name: '2025安全责任书模板.pdf', size: '1.2MB' }],
    targetCount: 42,
    readCount: 37,
    unreadCount: 5,
    needFeedback: false,
  },
  3: {
    id: 3,
    title: '石楼镇消防安全自查通知',
    publishTime: '2026-05-08 10:15',
    publisher: '消防救援',
    content: '为落实消防安全责任制，请各企业于5月25日前完成消防安全自查。重点检查：1）消防通道是否畅通；2）灭火器材是否在有效期内；3）电气线路是否存在老化；4）员工消防安全培训是否到位。自查完成后请填写消防安全自查报告表并提交。',
    attachments: [
      { name: '消防安全自查报告表.docx', size: '180KB' },
      { name: '消防器材检查标准.pdf', size: '420KB' },
    ],
    targetCount: 50,
    readCount: 42,
    unreadCount: 8,
    needFeedback: true,
  },
  4: {
    id: 4,
    title: '关于开展安全生产月活动的通知',
    publishTime: '2026-05-07 08:45',
    publisher: '安监站',
    content: '6月为全国安全生产月，请各企业提前策划安全月活动方案，包括但不限于：安全知识竞赛、应急逃生演练、安全隐患排查等。活动方案请于5月25日前报安监站备案。',
    attachments: [{ name: '安全生产月活动指南.pdf', size: '890KB' }],
    targetCount: 38,
    readCount: 30,
    unreadCount: 8,
    needFeedback: true,
  },
  5: {
    id: 5,
    title: '关于环保检查整改要求的通知',
    publishTime: '2026-05-05 16:00',
    publisher: '环保办',
    content: '近期环保督察组将对辖区内企业进行抽查，请各企业对照环保标准进行自查自纠，重点整改废水、废气、固废处理不合规问题。',
    attachments: [],
    targetCount: 30,
    readCount: 28,
    unreadCount: 2,
    needFeedback: false,
  },
}

// 默认数据模板
const defaultNotice = {
  title: '通知详情',
  publishTime: '-',
  publisher: '-',
  content: '暂无通知内容',
  attachments: [],
  targetCount: 0,
  readCount: 0,
  unreadCount: 0,
  needFeedback: false,
}

const notice = computed(() => {
  return noticeDataMap[noticeId.value] || defaultNotice
})

// ==================== 目标企业列表 ====================
const enterpriseList = ref([
  { name: '宏达制造', isRead: true, readTime: '2026-05-10 14:23', hasFeedback: true, feedbackContent: '已储备沙袋50个，抽水泵2台' },
  { name: '兴隆纺织', isRead: true, readTime: '2026-05-11 09:05', hasFeedback: false, feedbackContent: '-' },
  { name: '永盛科技', isRead: true, readTime: '2026-05-10 16:40', hasFeedback: true, feedbackContent: '已完成防汛检查，排水系统正常' },
  { name: '新欣食品', isRead: false, readTime: '-', hasFeedback: false, feedbackContent: '-' },
  { name: '宏远物流', isRead: false, readTime: '-', hasFeedback: false, feedbackContent: '-' },
  { name: '德力机械', isRead: true, readTime: '2026-05-10 15:12', hasFeedback: false, feedbackContent: '-' },
  { name: '华鑫电子', isRead: true, readTime: '2026-05-11 08:30', hasFeedback: true, feedbackContent: '防汛物资已就位' },
  { name: '广达包装', isRead: false, readTime: '-', hasFeedback: false, feedbackContent: '-' },
  { name: '瑞丰化工', isRead: true, readTime: '2026-05-10 17:55', hasFeedback: false, feedbackContent: '-' },
  { name: '天宇建材', isRead: false, readTime: '-', hasFeedback: false, feedbackContent: '-' },
  { name: '明达印刷', isRead: true, readTime: '2026-05-11 07:20', hasFeedback: true, feedbackContent: '排水泵已测试正常' },
  { name: '鑫源制造', isRead: true, readTime: '2026-05-10 11:10', hasFeedback: false, feedbackContent: '-' },
  { name: '长盛商贸', isRead: false, readTime: '-', hasFeedback: false, feedbackContent: '-' },
  { name: '恒通运输', isRead: false, readTime: '-', hasFeedback: false, feedbackContent: '-' },
  { name: '佳美服装', isRead: true, readTime: '2026-05-10 14:50', hasFeedback: true, feedbackContent: '防汛沙袋已准备就绪' },
])

const unreadEnterprises = computed(() => enterpriseList.value.filter(e => !e.isRead))
const readUnFeedbackEnterprises = computed(() => enterpriseList.value.filter(e => e.isRead && notice.value.needFeedback && !e.hasFeedback))
const readRate = computed(() => {
  if (enterpriseList.value.length === 0) return 0
  return Math.round((enterpriseList.value.filter(e => e.isRead).length / enterpriseList.value.length) * 100)
})

// 批量催办（未读企业）
const handleBatchUrgeUnread = () => {
  const names = unreadEnterprises.value.map(e => e.name).join('、')
  ElMessageBox.confirm(
    `确认向以下 ${unreadEnterprises.value.length} 家未读企业发送催办提醒？\n\n${names}`,
    '批量催办',
    { confirmButtonText: '确认催办', cancelButtonText: '取消', type: 'warning' }
  ).then(() => {
    ElMessage.success(`已向 ${unreadEnterprises.value.length} 家未读企业发送催办提醒`)
  }).catch(() => {})
}

// 批量提醒填写反馈
const handleBatchRemindFeedback = () => {
  const names = readUnFeedbackEnterprises.value.map(e => e.name).join('、')
  ElMessageBox.confirm(
    `确认提醒以下 ${readUnFeedbackEnterprises.value.length} 家企业填写反馈？\n\n${names}`,
    '批量提醒填写反馈',
    { confirmButtonText: '确认提醒', cancelButtonText: '取消', type: 'warning' }
  ).then(() => {
    ElMessage.success(`已向 ${readUnFeedbackEnterprises.value.length} 家企业发送填写反馈提醒`)
  }).catch(() => {})
}

// 单个催办
const handleSingleUrge = (enterprise) => {
  ElMessageBox.confirm(
    `确认向"${enterprise.name}"发送催办提醒？`,
    '催办提醒',
    { confirmButtonText: '确认', cancelButtonText: '取消', type: 'warning' }
  ).then(() => {
    ElMessage.success(`已向"${enterprise.name}"发送催办提醒`)
  }).catch(() => {})
}

// 导出Excel
const handleExport = () => {
  ElMessage.success('导出功能开发中，即将支持导出为Excel格式')
}

// 返回
const goBack = () => {
  router.push('/news')
}

// 已读率颜色
const getRateColor = (rate) => {
  if (rate >= 90) return 'var(--color-success)'
  if (rate >= 70) return 'var(--color-warning)'
  return 'var(--color-danger)'
}
</script>

<template>
  <div class="news-detail">
    <!-- 顶部导航 -->
    <div class="detail-header">
      <el-button type="default" @click="goBack">
        <el-icon><ArrowLeft /></el-icon>
        返回通知列表
      </el-button>
      <span class="detail-header-divider">|</span>
      <span class="detail-header-title">通知明细</span>
    </div>

    <!-- 通知全文 -->
    <div class="detail-section">
      <h3 class="section-title">
        <el-icon><Document /></el-icon>
        通知全文
      </h3>
      <div class="notice-content-card">
        <h2 class="notice-title">{{ notice.title }}</h2>
        <div class="notice-meta">
          <span class="notice-meta-item">
            <el-tag type="info" size="small" effect="plain">发布人</el-tag>
            {{ notice.publisher }}
          </span>
          <span class="notice-meta-item">
            <el-tag type="info" size="small" effect="plain">发布时间</el-tag>
            {{ notice.publishTime }}
          </span>
          <span class="notice-meta-item">
            <el-tag type="info" size="small" effect="plain">目标企业</el-tag>
            {{ notice.targetCount }} 家
          </span>
        </div>
        <div class="notice-body">
          {{ notice.content }}
        </div>

        <!-- 附件 -->
        <div v-if="notice.attachments.length > 0" class="notice-attachments">
          <div class="attachments-label">附件：</div>
          <div
            v-for="att in notice.attachments"
            :key="att.name"
            class="attachment-item"
          >
            <el-icon><Paperclip /></el-icon>
            <span class="attachment-name">{{ att.name }}</span>
            <span class="attachment-size">({{ att.size }})</span>
            <el-button type="primary" link size="small">下载</el-button>
          </div>
        </div>
      </div>
    </div>

    <!-- 阅读状态概览 -->
    <div class="detail-section">
      <el-row :gutter="16" class="read-stats-row">
        <el-col :span="6">
          <div class="read-stat-card">
            <div class="read-stat-value">{{ notice.targetCount }}</div>
            <div class="read-stat-label">目标企业总数</div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="read-stat-card read-stat-card--success">
            <div class="read-stat-value">{{ notice.readCount }}</div>
            <div class="read-stat-label">已读企业数</div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="read-stat-card read-stat-card--danger">
            <div class="read-stat-value">{{ notice.unreadCount }}</div>
            <div class="read-stat-label">未读企业数</div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="read-stat-card read-stat-card--warning">
            <div class="read-stat-value" :style="{ color: getRateColor(readRate) }">{{ readRate }}%</div>
            <div class="read-stat-label">已读率</div>
          </div>
        </el-col>
      </el-row>
    </div>

    <!-- 目标企业列表 -->
    <div class="detail-section">
      <div class="section-header">
        <h3 class="section-title">
          <el-icon><List /></el-icon>
          目标企业列表
        </h3>
        <div class="section-header-actions">
          <el-button type="primary" @click="handleExport">
            <el-icon><Download /></el-icon>
            导出Excel
          </el-button>
        </div>
      </div>

      <el-table
        :data="enterpriseList"
        stripe
        class="enterprise-table"
      >
        <el-table-column prop="name" label="企业名称" min-width="140" />
        <el-table-column prop="isRead" label="是否已读" width="100" align="center">
          <template #default="{ row }">
            <el-tag
              :type="row.isRead ? 'success' : 'danger'"
              size="small"
              effect="plain"
            >
              {{ row.isRead ? '已读' : '未读' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="readTime" label="已读时间" width="180" align="center">
          <template #default="{ row }">
            <span :class="{ 'text-muted': row.readTime === '-' }">{{ row.readTime }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="hasFeedback" label="是否填写反馈" width="120" align="center">
          <template #default="{ row }">
            <template v-if="!notice.needFeedback">
              <span class="text-muted">-</span>
            </template>
            <template v-else>
              <el-tag
                :type="row.hasFeedback ? 'success' : 'warning'"
                size="small"
                effect="plain"
              >
                {{ row.hasFeedback ? '已反馈' : '未反馈' }}
              </el-tag>
            </template>
          </template>
        </el-table-column>
        <el-table-column prop="feedbackContent" label="反馈内容" min-width="200" show-overflow-tooltip>
          <template #default="{ row }">
            <span v-if="row.hasFeedback">{{ row.feedbackContent }}</span>
            <span v-else class="text-muted">-</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100" fixed="right" align="center">
          <template #default="{ row }">
            <el-button
              v-if="!row.isRead"
              type="danger"
              link
              size="small"
              @click="handleSingleUrge(row)"
            >
              催办
            </el-button>
            <el-button
              v-else-if="notice.needFeedback && !row.hasFeedback"
              type="warning"
              link
              size="small"
              @click="handleSingleUrge(row)"
            >
              提醒填写
            </el-button>
            <span v-else class="text-muted">-</span>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 未读企业清单 -->
    <div v-if="unreadEnterprises.length > 0" class="detail-section">
      <div class="section-header">
        <h3 class="section-title section-title--danger">
          <el-icon><WarningFilled /></el-icon>
          未读企业清单（{{ unreadEnterprises.length }}家）
        </h3>
        <el-button type="danger" @click="handleBatchUrgeUnread">
          批量催办
        </el-button>
      </div>
      <div class="enterprise-tag-list">
        <el-tag
          v-for="ent in unreadEnterprises"
          :key="ent.name"
          type="danger"
          size="large"
          effect="plain"
          class="enterprise-tag"
        >
          {{ ent.name }}
        </el-tag>
      </div>
    </div>

    <!-- 已读未反馈企业清单 -->
    <div v-if="notice.needFeedback && readUnFeedbackEnterprises.length > 0" class="detail-section">
      <div class="section-header">
        <h3 class="section-title section-title--warning">
          <el-icon><Bell /></el-icon>
          已读未反馈企业清单（{{ readUnFeedbackEnterprises.length }}家）
        </h3>
        <el-button type="warning" @click="handleBatchRemindFeedback">
          批量提醒填写
        </el-button>
      </div>
      <div class="enterprise-tag-list">
        <el-tag
          v-for="ent in readUnFeedbackEnterprises"
          :key="ent.name"
          type="warning"
          size="large"
          effect="plain"
          class="enterprise-tag"
        >
          {{ ent.name }}
        </el-tag>
      </div>
    </div>
  </div>
</template>

<style scoped>
.news-detail {
  padding: var(--spacing-lg);
  background: var(--fill-page);
  min-height: 100%;
}

/* ==================== 顶部导航 ==================== */
.detail-header {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-lg);
  padding: var(--spacing-md) var(--spacing-lg);
  background: var(--fill-surface);
  border-radius: var(--radius-md);
  border: 1px solid var(--border-default);
}

.detail-header-divider {
  color: var(--border-primary);
}

.detail-header-title {
  font-size: var(--font-size-body);
  font-weight: var(--font-weight-medium);
  color: var(--text-secondary);
}

/* ==================== Section 通用 ==================== */
.detail-section {
  margin-bottom: var(--spacing-lg);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-md);
}

.section-header-actions {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.section-title {
  font-size: var(--font-size-h3);
  font-weight: var(--font-weight-bold);
  color: var(--text-primary);
  margin: 0 0 var(--spacing-md) 0;
  padding-left: var(--spacing-md);
  border-left: 4px solid var(--color-primary);
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.section-title--danger {
  border-left-color: var(--color-danger);
}

.section-title--warning {
  border-left-color: var(--color-warning);
}

/* ==================== 通知全文卡片 ==================== */
.notice-content-card {
  background: var(--fill-surface);
  border-radius: var(--radius-lg);
  border: 1px solid var(--border-default);
  padding: var(--spacing-lg);
}

.notice-title {
  font-size: var(--font-size-h1);
  font-weight: var(--font-weight-bold);
  color: var(--text-primary);
  margin: 0 0 var(--spacing-md) 0;
}

.notice-meta {
  display: flex;
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-lg);
  padding-bottom: var(--spacing-md);
  border-bottom: 1px solid var(--border-low);
}

.notice-meta-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  font-size: var(--font-size-small);
  color: var(--text-secondary);
}

.notice-body {
  font-size: var(--font-size-body);
  color: var(--text-primary);
  line-height: 1.8;
  margin-bottom: var(--spacing-lg);
}

/* 附件 */
.notice-attachments {
  padding-top: var(--spacing-md);
  border-top: 1px solid var(--border-low);
}

.attachments-label {
  font-size: var(--font-size-small);
  font-weight: var(--font-weight-medium);
  color: var(--text-secondary);
  margin-bottom: var(--spacing-sm);
}

.attachment-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm) var(--spacing-md);
  background: var(--fill-secondary);
  border-radius: var(--radius-sm);
  margin-bottom: var(--spacing-sm);
}

.attachment-item:last-child {
  margin-bottom: 0;
}

.attachment-name {
  font-size: var(--font-size-small);
  color: var(--color-primary);
}

.attachment-size {
  font-size: var(--font-size-xs);
  color: var(--text-muted);
}

/* ==================== 阅读统计 ==================== */
.read-stats-row {
  margin-bottom: 0;
}

.read-stat-card {
  background: var(--fill-surface);
  border-radius: var(--radius-lg);
  border: 1px solid var(--border-default);
  padding: var(--spacing-lg);
  text-align: center;
}

.read-stat-card--success {
  border-color: var(--color-success-border);
  background: var(--color-success-bg);
}

.read-stat-card--danger {
  border-color: var(--color-danger-border);
  background: var(--color-danger-bg);
}

.read-stat-card--warning {
  border-color: var(--color-warning-border);
  background: var(--color-warning-bg);
}

.read-stat-value {
  font-size: var(--font-size-h1);
  font-weight: var(--font-weight-heavy);
  color: var(--text-primary);
  line-height: 1.2;
}

.read-stat-label {
  font-size: var(--font-size-small);
  color: var(--text-muted);
  margin-top: var(--spacing-4);
}

/* ==================== 企业表格 ==================== */
.enterprise-table {
  border-radius: var(--radius-lg);
  overflow: hidden;
}

.enterprise-table :deep(.el-table__header th) {
  background: var(--fill-secondary);
  color: var(--text-primary);
  font-weight: var(--font-weight-medium);
}

.text-muted {
  color: var(--text-muted);
}

/* ==================== 企业标签列表 ==================== */
.enterprise-tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
  padding: var(--spacing-md);
  background: var(--fill-surface);
  border-radius: var(--radius-md);
  border: 1px solid var(--border-default);
}

.enterprise-tag {
  font-size: var(--font-size-small);
}
</style>