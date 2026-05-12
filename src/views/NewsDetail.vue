<!--
  组件名称: NewsDetail
  用途: 通知详情页（详情/Profile 页类型），包含头部信息卡 + Tab 分组 + 字段网格
-->
<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  ArrowLeft, Edit, Delete, Clock, View, Check, Close, WarningFilled
} from '@element-plus/icons-vue'

const router = useRouter()
const route = useRoute()

// ==================== 加载状态 ====================
const pageLoading = ref(true)
setTimeout(() => { pageLoading.value = false }, 500)

// ==================== 通知详情数据 ====================
const noticeData = ref({
  id: 1,
  title: '关于做好防汛准备的通知',
  publishTime: '2026-05-10 09:30',
  publisher: '石楼镇应急管理办公室',
  deadline: '2026-05-17 18:00',
  content: `根据市气象局最新预报，今年汛期降雨量较往年偏多2-3成，防汛形势严峻。为确保辖区企业和居民安全度汛，现就有关事项通知如下：

一、严格落实防汛责任
各企业要立即成立防汛工作领导小组，明确第一责任人，制定防汛应急预案。辖区重点企业须在5月15日前将防汛责任人名单及联系方式上报镇应急办备案。

二、开展防汛隐患排查
请各企业对厂区排水系统、低洼地带、老旧厂房、地下车库等重点区域进行全面排查，发现隐患立即整改。建筑工地要重点检查深基坑、塔吊基础、临时围墙等部位。

三、做好防汛物资储备
各企业应提前储备沙袋、水泵、应急照明设备、救生衣等防汛物资，确保关键时刻拉得出、用得上。物资储备量应满足48小时应急需求。

四、严格执行值班制度
5月15日至9月30日期间，各企业必须严格执行24小时防汛值班制度，保持通讯畅通，发现险情第一时间报告镇应急办。

五、加强宣传培训
各企业要在5月底前完成防汛知识全员培训，做到人人掌握基本防汛技能和逃生知识。

请各单位高度重视，认真组织实施。镇应急办将于6月1日起开展防汛工作专项督查，对落实不到位的单位将严肃追责。`,
  category: '防汛应急',
  priority: 'high',
  tags: ['防汛', '安全生产', '应急管理'],
  targetCount: 35,
  readCount: 27,
  unreadCount: 8,
  readRate: 77.1,
  needFeedback: true,
  feedbackDeadline: '2026-05-14 18:00',
  feedbackCount: 21,
  feedbackRate: 60,
  attachments: [
    { name: '防汛应急预案模板.docx', size: '1.2MB' },
    { name: '防汛物资清单标准.pdf', size: '856KB' },
    { name: '防汛值班表.docx', size: '420KB' },
  ],
})

// ==================== Tab 配置 ====================
const activeTab = ref('info')

const tabs = [
  { name: 'info', label: '基本信息' },
  { name: 'readers', label: '阅读详情' },
  { name: 'feedback', label: '反馈跟踪' },
]

// ==================== 已读企业列表 ====================
const readerList = ref([
  { name: '宏达制造有限公司', contact: '张经理', phone: '138****6789', readTime: '2026-05-10 14:30', duration: '2分钟', needFeedback: true, hasFeedback: true, feedbackTime: '2026-05-11 10:00' },
  { name: '兴隆纺织集团', contact: '李主任', phone: '139****8901', readTime: '2026-05-10 15:00', duration: '1分钟', needFeedback: true, hasFeedback: true, feedbackTime: '2026-05-11 09:30' },
  { name: '永盛科技有限公司', contact: '王安全员', phone: '137****2345', readTime: '2026-05-10 16:20', duration: '5分钟', needFeedback: false, hasFeedback: false, feedbackTime: null },
  { name: '新欣食品加工', contact: '赵主管', phone: '136****3456', readTime: '2026-05-11 08:45', duration: '0分钟', needFeedback: true, hasFeedback: false, feedbackTime: null },
  { name: '宏远物流公司', contact: '钱经理', phone: '135****4567', readTime: '2026-05-11 10:00', duration: '1分钟', needFeedback: true, hasFeedback: false, feedbackTime: null },
])

