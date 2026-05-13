<!--
  组件名称: PageHeader
  用途: 通用页面标题组件，提供统一的标题区布局（标题 + 副标题 + 返回按钮 + 扩展区 + 操作区）
  设计令牌: 全部使用 CSS 变量，支持浅色/深色模式

  Props:
    title      - 页面主标题（String）
    subtitle   - 副标题 / 面包屑说明文字（String）
    showBack   - 是否显示返回按钮（Boolean）
    backText   - 返回按钮文字（String）
    backPath   - 返回路由路径，空则调用 router.back()（String）

  Slots:
    title      - 自定义标题区域（替代 prop title）
    extra      - 标题右侧扩展区（标签、统计数字等）
    actions    - 最右侧操作按钮区
-->
<script setup>
import { useRouter } from 'vue-router'
import { ArrowLeft } from '@element-plus/icons-vue'
import SysButton from '@/components/SysButton.vue'

const props = defineProps({
  title: {
    type: String,
    default: '',
  },
  subtitle: {
    type: String,
    default: '',
  },
  showBack: {
    type: Boolean,
    default: false,
  },
  backText: {
    type: String,
    default: '返回',
  },
  backPath: {
    type: String,
    default: '',
  },
})

const router = useRouter()

function handleBack() {
  if (props.backPath) {
    router.push(props.backPath)
  } else {
    router.back()
  }
}
</script>

<template>
  <div class="page-header">
    <div class="page-header-left">
      

      <!-- 标题区：优先使用 title 插槽，否则使用 prop title -->
      <div class="page-header-title-row">
        <slot name="title">
          <h2 class="page-header-title">{{ title }}</h2>
        </slot>
        <span v-if="subtitle" class="page-header-subtitle">{{ subtitle }}</span>
      </div>

      <!-- 扩展区（标签、统计数字等） -->
      <div v-if="$slots.extra" class="page-header-extra">
        <slot name="extra" />
      </div>
    </div>

    <!-- 操作区 -->
    <div v-if="$slots.actions" class="page-header-right">
      <slot name="actions" />
    </div>
    <!-- 返回按钮 -->
      <SysButton
        v-if="showBack"
        type="default"
        variant="outline"
        :icon="ArrowLeft"
        class="page-header-back-btn"
        @click="handleBack"
      >
        {{ backText }}
      </SysButton>
  </div>
</template>

<style scoped>
/* ============================================================
 * 页面标题通用组件样式
 * ============================================================ */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: var(--spacing-lg);
  padding: var(--spacing-lg);
  background: var(--fill-surface);
  border-radius: var(--radius-lg);
  border: 1px solid var(--border-default);
}

.page-header-left {
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-md);
  flex-wrap: wrap;
  flex: 1;
  min-width: 0;
}

.page-header-back-btn {
  flex-shrink: 0;
}

.page-header-title-row {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-4);
  min-width: 0;
}

.page-header-title {
  font-size: var(--font-size-h1);
  font-weight: var(--font-weight-bold);
  color: var(--text-primary);
  margin: 0;
  line-height: 1.4;
}

.page-header-subtitle {
  font-size: var(--font-size-small);
  color: var(--text-muted);
}

.page-header-extra {
  display: flex;
  align-items: center;
  gap: var(--spacing-8);
  flex-wrap: wrap;
}

.page-header-right {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  flex-shrink: 0;
}
</style>