<!--
  组件名称: SysTag
  用途: 系统通用语义标签组件，用于表格状态标记、天数标签等场景
  设计令牌: 全部使用 CSS 变量，支持浅色/深色模式，符合 style-standards.md 规范

  Props:
    type    - 语义类型: 'danger' | 'warning' | 'success' | 'info' | 'primary' | 'default'
    size    - 尺寸: 'small' | 'mini'
    variant - 样式变体: 'solid'（实心，默认）| 'outline'（线框）
-->
<script setup>
import { computed } from 'vue'

const props = defineProps({
  type: {
    type: String,
    default: 'default',
    validator: (v) => ['danger', 'warning', 'success', 'info', 'primary', 'default'].includes(v),
  },
  size: {
    type: String,
    default: 'small',
    validator: (v) => ['small', 'mini'].includes(v),
  },
  variant: {
    type: String,
    default: 'solid',
    validator: (v) => ['solid', 'outline'].includes(v),
  },
})

// 语义类型 → 文字色令牌
const textColorVarMap = {
  danger: 'var(--color-danger)',
  warning: 'var(--color-warning)',
  success: 'var(--color-success)',
  info: 'var(--color-info)',
  primary: 'var(--color-primary)',
  default: 'var(--text-secondary)',
}

// 语义类型 → 背景色令牌（solid 风格使用）
const bgColorVarMap = {
  danger: 'var(--color-danger-bg)',
  warning: 'var(--color-warning-bg)',
  success: 'var(--color-success-bg)',
  info: 'var(--color-info-bg)',
  primary: 'var(--color-primary-bg)',
  default: 'var(--fill-secondary)',
}

// 语义类型 → 边框色令牌（outline 风格使用）
const borderColorVarMap = {
  danger: 'var(--color-danger-border)',
  warning: 'var(--color-warning-border)',
  success: 'var(--color-success-border)',
  info: 'var(--color-info-border)',
  primary: 'var(--color-info-border)',
  default: 'var(--border-primary)',
}

const tagClass = computed(() => {
  const classes = ['sys-tag']
  classes.push(`sys-tag--${props.type}`)
  classes.push(`sys-tag--${props.size}`)
  classes.push(`sys-tag--${props.variant}`)
  return classes
})

const tagStyle = computed(() => ({
  '--tag-text-color': textColorVarMap[props.type],
  '--tag-bg-color': bgColorVarMap[props.type],
  '--tag-border-color': borderColorVarMap[props.type],
}))
</script>

<template>
  <span :class="tagClass" :style="tagStyle">
    <slot />
  </span>
</template>

<style scoped>
/* ============================================================
 * 标签基础样式
 * ============================================================ */
.sys-tag {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-family-base);
  font-weight: var(--font-weight-bold);
  color: var(--tag-text-color);
  background: var(--tag-bg-color);
  border-radius: var(--radius-sm);
  white-space: nowrap;
  line-height: 1.4;
}

/* ============================================================
 * solid 风格（默认）
 * ============================================================ */
.sys-tag--solid {
  border: none;
}

/* ============================================================
 * outline 风格（线框）
 * ============================================================ */
.sys-tag--outline {
  background: transparent;
  border: 1px solid var(--tag-border-color);
}

/* ============================================================
 * 尺寸定义
 * ============================================================ */
.sys-tag--small {
  padding: 2px 8px;
  font-size: var(--font-size-xs);
}

.sys-tag--mini {
  padding: 1px 6px;
  font-size: var(--font-size-xs);
}
</style>