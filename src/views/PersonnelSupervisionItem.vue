<!--
  组件名称: PersonnelSupervisionItem
  用途: 模块4 - 重点人员联勤人员档案及走访明细页
-->
<script setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { User, Phone, Calendar, Clock, Warning, Edit, Bell, Download, Plus } from '@element-plus/icons-vue'
import SysButton from '@/components/SysButton.vue'
import SysTag from '@/components/SysTag.vue'
import PageHeader from '@/components/PageHeader.vue'

const router = useRouter()
const route = useRoute()

// ==================== 加载状态 ====================
const pageLoading = ref(true)
setTimeout(() => { pageLoading.value = false }, 500)

// ============================================================
// 人员档案数据（示例 - 按文档3.3节）
// ============================================================
const itemId = computed(() => Number(route.params.id) || 1)

const itemData = ref({
  id: itemId.value,
  name: '张德福',
  gender: '男',
  idCard: '44010619520315****',
  birthDate: '1952-03-15',
  age: 74,
  type: '独居老人',
  address: '石楼村第三组45号',
  community: '石楼村',
  emergencyContact: '张小林（儿子）',
  emergencyRelation: '父子',
  emergencyPhone: '138****1234',
  remark: '患有高血压，需定期服药，行动不便，生活基本自理',
  // 走访计划配置
  visitCycle: '每周',
  lastPlanDate: '2026-05-09',
  nextVisitDate: '2026-05-16',
  assignee: '网格员A',
  // 走访记录（按时间倒序）
  visitRecords: [
    {
      id: 1,
      planDate: '2026-05-09',
      actualDate: null,
      visitor: '网格员A',
      clockTime: null,
      content: null,
      photos: [],
      isMissed: true,
      missedReason: '任务过多，网格员临时调整',
    },
    {
      id: 2,
      planDate: '2026-05-02',
      actualDate: '2026-05-02',
      visitor: '网格员A',
      clockTime: '09:30:00',
      content: '老人身体状况良好，血压稳定（145/92），已提醒按时服药。室内整洁，无安全隐患。',
      photos: [],
      isMissed: false,
      missedReason: null,
    },
    {
      id: 3,
      planDate: '2026-04-25',
      actualDate: '2026-04-25',
      visitor: '网格员A',
      clockTime: '10:15:00',
      content: '探访时老人正在院子里晒太阳，精神状态良好。提醒保持联系，有异常及时报告。',
      photos: [],
      isMissed: false,
      missedReason: null,
    },
    {
      id: 4,
      planDate: '2026-04-18',
      actualDate: '2026-04-18',
      visitor: '网格员A',
      clockTime: '14:00:00',
      content: '老人反映近期有些头晕，已建议到医院检查。后回访已就诊，无大碍。',
      photos: [],
      isMissed: false,
      missedReason: null,
    },
    {
      id: 5,
      planDate: '2026-04-11',
      actualDate: '2026-04-11',
      visitor: '网格员B',
      clockTime: '16:30:00',
      content: '常规探访，老人表示生活正常。协助打扫院落，整理杂物。',
      photos: [],
      isMissed: false,
      missedReason: null,
    },
  ],
  // 漏访预警记录
  missedWarnings: [
    {
      id: 1,
      missedDate: '2026-05-09',
      warningTime: '2026-05-09 18:00:00',
      notifyMethod: '系统短信',
      result: '网格员已接收，因任务冲突需延期处理',
    },
  ],
})

// 获取人员类型标签颜色
const getTypeTagType = (type) => {
  if (type === '独居老人') return 'warning'
  if (type === '残障') return 'info'
  if (type === '涉稳') return 'danger'
  if (type === '刑满释放') return 'primary'
  return 'default'
}

// 获取走访状态
const getStatusType = (isMissed) => {
  return isMissed ? 'danger' : 'success'
}

const getStatusText = (isMissed) => {
  return isMissed ? '漏访' : '已走访'
}

