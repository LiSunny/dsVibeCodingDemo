<!--
  组件名称: SysButton
  用途: 系统通用按钮组件，封装 Element Plus el-button，统一使用设计令牌
  设计令牌: 全部使用 CSS 变量，支持浅色/深色模式，符合 style-standards.md 规范

  Props:
    type         - 语义类型: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info'
    variant      - 按钮风格: 'solid'（实心）| 'outline'（线框）| 'ghost'（幽灵/文字）
    size         - 尺寸: 'large' | 'default' | 'small' | 'mini'
    icon         - Element Plus 图标组件（从 @element-plus/icons-vue 导入后传入）
    iconPosition - 图标位置: 'left' | 'right'
    disabled     - 是否禁用
    loading      - 是否加载中
    circle       - 是否圆形按钮
    round        - 是否圆角按钮（默认 true）
    fullWidth    - 是否撑满父容器宽度
-->
<script setup>
import { computed } from 'vue'

const props = defineProps({
  type: {
    type: String,
    default: 'default',
    validator: (v) => ['default', 'primary', 'success', 'warning', 'danger', 'info'].includes(v),
  },
  variant: {
    type: String,
    default: 'solid',
    validator: (v) => ['solid', 'outline', 'ghost'].includes(v),
  },
  size: {
    type: String,
    default: 'default',
    validator: (v) => ['large', 'default', 'small', 'mini'].includes(v),
  },
  icon: {
    type: Object,
    default: null,
  },
  iconPosition: {
    type: String,
    default: 'left',
    validator: (v) => ['left', 'right'].includes(v),
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  circle: {
    type: Boolean,
    default: false,
  },
  round: {
    type: Boolean,
    default: true,
  },
  fullWidth: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['click'])

// el-button size 映射（mini 映射为 small，通过自定义样式进一步缩小）
const elSize = computed(() => {
  if (props.size === 'mini') return 'small'
  return props.size
})

// 按钮语义类型 → 颜色令牌主色（用于 solid 文字色、outline/ghost 边框+文字色）
const semanticColorVarMap = {
  primary: 'var(--color-primary)',
  success: 'var(--color-success)',
  warning: 'var(--color-warning)',
  danger: 'var(--color-danger)',
  info: 'var(--color-info)',
  default: 'var(--text-primary)',
}

// 按钮语义类型 → solid 背景色令牌
const semanticSolidBgVarMap = {
  primary: 'var(--color-primary)',
  success: 'var(--color-success)',
  warning: 'var(--color-warning)',
  danger: 'var(--color-danger)',
  info: 'var(--color-info)',
  default: 'var(--fill-secondary)',
}

// 按钮语义类型 → ghost/outline hover 背景色令牌
const semanticHoverBgVarMap = {
  primary: 'var(--color-info-bg)',
  success: 'var(--color-success-bg)',
  warning: 'var(--color-warning-bg)',
  danger: 'var(--color-danger-bg)',
  info: 'var(--color-info-bg)',
  default: 'var(--fill-hover)',
}

// 按钮语义类型 → 边框色令牌（outline 风格）
const semanticBorderVarMap = {
  primary: 'var(--color-info-border)',
  success: 'var(--color-success-border)',
  warning: 'var(--color-warning-border)',
  danger: 'var(--color-danger-border)',
  info: 'var(--color-info-border)',
  default: 'var(--border-primary)',
}

// 按钮样式类名组合
const btnClass = computed(() => {
  const classes = ['sys-btn']
  classes.push(`sys-btn--${props.type}`)
  classes.push(`sys-btn--${props.variant}`)
  classes.push(`sys-btn--${props.size}`)
  if (props.fullWidth) classes.push('sys-btn--full')
  if (props.icon && !props.circle) classes.push(`sys-btn--icon-${props.iconPosition}`)
  return classes
})

// 按钮自定义 CSS 变量样式
const btnStyle = computed(() => {
  const color = semanticColorVarMap[props.type]
  const solidBg = semanticSolidBgVarMap[props.type]
  const hoverBg = semanticHoverBgVarMap[props.type]
  const borderVar = semanticBorderVarMap[props.type]

  const style = {
    '--btn-color': color,
    '--btn-bg-hover': hoverBg,
    '--btn-border-color': borderVar,
  }

  if (props.variant === 'solid') {
    style['--btn-bg'] = solidBg
    // default 类型 solid 使用普通文字色，其他语义色使用反色文字
    style['--btn-text'] = props.type === 'default'
      ? 'var(--text-primary)'
      : 'var(--text-inverse)'
    style['--btn-border'] = 'none'
    style['--btn-hover-brightness'] = '0.92'
    style['--btn-active-brightness'] = '0.85'
  } else if (props.variant === 'outline') {
    style['--btn-bg'] = 'transparent'
    style['--btn-text'] = color
    style['--btn-border'] = `1px solid ${borderVar}`
    style['--btn-hover-bg'] = hoverBg
    style['--btn-hover-border'] = `1px solid ${color}`
  } else {
    // ghost
    style['--btn-bg'] = 'transparent'
    style['--btn-text'] = color
    style['--btn-border'] = 'none'
    style['--btn-hover-bg'] = hoverBg
  }

  return style
})

function handleClick(event) {
  if (!props.disabled && !props.loading) {
    emit('click', event)
  }
}
</script>

<template>
  <el-button
    :class="btnClass"
    :style="btnStyle"
    :size="elSize"
    :disabled="disabled"
    :loading="loading"
    :circle="circle"
    :round="round"
    class="sys-btn-root"
    @click="handleClick"
  >
    <!-- 圆形按钮：仅显示图标 -->
    <template v-if="circle && icon">
      <el-icon class="sys-btn-icon">
        <component :is="icon" />
      </el-icon>
    </template>

    <!-- 普通按钮：图标左 + 文字 + 图标右 -->
    <template v-else>
      <el-icon v-if="icon && iconPosition === 'left'" class="sys-btn-icon">
        <component :is="icon" />
      </el-icon>
      <span class="sys-btn-text">
        <slot />
      </span>
      <el-icon v-if="icon && iconPosition === 'right'" class="sys-btn-icon">
        <component :is="icon" />
      </el-icon>
    </template>
  </el-button>
</template>

<style scoped>
/* ============================================================
 * 按钮基础重置
 * 覆盖 el-button 默认样式，统一使用设计令牌
 * ============================================================ */
.sys-btn-root {
  background: var(--btn-bg) !important;
  color: var(--btn-text) !important;
  border: var(--btn-border) !important;
  font-family: var(--font-family-base);
  font-weight: var(--font-weight-medium);
  line-height: 1.5;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-4);
  white-space: nowrap;
  cursor: pointer;
  user-select: none;
}

/* ============================================================
 * 尺寸定义（类直接应用在 el-button 根元素上）
 * ============================================================ */
.sys-btn--large {
  padding: var(--spacing-sm) var(--spacing-lg);
  font-size: var(--font-size-body);
  border-radius: var(--radius-md);
  min-height: 40px;
}

.sys-btn--default {
  padding: 6px var(--spacing-md);
  font-size: var(--font-size-small);
  border-radius: var(--radius-sm);
  min-height: 32px;
}

.sys-btn--small {
  padding: var(--spacing-4) var(--spacing-sm);
  font-size: var(--font-size-xs);
  border-radius: var(--radius-sm);
  min-height: 28px;
}

/* mini: 在 small 基础上进一步缩小 */
.sys-btn--mini {
  padding: var(--spacing-2) var(--spacing-8);
  font-size: var(--font-size-xs);
  border-radius: var(--radius-sm);
  min-height: 24px;
}

/* ============================================================
 * 全宽
 * ============================================================ */
.sys-btn--full {
  width: 100% !important;
}

/* ============================================================
 * solid 风格 - hover / active / disabled
 * ============================================================ */
.sys-btn--solid:hover:not(:disabled) {
  filter: brightness(var(--btn-hover-brightness, 0.92));
}

.sys-btn--solid:active:not(:disabled) {
  filter: brightness(var(--btn-active-brightness, 0.85));
}

.sys-btn--solid:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

/* ============================================================
 * outline 风格 - hover / active / disabled
 * ============================================================ */
.sys-btn--outline:hover:not(:disabled) {
  background: var(--btn-hover-bg) !important;
  border-color: var(--btn-hover-border) !important;
}

.sys-btn--outline:active:not(:disabled) {
  background: var(--btn-hover-bg) !important;
  filter: brightness(0.92);
}

.sys-btn--outline:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

/* ============================================================
 * ghost 风格 - hover / active / disabled
 * ============================================================ */
.sys-btn--ghost:hover:not(:disabled) {
  background: var(--btn-hover-bg) !important;
}

.sys-btn--ghost:active:not(:disabled) {
  background: var(--btn-hover-bg) !important;
  filter: brightness(0.92);
}

.sys-btn--ghost:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

/* ============================================================
 * 图标样式
 * ============================================================ */
.sys-btn-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: inherit;
  flex-shrink: 0;
}

/* ============================================================
 * 默认类型特殊处理
 * ============================================================ */
.sys-btn--default.sys-btn--ghost:hover:not(:disabled) {
  background: transparent !important;
  opacity: 0.75;
}

.sys-btn--default.sys-btn--outline:hover:not(:disabled) {
  background: var(--fill-secondary) !important;
}

/* ============================================================
 * circle 圆形按钮 - 宽高等同
 * ============================================================ */
.sys-btn-root.is-circle {
  padding: 0 !important;
  min-width: unset !important;
}
</style>