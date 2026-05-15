<!--
  组件名称: OwnerDashboardItem
  用途: 隐患详情页（三级页面），展示隐患基本信息、处理时间轴、维修记录、超时分析
-->
<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Warning, Clock, Check, Timer } from '@element-plus/icons-vue'
import StatsCard from '@/components/StatsCard.vue'
import SysButton from '@/components/SysButton.vue'
import SysTag from '@/components/SysTag.vue'
import PageHeader from '@/components/PageHeader.vue'
import MiniRingChart from '@/components/MiniRingChart.vue'

const route = useRoute()
const router = useRouter()

// ==================== 加载状态 ====================
const pageLoading = ref(true)
setTimeout(() => { pageLoading.value = false }, 500)

// ==================== 隐患 ID ====================
const hazardId = computed(() => Number(route.params.id) || 1)

// ============================================================
// 隐患详情数据（按文档4.4节：3号库烟感探测器故障）
// ============================================================
const hazardDetail = computed(() => {
  const map = {
    1: {
      id: 1,
      level: '重大',
      description: '3号库烟感探测器故障',
      discoverTime: '2026-01-14 09:30',
      discoverer: '李阳（维保工程师）',
      location: '3号库东南角',
      device: '烟感#S023',
      deviceType: '烟雾探测器',
      hasPhoto: true,
      photoUrl: '',
      status: '维修中',
      timeline: [
        { step: '发现隐患', time: '2026-01-14 09:30', operator: '李阳（维保工程师）', remark: '巡检发现3号库烟感探测器故障报警，现场确认设备无响应' },
        { step: '派单', time: '2026-01-14 10:05', operator: '王芳（调度员）', remark: '已派发维修工单#WO20260114-003，指派工程师李阳' },
        { step: '维修开始', time: '2026-01-14 13:20', operator: '李阳（维保工程师）', remark: '到达现场，排查烟感线路及探测器模块' },
        { step: '维修完成（待测试）', time: '2026-01-15 11:00', operator: '李阳（维保工程师）', remark: '更换烟感探测器1个，等待功能测试' },
        { step: '测试完成（待确认）', time: '2026-01-15 14:30', operator: '张伟（测试工程师）', remark: '功能测试通过，灵敏度正常，等待业主确认' },
        { step: '等待业主确认', time: '—', operator: '待确认', remark: '需库区主任签字确认闭环' },
      ],
      repairRecords: [
        { part: '烟感探测器（JTY-GD-G3X）', quantity: 1, unitPrice: 180, isContractual: false, total: 180 },
      ],
      contractualResponseLimit: 2,
      actualResponse: 1.5,
      contractualRepairLimit: 24,
      actualRepair: 26,
      isOvertime: true,
      overtimeHours: 2,
    },
    2: {
      id: 2,
      level: '一般',
      description: 'B区灭火器压力不足',
      discoverTime: '2026-01-12 14:15',
      discoverer: '王芳（维保工程师）',
      location: 'B区走廊东侧',
      device: '灭火器#M045',
      deviceType: '干粉灭火器',
      hasPhoto: true,
      photoUrl: '',
      status: '已闭环',
      timeline: [
        { step: '发现隐患', time: '2026-01-12 14:15', operator: '王芳（维保工程师）', remark: '月度检查发现灭火器压力表指针在红色区域' },
        { step: '派单', time: '2026-01-12 14:30', operator: '王芳（调度员）', remark: '已派发更换工单' },
        { step: '维修开始', time: '2026-01-12 16:00', operator: '张伟（维保工程师）', remark: '携带新灭火器到现场' },
        { step: '维修完成', time: '2026-01-12 16:15', operator: '张伟（维保工程师）', remark: '更换灭火器，压力正常' },
        { step: '甲方确认闭合', time: '2026-01-12 17:00', operator: '陈主任（库区主任）', remark: '现场验收通过，已签字确认' },
      ],
      repairRecords: [
        { part: '干粉灭火器（MFZ/ABC4）', quantity: 1, unitPrice: 0, isContractual: true, total: 0 },
      ],
      contractualResponseLimit: 4,
      actualResponse: 1.5,
      contractualRepairLimit: 48,
      actualRepair: 2,
      isOvertime: false,
      overtimeHours: 0,
    },
    3: {
      id: 3,
      level: '重大',
      description: '消防泵房控制柜报警',
      discoverTime: '2026-01-05 08:10',
      discoverer: '李阳（维保工程师）',
      location: '消防泵房B1层',
      device: '控制柜#P01',
      deviceType: '消防泵控制柜',
      hasPhoto: true,
      photoUrl: '',
      status: '待确认',
      timeline: [
        { step: '发现隐患', time: '2026-01-05 08:10', operator: '李阳（维保工程师）', remark: '控制柜面板显示继电器故障报警' },
        { step: '派单', time: '2026-01-05 08:40', operator: '王芳（调度员）', remark: '派发紧急维修工单' },
        { step: '维修开始', time: '2026-01-05 09:15', operator: '李阳（维保工程师）', remark: '断电检测，确认继电器损坏' },
        { step: '维修完成', time: '2026-01-05 10:10', operator: '李阳（维保工程师）', remark: '更换继电器（合同外），控制柜恢复正常' },
        { step: '等待业主确认', time: '—', operator: '待确认', remark: '需业主确认维修费用¥1,200' },
      ],
      repairRecords: [
        { part: '继电器（24V DC）', quantity: 1, unitPrice: 1200, isContractual: false, total: 1200 },
      ],
      contractualResponseLimit: 2,
      actualResponse: 0.5,
      contractualRepairLimit: 24,
      actualRepair: 2,
      isOvertime: false,
      overtimeHours: 0,
    },
  }
  return map[hazardId.value] || map[1]
})