// ============================================================
// 操作
// ============================================================
const handleEditProfile = () => {
  ElMessage.info('打开人员档案编辑表单')
}

const handleDispatchTask = () => {
  ElMessage.success('打开走访任务制定表单')
}

const handleManualRecord = () => {
  ElMessage.info('打开手动补录走访表单')
}

const handleExport = () => {
  ElMessage.success('正在导出人员档案为PDF/Excel...')
}

const goBack = () => {
  router.push('/personnel-supervision/detail')
}
</script>

<template>
  <div class="page-content">
    <!-- ============================================================ -->
    <!-- 页面标题栏 -->
    <!-- ============================================================ -->
    <PageHeader
      title="人员档案详情"
      show-back
      back-text="返回列表"
      back-path="/personnel-supervision/detail"
    >
      <template #extra>
        <SysTag :type="getTypeTagType(itemData.type)" size="small" variant="solid">
          {{ itemData.type }}
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
      <!-- 人员基本信息 -->
      <!-- ============================================================ -->
      <div class="section-card">
        <div class="section-header">
          <h2 class="section-title">
            <el-icon :size="18"><User /></el-icon>
            人员基本信息
          </h2>
        </div>
        <div class="info-grid">
          <div class="info-item">
            <span class="info-label">姓名</span>
            <span class="info-value">{{ itemData.name }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">性别</span>
            <span class="info-value">{{ itemData.gender }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">身份证号</span>
            <span class="info-value code">{{ itemData.idCard }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">出生日期</span>
            <span class="info-value">{{ itemData.birthDate }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">年龄</span>
            <span class="info-value">{{ itemData.age }}岁</span>
          </div>
          <div class="info-item">
            <span class="info-label">人员类型</span>
            <span class="info-value">
              <SysTag :type="getTypeTagType(itemData.type)" size="small">
                {{ itemData.type }}
              </SysTag>
            </span>
          </div>
          <div class="info-item info-item--wide">
            <span class="info-label">居住地址</span>
            <span class="info-value">{{ itemData.address }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">所属村/社区</span>
            <span class="info-value">{{ itemData.community }}</span>
          </div>
        </div>

        <!-- 应急联系信息 -->
        <div class="info-divider">
          <span class="info-divider-text">应急联系信息</span>
        </div>
        <div class="info-grid">
          <div class="info-item">
            <span class="info-label">联系人姓名</span>
            <span class="info-value">{{ itemData.emergencyContact }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">关系</span>
            <span class="info-value">{{ itemData.emergencyRelation }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">联系电话</span>
            <span class="info-value">
              <el-icon :size="14" style="margin-right: 4px; vertical-align: middle; color: var(--color-primary)"><Phone /></el-icon>
              {{ itemData.emergencyPhone }}
            </span>
          </div>
        </div>

        <!-- 备注 -->
        <div class="remark-section">
          <span class="info-label">备注</span>
          <div class="remark-content">{{ itemData.remark }}</div>
        </div>
      </div>

      <!-- ============================================================ -->
      <!-- 走访计划配置 -->
      <!-- ============================================================ -->
      <div class="section-card">
        <div class="section-header">
          <h2 class="section-title">
            <el-icon :size="18"><Calendar /></el-icon>
            走访计划配置
          </h2>
        </div>
        <div class="info-grid">
          <div class="info-item">
            <span class="info-label">走访周期</span>
            <span class="info-value highlight">{{ itemData.visitCycle }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">最近一次计划日期</span>
            <span class="info-value">{{ itemData.lastPlanDate }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">下次应访日期</span>
            <span class="info-value highlight">{{ itemData.nextVisitDate }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">责任人</span>
            <span class="info-value">{{ itemData.assignee }}</span>
          </div>
        </div>
      </div>

      <!-- ============================================================ -->
      <!-- 走访记录（按时间倒序） -->
      <!-- ============================================================ -->
      <div class="section-card">
        <div class="section-header">
          <h2 class="section-title">
            <el-icon :size="18"><Clock /></el-icon>
            走访记录（按时间倒序）
          </h2>
          <SysButton type="default" variant="outline" size="small" @click="handleManualRecord">
            <el-icon :size="14"><Plus /></el-icon>
            手动补录
          </SysButton>
        </div>
        <div class="visit-timeline">
          <div
            v-for="record in itemData.visitRecords"
            :key="record.id"
            class="visit-timeline-item"
            :class="{ 'visit-timeline-item--missed': record.isMissed }"
          >
            <div class="visit-timeline-dot" :class="record.isMissed ? 'missed' : 'visited'"></div>
            <div class="visit-timeline-content">
              <div class="visit-timeline-header">
                <span class="visit-date">
                  <el-icon :size="14"><Calendar /></el-icon>
                  计划走访：{{ record.planDate }}
                </span>
                <SysTag
                  :type="getStatusType(record.isMissed)"
                  size="mini"
                  :variant="record.isMissed ? 'solid' : 'outline'"
                >
                  {{ getStatusText(record.isMissed) }}
                </SysTag>
              </div>
              <div v-if="record.isMissed" class="visit-missed-info">
                <el-icon :size="14" style="color: var(--color-danger)"><Warning /></el-icon>
                <span class="missed-reason">漏访原因：{{ record.missedReason }}</span>
              </div>
              <template v-else>
                <div class="visit-detail-row">
                  <span class="visit-detail-label">实际走访：</span>
                  <span class="visit-detail-value">{{ record.actualDate }} {{ record.clockTime }}</span>
                </div>
                <div class="visit-detail-row">
                  <span class="visit-detail-label">走访人员：</span>
                  <span class="visit-detail-value">{{ record.visitor }}</span>
                </div>
                <div class="visit-detail-row visit-detail-row--content">
                  <span class="visit-detail-label">走访内容：</span>
                  <span class="visit-detail-value">{{ record.content }}</span>
                </div>
              </template>
            </div>
          </div>
        </div>
      </div>

      <!-- ============================================================ -->
      <!-- 漏访预警记录 -->
      <!-- ============================================================ -->
      <div class="section-card" v-if="itemData.missedWarnings.length > 0">
        <div class="section-header">
          <h2 class="section-title">
            <el-icon :size="18"><Warning /></el-icon>
            漏访预警记录
          </h2>
        </div>
        <div class="warning-list">
          <div v-for="warning in itemData.missedWarnings" :key="warning.id" class="warning-item">
            <div class="warning-row">
              <span class="warning-label">漏访日期</span>
              <span class="warning-value">{{ warning.missedDate }}</span>
            </div>
            <div class="warning-row">
              <span class="warning-label">预警时间</span>
              <span class="warning-value">{{ warning.warningTime }}</span>
            </div>
            <div class="warning-row">
              <span class="warning-label">提醒方式</span>
              <span class="warning-value">
                <SysTag type="info" size="mini" variant="outline">{{ warning.notifyMethod }}</SysTag>
              </span>
            </div>
            <div class="warning-row">
              <span class="warning-label">处理结果</span>
              <span class="warning-value">{{ warning.result }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- ============================================================ -->
      <!-- 操作按钮区 -->
      <!-- ============================================================ -->
      <div class="action-bar">
        <SysButton type="default" variant="outline" @click="handleEditProfile">
          <el-icon :size="14"><Edit /></el-icon>
          编辑档案
        </SysButton>
        <SysButton type="primary" variant="outline" @click="handleDispatchTask">
          <el-icon :size="14"><Bell /></el-icon>
          制定走访任务
        </SysButton>
        <SysButton type="default" variant="outline" @click="handleManualRecord">
          <el-icon :size="14"><Plus /></el-icon>
          手动补录走访
        </SysButton>
        <SysButton type="default" variant="outline" @click="handleExport">
          <el-icon :size="14"><Download /></el-icon>
          导出档案
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

.section-title {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  font-size: var(--font-size-h3);
  font-weight: var(--font-weight-medium);
  color: var(--text-primary);
  margin: 0;
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

/* ==================== 信息网格 ==================== */
.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: var(--spacing-md) var(--spacing-lg);
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-4);
}

.info-item--wide {
  grid-column: span 2;
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

.info-value.highlight {
  color: var(--color-warning);
  font-weight: var(--font-weight-bold);
  font-size: var(--font-size-body);
}

/* ==================== 分隔线 ==================== */
.info-divider {
  display: flex;
  align-items: center;
  margin: var(--spacing-12) 0;
}

.info-divider::before,
.info-divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: var(--border-default);
}

.info-divider-text {
  padding: 0 var(--spacing-12);
  font-size: var(--font-size-xs);
  color: var(--text-muted);
  font-weight: var(--font-weight-medium);
}

/* ==================== 备注 ==================== */
.remark-section {
  margin-top: var(--spacing-12);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-4);
}

.remark-content {
  font-size: var(--font-size-small);
  color: var(--text-secondary);
  line-height: 1.6;
  padding: var(--spacing-12);
  background: var(--fill-secondary);
  border-radius: var(--radius-md);
  border: 1px solid var(--border-low);
}

/* ==================== 走访时间线 ==================== */
.visit-timeline {
  display: flex;
  flex-direction: column;
  gap: 0;
  padding-left: var(--spacing-4);
  border-left: 2px solid var(--border-default);
}

.visit-timeline-item {
  position: relative;
  padding-left: var(--spacing-16);
  padding-bottom: var(--spacing-16);
}

.visit-timeline-item:last-child {
  padding-bottom: 0;
}

.visit-timeline-dot {
  position: absolute;
  left: -7px;
  top: 4px;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 2px solid var(--fill-surface);
}

.visit-timeline-dot.visited {
  background: var(--color-success);
}

.visit-timeline-dot.missed {
  background: var(--color-danger);
}

.visit-timeline-content {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-4);
}

.visit-timeline-header {
  display: flex;
  align-items: center;
  gap: var(--spacing-8);
}

.visit-date {
  display: flex;
  align-items: center;
  gap: var(--spacing-4);
  font-size: var(--font-size-small);
  color: var(--text-secondary);
}

.visit-missed-info {
  display: flex;
  align-items: center;
  gap: var(--spacing-4);
  padding: var(--spacing-8) var(--spacing-12);
  background: var(--color-danger-bg);
  border: 1px solid var(--color-danger-border);
  border-radius: var(--radius-md);
}

.missed-reason {
  font-size: var(--font-size-small);
  color: var(--color-danger);
}

.visit-detail-row {
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-4);
}

.visit-detail-row--content {
  flex-direction: column;
  gap: var(--spacing-2);
  padding: var(--spacing-8) var(--spacing-12);
  background: var(--fill-secondary);
  border-radius: var(--radius-md);
  margin-top: var(--spacing-4);
}

.visit-detail-label {
  font-size: var(--font-size-xs);
  color: var(--text-muted);
  flex-shrink: 0;
}

.visit-detail-value {
  font-size: var(--font-size-small);
  color: var(--text-primary);
  line-height: 1.5;
}

/* ==================== 漏访预警列表 ==================== */
.warning-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-8);
}

.warning-item {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  gap: var(--spacing-md);
  padding: var(--spacing-12);
  background: var(--fill-secondary);
  border-radius: var(--radius-md);
  border: 1px solid var(--border-low);
}

.warning-row {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2);
}

.warning-label {
  font-size: var(--font-size-xs);
  color: var(--text-muted);
  font-weight: var(--font-weight-medium);
}

.warning-value {
  font-size: var(--font-size-small);
  color: var(--text-primary);
  line-height: 1.5;
}

/* ==================== 操作按钮区 ==================== */
.action-bar {
  display: flex;
  gap: var(--spacing-sm);
  flex-wrap: wrap;
  padding: var(--spacing-md);
  background: var(--fill-surface);
  border-top: 1px solid var(--border-low);
  position: sticky;
  bottom: 0;
  z-index: 10;
}
</style>