// ==================== 未读企业列表 ====================
const unreadList = ref([
  { name: '德力机械厂', contact: '孙厂长', phone: '133****7890' },
  { name: '新东方建材', contact: '周经理', phone: '132****8901' },
  { name: '恒通电子', contact: '吴安全员', phone: '131****9012' },
  { name: '华东化工', contact: '郑主任', phone: '130****0123' },
])

// ==================== 反馈跟踪数据 ====================
const feedbackList = ref([
  { enterprise: '宏达制造有限公司', status: 'completed', content: '已完成防汛物资储备，已排查排水系统隐患，已成立防汛领导小组并制定应急预案。', feedbackTime: '2026-05-11 10:00', auditor: '陈科员', auditTime: '2026-05-11 14:00', auditResult: '通过', auditComment: '准备工作较充分，建议增加备用发电机。' },
  { enterprise: '兴隆纺织集团', status: 'completed', content: '已完成厂区排水沟清理，储备沙袋200个、水泵2台，已安排24小时值班人员。', feedbackTime: '2026-05-11 09:30', auditor: '陈科员', auditTime: '2026-05-11 14:30', auditResult: '通过', auditComment: '符合要求，请关注老旧厂房区域。' },
  { enterprise: '新欣食品加工', status: 'pending', content: null, feedbackTime: null, auditor: null, auditTime: null, auditResult: null, auditComment: null },
  { enterprise: '宏远物流公司', status: 'pending', content: null, feedbackTime: null, auditor: null, auditTime: null, auditResult: null, auditComment: null },
])

// ==================== 催办 ====================
const handleUrge = () => {
  ElMessageBox.confirm(
    `确认向未读的 ${noticeData.value.unreadCount} 家企业发送催办提醒？`,
    '一键催办',
    { confirmButtonText: '确认催办', cancelButtonText: '取消', type: 'warning' }
  ).then(() => {
    ElMessage.success(`已向 ${noticeData.value.unreadCount} 家企业发送催办提醒`)
  }).catch(() => {})
}

// ==================== 获取状态标签 ====================
const getStatusType = (status) => {
  if (status === 'completed') return 'success'
  return 'warning'
}

const getStatusText = (status) => {
  if (status === 'completed') return '已完成'
  return '待反馈'
}
</script>