const getLevelTag = (level) => level === '重大' ? 'danger' : 'warning'

// ============================================================
// 操作
// ============================================================
const handleConfirm = () => {
  ElMessageBox.confirm(
    '确认后该隐患将标记为"已闭环"，维修费用将计入当期结算。是否确认？',
    '确认闭环',
    { confirmButtonText: '确认闭环', cancelButtonText: '取消', type: 'warning' }
  ).then(() => {
    ElMessage.success('已确认闭环，维修记录已归档')
  }).catch(() => {})
}

const handleUrge = () => {
  ElMessage.success('已向维保负责人发送催办通知')
}

const handleContactMaintenance = () => {
  ElMessage.success('正在连接维保负责人…（在线联系方式：138****8888）')
}

const calculateOvertimeStatus = (detail) => {
  if (detail.actualResponse === 0) return '待确认'
  if (detail.isOvertime) return '已超时'
  return '合规'
}

const getOvertimeStatusTag = (status) => {
  if (status === '已超时') return 'danger'
  if (status === '合规') return 'success'
  return 'info'
}
</script>

<template>
  <div class="page-content">
    <!-- ============================================================ -->
    <!-- 页面标题栏 -->
    <!-- ============================================================ -->
    <PageHeader
      title="隐患详情"
      :subtitle="hazardDetail.description"
      show-back
      back-text="返回隐患清单"
      back-path="/owner-dashboard/detail"
    />

    <!-- ==================== 骨架屏加载 ==================== -->
    <template v-if="pageLoading">
      <el-skeleton :rows="6" animated class="skeleton-section" />
      <el-skeleton :rows="4" animated class="skeleton-section" />
    </template>

    <template v-else>
      <!-- ============================================================ -->
      <!-- 隐患基本信息 -->
      <!-- ============================================================ -->
      <div class="section">
        <h3 class="section-title">隐患基本信息</h3>
        <div class="detail-grid">
          <div class="detail-item">
            <span class="detail-label">隐患等级</span>
            <span class="detail-value">
              <SysTag :type="getLevelTag(hazardDetail.level)" size="small">{{ hazardDetail.level }}</SysTag>
            </span>
          </div>
          <div class="detail-item">
            <span class="detail-label">发现时间</span>
            <span class="detail-value">{{ hazardDetail.discoverTime }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">发现人</span>
            <span class="detail-value">{{ hazardDetail.discoverer }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">设备位置</span>
            <span class="detail-value">{{ hazardDetail.location }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">关联设备</span>
            <span class="detail-value">{{ hazardDetail.device }}（{{ hazardDetail.deviceType }}）</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">现场照片</span>
            <span class="detail-value">
              <SysButton v-if="hazardDetail.hasPhoto" type="primary" size="small" variant="ghost">
                查看照片
              </SysButton>
              <span v-else class="text-muted">无</span>
            </span>
          </div>
        </div>
      </div>

      <!-- ============================================================ -->
      <!-- 超时分析 -->
      <!-- ============================================================ -->
      <div class="section">
        <h3 class="section-title">超时分析</h3>
        <div class="overtime-panel">
          <div class="overtime-row">
            <div class="overtime-card" :class="hazardDetail.isOvertime ? 'overtime-card--danger' : 'overtime-card--success'">
              <div class="overtime-card-icon">
                <el-icon :size="22" v-if="hazardDetail.isOvertime"><Warning /></el-icon>
                <el-icon :size="22" v-else><Check /></el-icon>
              </div>
              <div class="overtime-card-body">
                <span class="overtime-card-label">超时状态</span>
                <SysTag :type="getOvertimeStatusTag(calculateOvertimeStatus(hazardDetail))" size="small">
                  {{ calculateOvertimeStatus(hazardDetail) }}
                </SysTag>
              </div>
            </div>

            <div class="overtime-card">
              <div class="overtime-card-icon">
                <el-icon :size="22"><Timer /></el-icon>
              </div>
              <div class="overtime-card-body">
                <span class="overtime-card-label">响应时限</span>
                <span class="overtime-card-value">
                  合同约定 ≤{{ hazardDetail.contractualResponseLimit }}小时，
                  实际 <strong :style="{ color: hazardDetail.actualResponse > hazardDetail.contractualResponseLimit ? 'var(--color-danger)' : 'var(--color-success)' }">{{ hazardDetail.actualResponse }}小时</strong>
                  （{{ hazardDetail.actualResponse <= hazardDetail.contractualResponseLimit ? '合规' : '超时' }}）
                </span>
              </div>
            </div>

            <div class="overtime-card">
              <div class="overtime-card-icon">
                <el-icon :size="22"><Clock /></el-icon>
              </div>
              <div class="overtime-card-body">
                <span class="overtime-card-label">修复时限</span>
                <span class="overtime-card-value">
                  合同约定 ≤{{ hazardDetail.contractualRepairLimit }}小时，
                  实际 <strong :style="{ color: hazardDetail.actualRepair > hazardDetail.contractualRepairLimit ? 'var(--color-danger)' : 'var(--color-success)' }">{{ hazardDetail.actualRepair }}小时</strong>
                  （{{ hazardDetail.isOvertime ? `超时${hazardDetail.overtimeHours}小时` : '合规' }}）
                </span>
              </div>
            </div>
          </div>

          <div v-if="hazardDetail.isOvertime" class="overtime-alert">
            <el-icon :size="16"><Warning /></el-icon>
            <span>修复已超时 {{ hazardDetail.overtimeHours }} 小时，系统已自动催办。建议立即联系维保负责人跟进。</span>
          </div>
        </div>
      </div>

      <!-- ============================================================ -->
      <!-- 处理时间轴 -->
      <!-- ============================================================ -->
      <div class="section">
        <h3 class="section-title">处理时间轴</h3>
        <div class="timeline">
          <div
            v-for="(item, index) in hazardDetail.timeline"
            :key="index"
            class="timeline-item"
            :class="{ 'timeline-item--active': index === hazardDetail.timeline.length - 1, 'timeline-item--pending': item.time === '—' }"
          >
            <div class="timeline-dot">
              <div class="timeline-dot-inner" v-if="item.time !== '—'"></div>
              <div class="timeline-dot-inner timeline-dot-inner--empty" v-else></div>
            </div>
            <div class="timeline-line" v-if="index < hazardDetail.timeline.length - 1"></div>
            <div class="timeline-content">
              <div class="timeline-header">
                <span class="timeline-step">{{ item.step }}</span>
                <span class="timeline-time">{{ item.time }}</span>
              </div>
              <div class="timeline-meta">
                <span class="timeline-operator">👤 {{ item.operator }}</span>
              </div>
              <div class="timeline-remark">{{ item.remark }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- ============================================================ -->
      <!-- 维修记录 -->
      <!-- ============================================================ -->
      <div class="section">
        <h3 class="section-title">维修记录</h3>
        <div class="repair-records">
          <div class="repair-table">
            <div class="repair-table-header">
              <span class="repair-col-name">备件名称</span>
              <span class="repair-col-qty">数量</span>
              <span class="repair-col-price">单价</span>
              <span class="repair-col-type">是否合同内</span>
              <span class="repair-col-total">小计</span>
            </div>
            <div
              v-for="(record, idx) in hazardDetail.repairRecords"
              :key="idx"
              class="repair-table-row"
            >
              <span class="repair-col-name">{{ record.part }}</span>
              <span class="repair-col-qty">{{ record.quantity }}</span>
              <span class="repair-col-price">¥{{ record.unitPrice.toLocaleString() }}</span>
              <span class="repair-col-type">
                <SysTag :type="record.isContractual ? 'success' : 'warning'" size="small">
                  {{ record.isContractual ? '合同内' : '合同外' }}
                </SysTag>
              </span>
              <span class="repair-col-total" :class="{ 'text-warning': !record.isContractual }">
                ¥{{ record.total.toLocaleString() }}
              </span>
            </div>
            <div class="repair-table-footer">
              <span class="repair-summary-label">维修费用合计</span>
              <span class="repair-summary-value">
                ¥{{ hazardDetail.repairRecords.reduce((s, r) => s + r.total, 0).toLocaleString() }}
              </span>
              <span class="repair-summary-note">
                （合同内：¥{{ hazardDetail.repairRecords.filter(r => r.isContractual).reduce((s, r) => s + r.total, 0).toLocaleString() }}，
                合同外：¥{{ hazardDetail.repairRecords.filter(r => !r.isContractual).reduce((s, r) => s + r.total, 0).toLocaleString() }}）
              </span>
            </div>
          </div>

          <div class="repair-confirm-status">
            <div class="confirm-status-item">
              <span class="confirm-status-label">业主确认状态：</span>
              <SysTag :type="hazardDetail.status === '已闭环' ? 'success' : 'danger'" size="small">
                {{ hazardDetail.status === '已闭环' ? '已确认' : '未确认' }}
              </SysTag>
            </div>
            <div v-if="hazardDetail.status === '待确认' || hazardDetail.status === '维修中'" class="confirm-status-item">
              <span class="confirm-status-label">确认方式：</span>
              <span class="text-muted" style="font-size: var(--font-size-small)">等待业主签字/扫码确认</span>
            </div>
          </div>
        </div>
      </div>

      <!-- ============================================================ -->
      <!-- 操作区域 -->
      <!-- ============================================================ -->
      <div class="action-bar">
        <SysButton
          v-if="hazardDetail.status === '待确认'"
          type="success"
          @click="handleConfirm"
        >
          确认闭环
        </SysButton>
        <SysButton
          v-if="hazardDetail.isOvertime && hazardDetail.status !== '已闭环'"
          type="danger"
          @click="handleUrge"
        >
          催促维保
        </SysButton>
        <SysButton type="default" variant="ghost" @click="handleContactMaintenance">
          联系维保负责人
        </SysButton>
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

/* ==================== 通用标题 ==================== */
.section-title {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  font-size: var(--font-size-h3);
  font-weight: var(--font-weight-medium);
  color: var(--text-primary);
  margin-bottom: var(--spacing-md);
}

.section-title::before {
  content: '';
  display: inline-block;
  width: 3px;
  height: 1em;
  background: var(--color-primary);
  border-radius: 2px;
  flex-shrink: 0;
  margin-right: var(--spacing-6);
}

/* ==================== 详情网格 ==================== */
.detail-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--spacing-md);
  background: var(--fill-surface);
  border-radius: var(--radius-lg);
  border: 1px solid var(--border-default);
  padding: var(--spacing-lg);
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-4);
}

.detail-label {
  font-size: var(--font-size-xs);
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.detail-value {
  font-size: var(--font-size-body);
  color: var(--text-primary);
}

.text-muted { color: var(--text-muted); }

/* ==================== 超时分析面板 ==================== */
.overtime-panel {
  background: var(--fill-surface);
  border-radius: var(--radius-lg);
  border: 1px solid var(--border-default);
  padding: var(--spacing-lg);
}

.overtime-row {
  display: flex;
  gap: var(--spacing-md);
  flex-wrap: wrap;
}

.overtime-card {
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-md);
  flex: 1;
  min-width: 240px;
  padding: var(--spacing-md);
  background: var(--fill-page);
  border-radius: var(--radius-md);
  border: 1px solid var(--border-low);
}

.overtime-card--danger {
  background: var(--color-danger-bg);
  border-color: var(--color-danger-border);
}

.overtime-card--success {
  background: var(--color-success-bg);
  border-color: var(--color-success-border);
}

.overtime-card-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  flex-shrink: 0;
  color: var(--color-primary);
}

