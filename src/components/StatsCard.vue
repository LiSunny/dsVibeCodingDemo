<!--
  组件名称: StatsCard
  用途: 通用统计卡片组件，支持数字(数量) / 进度指标(环形) / 异常(数字+边框颜色) / 紧凑型 四种类型
  设计令牌: 全部使用 CSS 变量，符合 style-standards.md 规范
-->
<script setup>
import { computed } from 'vue'
import SysTag from './SysTag.vue'

/**
 * Props 定义
 *
 * @prop {String}  type      - 卡片类型: 'number' | 'progress' | 'abnormal' | 'dashboard' | 'compact'
 *                               number:   纯数字卡片，数字颜色由 status 控制
 *                               progress: 环形进度卡片，progress 决定环形填充比例
 *                               abnormal: 异常卡片，仅通过数字颜色和卡片 border 颜色标识异常
 *                               dashboard: 仪表盘风格卡片，含图标、主数值+单位、底部状态栏（在线率等）
 *                               compact:  紧凑双行卡片，标题+Tag / 数值+小环形进度
 * @prop {String|Number} value - 展示数值
 * @prop {String}       label - 标签文字
 * @prop {String}       status - 语义状态: 'primary' | 'success' | 'warning' | 'danger' | null
 *                               控制数字颜色 + abnormal 类型边框颜色 + dashboard 顶部边框色 + compact 数字颜色
 * @prop {Number}       progress - 进度值 (0-100)，仅 progress / compact 类型生效
 * @prop {String}       tag - 标签文字 (显示在 label 右侧的小标签)
 * @prop {String}       tagType - 标签类型: 'danger' | 'warning' | 'success' | 'info'
 * @prop {String}       unit - 数值单位，仅 dashboard 类型生效
 * @prop {String}       footerText - 底部状态文字，仅 dashboard 类型生效
 * @prop {String}       footerIcon - 底部状态图标名（element-plus icon 组件名），仅 dashboard 类型生效
 */
const props = defineProps({
  type: {
    type: String,
    default: 'number',
    validator: (v) => ['number', 'progress', 'abnormal', 'dashboard', 'compact'].includes(v),
  },
  value: {
    type: [String, Number],
    required: true,
  },
  label: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    default: null,
    validator: (v) => [null, 'primary', 'success', 'warning', 'danger'].includes(v),
  },
  progress: {
    type: Number,
    default: null,
  },
  tag: {
    type: String,
    default: '',
  },
  tagType: {
    type: String,
    default: 'danger',
  },
  /** Dashboard 类型专属：数值单位 */
  unit: {
    type: String,
    default: '',
  },
  /** Dashboard 类型专属：底部状态文字（如"在线 1,263 · 在线率 98.2%"） */
  footerText: {
    type: String,
    default: '',
  },
})

// ==================== 颜色计算 ====================
// status → 文字颜色
const statusTextColorMap = {
  primary: 'var(--color-primary)',
  success: 'var(--color-success)',
  warning: 'var(--color-warning)',
  danger: 'var(--color-danger)',
}

const textColor = computed(() => {
  if (props.status && statusTextColorMap[props.status]) {
    return statusTextColorMap[props.status]
  }
  return 'var(--text-primary)'
})

// status → 异常边框颜色 (仅 abnormal 使用)
const statusBorderMap = {
  success: 'var(--color-success-border)',
  warning: 'var(--color-warning-border)',
  danger: 'var(--color-danger-border)',
}

const borderColor = computed(() => {
  if (props.type === 'abnormal' && props.status && statusBorderMap[props.status]) {
    return statusBorderMap[props.status]
  }
  return 'var(--border-default)'
})

// abnormal 类型边界框样式
const cardBorderStyle = computed(() => {
  if (props.type === 'abnormal') {
    return {
      borderColor: borderColor.value,
    }
  }
  return {}
})

// ==================== 环形进度图参数 (progress 类型) ====================
const ringRadius = 54
const ringCircumference = 2 * Math.PI * ringRadius

const ringOffset = computed(() => {
  const rate = props.progress ?? 0
  return ringCircumference - (rate / 100) * ringCircumference
})