<template>
  <div class="page-content">
    <!-- ==================== 加载骨架屏 ==================== -->
    <template v-if="pageLoading">
      <el-skeleton :rows="3" animated class="skeleton-section" />
      <el-skeleton :rows="6" animated class="skeleton-section" />
    </template>

    <template v-else>
      <!-- ==================== 顶部操作栏 ==================== -->
      <div class="top-actions">
        <el-button type="default" link @click="router.back()">
          <el-icon><ArrowLeft /></el-icon>
          返回列表
        </el-button>
        <div class="top-actions-right">
          <el-button type="primary" plain>
            <el-icon><Edit /></el-icon>
            编辑通知
          </el-button>
          <el-button type="danger" plain>
            <el-icon><Delete /></el-icon>
            删除
          </el-button>
        </div>
      </div>

      <!-- ==================== 头部信息卡 ==================== -->
      <div class="header-card">
        <div class="header-card-left">
          <div class="header-card-icon">
            <el-icon :size="28"><WarningFilled /></el-icon>
          </div>
          <div class="header-card-info">
            <h1 class="header-card-title">{{ noticeData.title }}</h1>
            <div class="header-card-meta">
              <span class="meta-item">
                <el-icon><Clock /></el-icon>
                {{ noticeData.publishTime }}
              </span>
              <span class="meta-divider">|</span>
              <span class="meta-item">发布人：{{ noticeData.publisher }}</span>
              <span class="meta-divider">|</span>
              <el-tag type="danger" size="small" effect="dark">高优先级</el-tag>
              <span class="meta-divider">|</span>
              <el-tag
                v-for="tag in noticeData.tags"
                :key="tag"
                size="small"
                effect="plain"
                class="meta-tag"
              >{{ tag }}</el-tag>
            </div>
          </div>
        </div>
        <div class="header-card-right">
          <div class="stat-item">
            <span class="stat-value stat-value--primary">{{ noticeData.targetCount }}</span>
            <span class="stat-label">目标企业</span>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-item">
            <span class="stat-value stat-value--success">{{ noticeData.readCount }}</span>
            <span class="stat-label">已读企业</span>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-item">
            <span class="stat-value stat-value--danger">{{ noticeData.unreadCount }}</span>
            <span class="stat-label">未读企业</span>
            <el-button type="danger" size="small" :disabled="noticeData.unreadCount === 0" @click="handleUrge" class="stat-urge-btn">
              催办
            </el-button>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-item">
            <span class="stat-value">77.1%</span>
            <span class="stat-label">整体已读率</span>
          </div>
        </div>
      </div>

      <!-- ==================== Tab 导航 ==================== -->
      <div class="tab-bar">
        <div
          v-for="tab in tabs"
          :key="tab.name"
          :class="['tab-item', { 'tab-item--active': activeTab === tab.name }]"
          @click="activeTab = tab.name"
        >
          {{ tab.label }}
        </div>
      </div>

      <div class="tab-content">
        <!-- ==================== 基本信息 Tab ==================== -->
        <div v-if="activeTab === 'info'" class="tab-pane">
          <!-- 基本信息字段网格（三列，label在上value在下） -->
          <div class="field-grid">
            <div class="field-item">
              <span class="field-label">通知标题</span>
              <span class="field-value">{{ noticeData.title }}</span>
            </div>
            <div class="field-item">
              <span class="field-label">发布日期</span>
              <span class="field-value">{{ noticeData.publishTime }}</span>
            </div>
            <div class="field-item">
              <span class="field-label">发布单位</span>
              <span class="field-value">{{ noticeData.publisher }}</span>
            </div>
            <div class="field-item">
              <span class="field-label">通知分类</span>
              <span class="field-value">
                <el-tag type="danger" size="small">{{ noticeData.category }}</el-tag>
              </span>
            </div>
            <div class="field-item">
              <span class="field-label">阅读截止时间</span>
              <span class="field-value">{{ noticeData.deadline }}</span>
            </div>
            <div class="field-item">
              <span class="field-label">目标企业数</span>
              <span class="field-value">{{ noticeData.targetCount }} 家</span>
            </div>
            <div class="field-item">
              <span class="field-label">要求反馈</span>
              <span class="field-value">
                <el-tag :type="noticeData.needFeedback ? 'warning' : 'info'" size="small">
                  {{ noticeData.needFeedback ? '是' : '否' }}
                </el-tag>
              </span>
            </div>
            <div class="field-item" v-if="noticeData.needFeedback">
              <span class="field-label">反馈截止时间</span>
              <span class="field-value">{{ noticeData.feedbackDeadline }}</span>
            </div>
            <div class="field-item" v-if="noticeData.needFeedback">
              <span class="field-label">反馈完成率</span>
              <span class="field-value">
                <span class="feedback-rate" :style="{ color: noticeData.feedbackRate >= 60 ? 'var(--color-success)' : 'var(--color-danger)' }">
                  {{ noticeData.feedbackRate }}% ({{ noticeData.feedbackCount }}/{{ noticeData.targetCount }})
                </span>
              </span>
            </div>
          </div>

          <!-- 正文内容 -->
          <div class="content-card">
            <h3 class="content-card-title">通知正文</h3>
            <div class="content-body">
              <p v-for="(line, idx) in noticeData.content.split('\n').filter(l => l.trim())" :key="idx" class="content-line">
                {{ line }}
              </p>
            </div>
          </div>

          <!-- 附件区 -->
          <div class="content-card">
            <h3 class="content-card-title">附件清单（{{ noticeData.attachments.length }}个）</h3>
            <div class="attachment-list">
              <div
                v-for="(file, idx) in noticeData.attachments"
                :key="idx"
                class="attachment-item"
              >
                <span class="attachment-name">{{ file.name }}</span>
                <span class="attachment-size">{{ file.size }}</span>
                <el-button type="primary" link size="small">下载</el-button>
              </div>
            </div>
          </div>
        </div>

        <!-- ==================== 阅读详情 Tab ==================== -->
        <div v-if="activeTab === 'readers'" class="tab-pane">
          <!-- 已读企业 -->
          <div class="content-card">
            <h3 class="content-card-title">
              已读企业（{{ readerList.length }}/{{ noticeData.targetCount }}）
            </h3>
            <el-empty v-if="readerList.length === 0" description="暂无已读企业" />
            <el-table v-else :data="readerList" stripe class="reader-table">
              <el-table-column prop="name" label="企业名称" min-width="160" />
              <el-table-column prop="contact" label="联系人" width="100" />
              <el-table-column prop="phone" label="联系电话" width="130" />
              <el-table-column prop="readTime" label="阅读时间" width="170" />
              <el-table-column prop="duration" label="停留时长" width="100" align="center" />
              <el-table-column prop="needFeedback" label="需反馈" width="80" align="center">
                <template #default="{ row }">
                  <el-icon v-if="row.needFeedback" color="var(--color-warning)"><WarningFilled /></el-icon>
                  <span v-else style="color: var(--text-muted)">-</span>
                </template>
              </el-table-column>
              <el-table-column prop="hasFeedback" label="反馈状态" width="120" align="center">
                <template #default="{ row }">
                  <template v-if="!row.needFeedback">
                    <span style="color: var(--text-muted)">-</span>
                  </template>
                  <template v-else>
                    <el-tag
                      :type="row.hasFeedback ? 'success' : 'warning'"
                      size="small"
                      effect="plain"
                    >
                      <el-icon v-if="row.hasFeedback" :size="12"><Check /></el-icon>
                      <el-icon v-else :size="12"><Close /></el-icon>
                      {{ row.hasFeedback ? '已反馈' : '待反馈' }}
                    </el-tag>
                  </template>
                </template>
              </el-table-column>
              <el-table-column prop="feedbackTime" label="反馈时间" width="170" />
            </el-table>
          </div>

          <!-- 未读企业 -->
          <div class="content-card">
            <h3 class="content-card-title">
              未读企业（{{ unreadList.length }}/{{ noticeData.targetCount }}）
            </h3>
            <el-empty v-if="unreadList.length === 0" description="全部企业已读" />
            <div v-else class="unread-grid">
              <div
                v-for="item in unreadList"
                :key="item.name"
                class="unread-item"
              >
                <div class="unread-item-avatar">{{ item.name.charAt(0) }}</div>
                <div class="unread-item-info">
                  <span class="unread-item-name">{{ item.name }}</span>
                  <span class="unread-item-contact">{{ item.contact }} · {{ item.phone }}</span>
                </div>
                <el-tag type="danger" size="small" effect="plain">未读</el-tag>
              </div>
            </div>
          </div>
        </div>

        <!-- ==================== 反馈跟踪 Tab ==================== -->
        <div v-if="activeTab === 'feedback'" class="tab-pane">
          <div class="content-card">
            <h3 class="content-card-title">反馈跟踪明细</h3>
            <el-empty v-if="feedbackList.length === 0" description="暂无反馈数据" />
            <el-table v-else :data="feedbackList" stripe class="feedback-table">
              <el-table-column prop="enterprise" label="企业名称" min-width="150" />
              <el-table-column prop="status" label="反馈状态" width="100" align="center">
                <template #default="{ row }">
                  <el-tag
                    :type="getStatusType(row.status)"
                    size="small"
                    effect="plain"
                  >
                    {{ getStatusText(row.status) }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="content" label="反馈内容" min-width="250" show-overflow-tooltip>
                <template #default="{ row }">
                  <span v-if="row.content">{{ row.content }}</span>
                  <span v-else style="color: var(--text-muted)">-</span>
                </template>
              </el-table-column>
              <el-table-column prop="feedbackTime" label="反馈时间" width="170" />
              <el-table-column prop="auditor" label="审核人" width="100" />
              <el-table-column prop="auditResult" label="审核结果" width="100" align="center">
                <template #default="{ row }">
                  <template v-if="row.auditResult">
                    <el-tag
                      :type="row.auditResult === '通过' ? 'success' : 'warning'"
                      size="small"
                      effect="plain"
                    >
                      {{ row.auditResult }}
                    </el-tag>
                  </template>
                  <span v-else style="color: var(--text-muted)">-</span>
                </template>
              </el-table-column>
              <el-table-column prop="auditComment" label="审核意见" min-width="200" show-overflow-tooltip />
            </el-table>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>

/* ==================== 骨架屏 ==================== */
.skeleton-section {
  margin-bottom: var(--spacing-lg);
  padding: var(--spacing-lg);
  background: var(--fill-surface);
  border-radius: var(--radius-lg);
}

/* ==================== 顶部操作栏 ==================== */
.top-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-md);
}