.overtime-card--danger .overtime-card-icon {
  color: var(--color-danger);
}

.overtime-card--success .overtime-card-icon {
  color: var(--color-success);
}

.overtime-card-body {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-4);
}

.overtime-card-label {
  font-size: var(--font-size-xs);
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.overtime-card-value {
  font-size: var(--font-size-small);
  color: var(--text-primary);
  line-height: 1.5;
}

.overtime-alert {
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-8);
  margin-top: var(--spacing-md);
  padding: var(--spacing-8) var(--spacing-md);
  background: var(--color-warning-bg);
  border: 1px solid var(--color-warning-border);
  border-radius: var(--radius-md);
  color: var(--color-warning);
  font-size: var(--font-size-small);
}

/* ==================== 时间轴 ==================== */
.timeline {
  background: var(--fill-surface);
  border-radius: var(--radius-lg);
  border: 1px solid var(--border-default);
  padding: var(--spacing-lg);
  position: relative;
}

.timeline-item {
  display: flex;
  gap: var(--spacing-md);
  position: relative;
  padding-bottom: var(--spacing-md);
}

.timeline-item:last-child {
  padding-bottom: 0;
}

.timeline-dot {
  display: flex;
  align-items: flex-start;
  justify-content: center;
  flex-shrink: 0;
  width: 24px;
  padding-top: 4px;
}

