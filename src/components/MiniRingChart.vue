<!--
  组件名称: MiniRingChart
  用途: 迷你环形进度图组件，用于模块卡片等紧凑空间的单值百分比展示
  设计令牌: 全部使用 CSS 变量，支持浅色/深色模式，符合 style-standards.md 规范

  Props:
    value  - 展示文本（如 "85%"）
    percent - 进度值 (0-100)
    size   - 圆环尺寸(px)，默认 44
    radius - 圆环半径，默认 18
    strokeWidth - 圆环线宽，默认 4
-->
<script setup>
import { computed } from 'vue'

const props = defineProps({
  /** 展示文本（如 "85%"） */
  value: {
    type: String,
    required: true,
  },
  /** 进度值 (0-100) */
  percent: {
    type: Number,
    required: true,
  },
  /** SVG 尺寸 */
  size: {
    type: Number,
    default: 44,
  },
  /** 圆环半径 */
  radius: {
    type: Number,
    default: 18,
  },
  /** 圆环线宽 */
  strokeWidth: {
    type: Number,
    default: 4,
  },
})

const circumference = computed(() => 2 * Math.PI * props.radius)

const dasharray = computed(() => {
  const dash = (props.percent / 100) * circumference.value
  return `${dash} ${circumference.value}`
})

const ringColor = computed(() => {
  if (props.percent >= 90) return 'var(--color-success)'
  if (props.percent >= 70) return 'var(--color-warning)'
  return 'var(--color-danger)'
})
</script>

<template>
  <div class="mini-ring">
    <svg
      class="mini-ring-svg"
      :viewBox="`0 0 ${size} ${size}`"
      :width="size"
      :height="size"
    >
      <circle
        class="mini-ring-bg"
        :cx="size / 2"
        :cy="size / 2"
        :r="radius"
        fill="none"
        :stroke="'var(--border-default)'"
        :stroke-width="strokeWidth"
      />
      <circle
        class="mini-ring-fill"
        :cx="size / 2"
        :cy="size / 2"
        :r="radius"
        fill="none"
        :stroke="ringColor"
        :stroke-width="strokeWidth"
        stroke-linecap="round"
        :stroke-dasharray="dasharray"
        :transform="`rotate(-90 ${size / 2} ${size / 2})`"
      />
    </svg>
    <span class="mini-ring-value">{{ value }}</span>
  </div>
</template>

<style scoped>
.mini-ring {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.mini-ring-svg {
  display: block;
}

.mini-ring-bg {
  opacity: 0.15;
}

.mini-ring-fill {
  transition: stroke-dasharray 0.8s ease, stroke 0.8s ease;
}

.mini-ring-value {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-bold);
  color: var(--text-primary);
  line-height: 1;
}
</style>