.top-actions-right {
  display: flex;
  gap: var(--spacing-sm);
}

/* ==================== 头部信息卡 ==================== */
.header-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: var(--fill-surface);
  border-radius: var(--radius-lg);
  border: 1px solid var(--border-default);
  padding: var(--spacing-lg);
  margin-bottom: var(--spacing-lg);
  flex-wrap: wrap;
  gap: var(--spacing-md);
}

.header-card-left {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  flex: 1;
  min-width: 300px;
}

.header-card-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  border-radius: var(--radius-lg);
  background: var(--color-danger-bg);
  color: var(--color-danger);
  flex-shrink: 0;
}

.header-card-info {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-8);
}

.header-card-title {
  font-size: var(--font-size-h2);
  font-weight: var(--font-weight-bold);
  color: var(--text-primary);
  margin: 0;
  line-height: 1.4;
}

.header-card-meta {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--spacing-8);
  font-size: var(--font-size-small);
  color: var(--text-muted);
}

.meta-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-4);
}

.meta-divider {
  color: var(--border-primary);
  font-size: var(--font-size-xs);
}

.meta-tag {
  margin-left: 0;
}

/* 右侧统计数字 */
.header-card-right {
  display: flex;
  align-items: center;
  gap: var(--spacing-lg);
  padding: var(--spacing-md) var(--spacing-lg);
  background: var(--fill-secondary);
  border-radius: var(--radius-md);
  flex-shrink: 0;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-4);
  min-width: 80px;
}