.timeline-dot-inner {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--color-primary);
  border: 2px solid var(--color-primary);
}

.timeline-dot-inner--empty {
  background: transparent;
  border-color: var(--color-warning);
}

.timeline-line {
  position: absolute;
  left: 11px;
  top: 26px;
  width: 2px;
  height: calc(100% - 26px);
  background: linear-gradient(to bottom, var(--color-primary), var(--border-low));
}

.timeline-content {
  flex: 1;
  padding-bottom: var(--spacing-sm);
}

.timeline-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-4);
}

.timeline-step {
  font-size: var(--font-size-small);
  font-weight: var(--font-weight-medium);
  color: var(--text-primary);
}

.timeline-time {
  font-size: var(--font-size-xs);
  color: var(--text-muted);
}

.timeline-meta {
  margin-bottom: var(--spacing-4);
}

.timeline-operator {
  font-size: var(--font-size-xs);
  color: var(--text-secondary);
}

.timeline-remark {
  font-size: var(--font-size-small);
  color: var(--text-secondary);
  padding: var(--spacing-6) var(--spacing-8);
  background: var(--fill-page);
  border-radius: var(--radius-sm);
  line-height: 1.5;
}

/* ==================== 维修记录表格 ==================== */
.repair-records {
  background: var(--fill-surface);
  border-radius: var(--radius-lg);
  border: 1px solid var(--border-default);
  overflow: hidden;
}

