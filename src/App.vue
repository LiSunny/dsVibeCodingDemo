<script setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { Fold, Expand } from '@element-plus/icons-vue'

const router = useRouter()
const route = useRoute()

const isCollapsed = ref(false)

const toggleCollapse = () => {
  isCollapsed.value = !isCollapsed.value
}

// 面包屑
const handleSelect = (index) => {
  router.push(index)
}

const breadcrumb = computed(() => {
  const parts = route.path.split('/').filter(Boolean)
  if (parts.length === 0 || (parts.length === 1 && parts[0] === 'home')) return '首页'
  const map = {
    home: '首页',
    news: '石楼动态资讯',
  }
  return parts.map((p) => map[p] || p).join(' / ')
})
</script>

<template>
  <div class="app">
    <!-- 左侧可折叠菜单栏 -->
    <aside class="layout-sidebar" :data-collapsed="isCollapsed">
      <div class="sidebar-header">
        <div class="logo">石楼平台</div>
        <button class="collapse-btn" @click="toggleCollapse">
          <el-icon :size="20">
            <Fold v-if="!isCollapsed" />
            <Expand v-else />
          </el-icon>
        </button>
      </div>
      <nav class="sidebar-nav">
        <el-menu
          :default-active="route.path"
          class="sidebar-menu"
          background-color="var(--sidebar-bg)"
          text-color="var(--sidebar-text)"
          active-text-color="var(--sidebar-active)"
          :collapse="isCollapsed"
          router
          @select="handleSelect"
        >
          <el-menu-item index="/home">
            <el-icon><HomeFilled /></el-icon>
            <span>首页</span>
          </el-menu-item>
          <el-menu-item index="/news">
            <el-icon><DataAnalysis /></el-icon>
            <span>石楼动态资讯</span>
          </el-menu-item>
        </el-menu>
      </nav>
    </aside>

    <!-- 右侧主内容区 -->
    <main class="layout-main">
      <header class="main-header">
        <div class="breadcrumb">首页 / {{ breadcrumb }}</div>
        <div class="user-info">值班员：管理员</div>
      </header>
      <div class="main-content">
        <router-view />
      </div>
    </main>
  </div>
</template>

<style scoped>
/* ============================================================
 * 全局布局
 * ============================================================ */
.app {
  display: flex;
  height: 100vh;
  overflow: hidden;
}

/* ============================================================
 * 左侧菜单栏
 * ============================================================ */
.layout-sidebar {
  width: var(--sidebar-width-expanded);
  background: var(--sidebar-bg);
  transition: width 0.2s ease;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
}

.layout-sidebar[data-collapsed='true'] {
  width: var(--sidebar-width-collapsed);
}

.sidebar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-lg) var(--spacing-md);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.logo {
  font-size: var(--font-size-body);
  font-weight: var(--font-weight-medium);
  color: var(--text-inverse);
  white-space: nowrap;
  overflow: hidden;
}

.collapse-btn {
  background: none;
  border: none;
  color: var(--sidebar-text);
  cursor: pointer;
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--radius-sm);
  flex-shrink: 0;
  transition: background 0.15s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.collapse-btn:hover {
  background: rgba(255, 255, 255, 0.1);
}

.sidebar-nav {
  flex: 1;
  overflow-y: auto;
}

.sidebar-menu {
  border-right: none !important;
}

/* ============================================================
 * 右侧主内容区
 * ============================================================ */
.layout-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: var(--fill-page);
  min-width: 600px;
}

.main-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-md) var(--spacing-lg);
  background: var(--fill-surface);
  border-bottom: 1px solid var(--border-default);
  flex-shrink: 0;
}

.breadcrumb {
  font-size: var(--font-size-small);
  color: var(--text-secondary);
}

.user-info {
  font-size: var(--font-size-small);
  color: var(--text-muted);
}

.main-content {
  flex: 1;
  overflow-y: auto;
  padding: var(--spacing-md);
  background-color: var(--fill-page);
}
</style>