.stat-value {
  font-size: var(--font-size-h2);
  font-weight: var(--font-weight-bold);
  color: var(--text-primary);
}

.stat-value--primary { color: var(--color-primary); }
.stat-value--success { color: var(--color-success); }
.stat-value--danger { color: var(--color-danger); }

.stat-label {
  font-size: var(--font-size-xs);
  color: var(--text-muted);
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-4);
}

.stat-urge-btn {
  font-size: var(--font-size-xs);
}

.stat-divider {
  width: 1px;
  height: 48px;
  background: var(--border-default);
}

/* ==================== Tab 导航 ==================== */
.tab-bar {
  display: flex;
  gap: 0;
  border-bottom: 2px solid var(--border-default);
  margin-bottom: var(--spacing-lg);
}

.tab-item {
  padding: var(--spacing-md) var(--spacing-lg);
  font-size: var(--font-size-body);
  font-weight: var(--font-weight-medium);
  color: var(--text-muted);
  cursor: pointer;
  border-bottom: 2px solid transparent;
  margin-bottom: -2px;
  transition: color 0.2s, border-color 0.2s;
}

.tab-item:hover {
  color: var(--text-primary);
}

.tab-item--active {
  color: var(--color-primary);
  border-bottom-color: var(--color-primary);
}

/* ==================== 字段网格 ==================== */
.tab-content {
  min-height: 400px;
}