.repair-table {
  width: 100%;
}

.repair-table-header {
  display: flex;
  padding: var(--spacing-8) var(--spacing-md);
  background: var(--fill-page);
  border-bottom: 1px solid var(--border-low);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.repair-table-row {
  display: flex;
  padding: var(--spacing-8) var(--spacing-md);
  border-bottom: 1px solid var(--border-low);
  font-size: var(--font-size-small);
  color: var(--text-primary);
  transition: background 0.15s;
}

.repair-table-row:hover {
  background: var(--fill-hover);
}

.repair-table-row:last-child {
  border-bottom: none;
}

.repair-table-footer {
  display: flex;
  align-items: center;
  gap: var(--spacing-8);
  padding: var(--spacing-8) var(--spacing-md);
  background: var(--fill-page);
  border-top: 1px solid var(--border-default);
  font-size: var(--font-size-small);
}

.repair-col-name { flex: 2.5; }
.repair-col-qty { flex: 0.8; text-align: center; }
.repair-col-price { flex: 1.2; text-align: right; }
.repair-col-type { flex: 1; text-align: center; }
.repair-col-total { flex: 1; text-align: right; font-weight: var(--font-weight-medium); }

.repair-summary-label {
  font-weight: var(--font-weight-medium);
  color: var(--text-primary);
}

.repair-summary-value {
  font-weight: var(--font-weight-bold);
  color: var(--color-warning);
  font-size: var(--font-size-body);
}

.repair-summary-note {
  font-size: var(--font-size-xs);
  color: var(--text-muted);
}

.text-warning {
  color: var(--color-warning);
  font-weight: var(--font-weight-medium);
}

.repair-confirm-status {
  display: flex;
  gap: var(--spacing-lg);
  padding: var(--spacing-md);
  border-top: 1px solid var(--border-low);
  background: var(--fill-page);
}

.confirm-status-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-6);
}

.confirm-status-label {
  font-size: var(--font-size-small);
  color: var(--text-secondary);
}

/* ==================== 操作栏 ==================== */
.action-bar {
  display: flex;
  gap: var(--spacing-md);
  padding: var(--spacing-lg);
  background: var(--fill-surface);
  border-radius: var(--radius-lg);
  border: 1px solid var(--border-default);
  justify-content: flex-end;
}
</style>