// 进度条颜色: >=90% green, >=70% warning, else danger
const progressColor = computed(() => {
  const rate = props.progress ?? 0
  if (rate >= 90) return 'var(--color-success)'
  if (rate >= 70) return 'var(--color-warning)'
  return 'var(--color-danger)'
})

// ==================== compact 环形进度参数 ====================
const compactRingRadius = 13
const compactRingCircumference = 2 * Math.PI * compactRingRadius

const compactRingOffset = computed(() => {
  const rate = props.progress ?? 0
  return compactRingCircumference - (rate / 100) * compactRingCircumference
})
</script>

<template>
  <!-- ========== 纯数字卡片 ========== -->
  <div v-if="type === 'number'" class="stat-card" :style="cardBorderStyle">
    <div class="stat-card-value" :style="{ color: textColor }">{{ value }}</div>
    <div class="stat-card-label">
      {{ label }}
      <SysTag v-if="tag" size="small" :type="tagType" variant="outline" class="stat-card-tag">{{ tag }}</SysTag>
    </div>
  </div>

  <!-- ========== 环形进度卡片 ========== -->
  <div v-else-if="type === 'progress'" class="stat-card stat-card--ring">
    <svg width="130" height="130" viewBox="0 0 130 130" class="ring-chart">
      <!-- 背景轨道 -->
      <circle
        cx="65" cy="65" :r="ringRadius"
        fill="none"
        stroke="var(--border-low)"
        stroke-width="10"
      />
      <!-- 进度弧 -->
      <circle
        cx="65" cy="65" :r="ringRadius"
        fill="none"
        :stroke="progressColor"
        stroke-width="10"
        stroke-linecap="round"
        :stroke-dasharray="ringCircumference"
        :stroke-dashoffset="ringOffset"
        transform="rotate(-90 65 65)"
        class="ring-chart-fill"
      />
      <!-- 中心数值 -->
      <text x="65" y="61" text-anchor="middle" class="ring-chart-value" :fill="progressColor">
        {{ value }}%
      </text>
      <text x="65" y="80" text-anchor="middle" class="ring-chart-label" fill="var(--text-muted)">
        {{ label }}
      </text>
    </svg>
  </div>

  <!-- ========== 异常卡片 (仅数字颜色 + 边框颜色) ========== -->
  <div v-else-if="type === 'abnormal'" class="stat-card stat-card--abnormal" :style="{ borderColor: borderColor }">
    <div class="stat-card-value" :style="{ color: textColor }">{{ value }}</div>
    <div class="stat-card-label">
      {{ label }}
      <SysTag v-if="tag" size="small" :type="tagType" variant="outline" class="stat-card-tag">{{ tag }}</SysTag>
    </div>
  </div>

  <!-- ========== 仪表盘卡片 (Dashboard) ========== -->
  <div v-else-if="type === 'dashboard'" class="stat-card stat-card--dashboard" :class="`stat-card--${status}`">
    <div class="stat-card-header">
      <div class="stat-card-icon" :class="`stat-card-icon--${status}`">
        <slot name="icon">
          <span class="icon-placeholder">{{ label.charAt(0) }}</span>
        </slot>
      </div>
      <div class="stat-card-info">
        <span class="stat-card-value" :style="{ color: textColor }">{{ value }}</span>
        <span v-if="unit" class="stat-card-unit">{{ unit }}</span>
      </div>
    </div>
    <div class="stat-card-label">{{ label }}</div>
    <div v-if="footerText" class="stat-card-footer">
      <el-icon v-if="$slots.footerIcon" class="footer-icon"><slot name="footerIcon" /></el-icon>
      {{ footerText }}
    </div>
  </div>

  <!-- ========== 紧凑卡片 (Compact) ========== -->
  <div v-else-if="type === 'compact'" class="stat-card stat-card--compact">
    <div class="compact-header">
      <span class="compact-title">{{ label }}</span>
      <SysTag v-if="tag" size="small" :type="tagType" variant="outline" class="compact-tag">{{ tag }}</SysTag>
    </div>
    <div class="compact-body">
      <span class="compact-value" :style="{ color: textColor }">{{ value }}</span>
      <svg v-if="progress !== null" class="compact-ring" width="37" height="37" viewBox="0 0 37 37">
        <circle
          cx="18.5" cy="18.5" :r="compactRingRadius"
          fill="none"
          stroke="var(--border-low)"
          stroke-width="4"
        />
        <circle
          cx="18.5" cy="18.5" :r="compactRingRadius"
          fill="none"
          stroke="var(--color-primary)"
          stroke-width="4"
          stroke-linecap="round"
          :stroke-dasharray="compactRingCircumference"
          :stroke-dashoffset="compactRingOffset"
          transform="rotate(-90 18.5 18.5)"
          class="compact-ring-fill"
        />
      </svg>
    </div>
  </div>