.tab-pane {
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(4px); }
  to { opacity: 1; transform: translateY(0); }
}

.field-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--spacing-lg);
  padding: var(--spacing-lg);
  background: var(--fill-surface);
  border-radius: var(--radius-lg);
  border: 1px solid var(--border-default);
  margin-bottom: var(--spacing-lg);
}

.field-item {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-4);
}

.field-label {
  font-size: var(--font-size-xs);
  color: var(--text-muted);
  font-weight: var(--font-weight-medium);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.field-value {
  font-size: var(--font-size-body);
  color: var(--text-primary);
  font-weight: var(--font-weight-medium);
}

.feedback-rate {
  font-weight: var(--font-weight-bold);
}

/* ==================== 内容卡片（关联信息用背景色小卡片） ==================== */
.content-card {
  background: var(--fill-secondary);
  border-radius: var(--radius-lg);
  border: 1px solid var(--border-low);
  padding: var(--spacing-lg);
  margin-bottom: var(--spacing-lg);
}

.content-card-title {
  font-size: var(--font-size-body);
  font-weight: var(--font-weight-bold);
  color: var(--text-primary);
  margin: 0 0 var(--spacing-md) 0;
}

/* 正文 */
.content-body {
  font-size: var(--font-size-body);
  color: var(--text-secondary);
  line-height: 1.8;
}

.content-line {
  margin-bottom: var(--spacing-8);
  text-indent: 2em;
}

/* 附件 */
.attachment-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.attachment-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-sm) var(--spacing-md);
  background: var(--fill-surface);
  border-radius: var(--radius-md);
  border: 1px solid var(--border-low);
}

.attachment-name {
  flex: 1;
  font-size: var(--font-size-small);
  color: var(--text-primary);
}

.attachment-size {
  font-size: var(--font-size-xs);
  color: var(--text-muted);
}

/* 表格 */
.reader-table,
.feedback-table {
  border-radius: var(--radius-md);
  overflow: hidden;
}

.reader-table :deep(.el-table__header th),
.feedback-table :deep(.el-table__header th) {
  background: var(--fill-surface);
  color: var(--text-primary);
  font-weight: var(--font-weight-medium);
}

/* 未读企业网格 */
.unread-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--spacing-md);
}

.unread-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-md);
  background: var(--fill-surface);
  border-radius: var(--radius-md);
  border: 1px solid var(--border-low);
  transition: box-shadow 0.2s;
}

.unread-item:hover {
  box-shadow: var(--shadow-sm);
}

.unread-item-avatar {
  width: 40px;
  height: 40px;
  border-radius: var(--radius-round);
  background: var(--color-danger-bg);
  color: var(--color-danger);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--font-size-body);
  font-weight: var(--font-weight-bold);
  flex-shrink: 0;
}

.unread-item-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2);
  min-width: 0;
}

.unread-item-name {
  font-size: var(--font-size-small);
  font-weight: var(--font-weight-medium);
  color: var(--text-primary);
}

.unread-item-contact {
  font-size: var(--font-size-xs);
  color: var(--text-muted);
}

/* 响应式 */
@media (max-width: 768px) {
  .field-grid {
    grid-template-columns: 1fr;
  }

  .header-card-right {
    flex-wrap: wrap;
    justify-content: center;
    width: 100%;
  }

  .stat-divider {
    display: none;
  }

  .unread-grid {
    grid-template-columns: 1fr;
  }
}
</style>