</template>

<style scoped>
/* ==================== 卡片基础 ==================== */
.stat-card {
  background: var(--fill-secondary);
  border-radius: var(--radius-lg);
  border: 1px solid var(--border-default);
  padding: var(--spacing-lg) var(--spacing-md);
  text-align: center;
  min-height: 130px;
  display: flex;
  flex-direction: column;
  align-items: space-between;
  justify-content: center;
  transition: box-shadow 0.2s ease;
}

.stat-card:hover {
  box-shadow: var(--shadow-md);
}

/* 环形卡片无边距 */
.stat-card--ring {
  padding: 0;
  border: 1px solid var(--border-default);
}

/* 异常卡片：背景保持 fill-surface，仅边框变色 */
.stat-card--abnormal {
  background: var(--fill-surface);
  border-width: 1.5px;
}

/* ==================== 数值 ==================== */
.stat-card-value {
  font-size: var(--font-size-h1);
  font-weight: var(--font-weight-heavy);
  color: var(--text-primary);
  line-height: 1.2;
}

/* ==================== 标签行 ==================== */
.stat-card-label {
  font-size: var(--font-size-small);
  color: var(--text-muted);
  margin-top: var(--spacing-4);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
}

.stat-card-tag {
  margin-left: var(--spacing-4);
}

/* ==================== 环形图 ==================== */
.ring-chart-fill {
  transition: stroke-dashoffset 0.6s ease;
}

.ring-chart-value {
  font-size: var(--font-size-h3);
  font-weight: var(--font-weight-heavy);
}

.ring-chart-label {
  font-size: var(--font-size-xs);
}

/* ==================== 仪表盘卡片 (Dashboard) ==================== */
.stat-card--dashboard {
  padding: var(--spacing-md);
  text-align: left;
  display: block;
  min-height: auto;
}

.stat-card--primary { border-top: 3px solid var(--color-primary); }
.stat-card--success { border-top: 3px solid var(--color-success); }
.stat-card--warning { border-top: 3px solid var(--color-warning); }
.stat-card--danger { border-top: 3px solid var(--color-danger); }

.stat-card-header {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.stat-card-icon {
  width: 48px;
  height: 48px;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-card-icon--primary { background: rgba(54, 120, 227, 0.1); color: var(--color-primary); }
.stat-card-icon--success { background: var(--color-success-bg); color: var(--color-success); }
.stat-card-icon--warning { background: var(--color-warning-bg); color: var(--color-warning); }
.stat-card-icon--danger { background: var(--color-danger-bg); color: var(--color-danger); }

.stat-card-info {
  display: flex;
  align-items: baseline;
  gap: var(--spacing-4);
}

.stat-card-unit {
  font-size: var(--font-size-xs);
  color: var(--text-muted);
}

.stat-card-footer {
  font-size: var(--font-size-xs);
  color: var(--color-success);
  margin-top: var(--spacing-8);
  display: flex;
  align-items: center;
  gap: var(--spacing-4);
}

.footer-icon {
  font-size: var(--font-size-small);
}

/* ==================== 紧凑卡片 (Compact) ==================== */
.stat-card--compact {
  padding: var(--spacing-sm);
  min-height: 82px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background: var(--fill-secondary);
}

.compact-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.compact-title {
  font-size: var(--font-size-small);
  color: var(--text-secondary);
  line-height: 1.4;
}

.compact-tag {
  font-size: var(--font-size-xs);
}

.compact-body {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex: 1;
}

.compact-value {
  font-size: var(--font-size-h2);
  font-weight: var(--font-weight-bold);
  line-height: 1.2;
}

.compact-ring-fill {
  transition: stroke-dashoffset 0.6s ease;
}
</style>