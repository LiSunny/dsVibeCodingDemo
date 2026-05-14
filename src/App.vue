<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { Icon } from '@iconify/vue'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'

const router = useRouter()
const route = useRoute()

const isCollapsed = ref(false)

const toggleCollapse = () => {
  isCollapsed.value = !isCollapsed.value
}
 
// 深色 / 浅色模式切换
const isDark = ref(false)

const toggleTheme = () => {
  isDark.value = !isDark.value
  document.documentElement.classList.toggle('dark', isDark.value)
  localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
}

onMounted(() => {
  const saved = localStorage.getItem('theme')
  if (saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    isDark.value = true
    document.documentElement.classList.add('dark')
  }
})

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
    'risk-monitor': '隐患舆情监测',
    'ai-warning': '安消应AI预警',
    detail: '专题分析',
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
          <Icon icon="mdi:menu-open" :width="20" v-if="!isCollapsed" />
          <Icon icon="mdi:menu" :width="20" v-else />
        </button>
      </div>
      <nav class="sidebar-nav">
        <el-menu
          :default-active="route.path"
          class="sidebar-menu"
          :collapse="isCollapsed"
          router
          @select="handleSelect"
        >
          <el-menu-item index="/home">
            <el-icon><Icon icon="mdi:home" /></el-icon>
            <span>首页</span>
          </el-menu-item>
          <el-menu-item index="/news">
            <el-icon><Icon icon="mdi:newspaper-variant-outline" /></el-icon>
            <span>石楼动态资讯</span>
          </el-menu-item>
          <el-menu-item index="/risk-monitor">
            <el-icon><Icon icon="mdi:alert-outline" /></el-icon>
            <span>隐患舆情监测</span>
          </el-menu-item>
          <el-menu-item index="/ai-warning">
            <el-icon><Icon icon="mdi:robot" /></el-icon>
            <span>安消应AI预警</span>
          </el-menu-item>
        </el-menu>
      </nav>
    </aside>

    <!-- 右侧主内容区 -->
    <main class="layout-main">
      <header class="main-header">
        <div class="breadcrumb">首页 / {{ breadcrumb }}</div>
        <div class="header-right">
          <div class="user-info">值班员：管理员</div>
          <button class="theme-toggle-btn" @click="toggleTheme" :title="isDark ? '切换浅色模式' : '切换深色模式'">
            <Icon :icon="isDark ? 'mdi:white-balance-sunny' : 'mdi:weather-night'" :width="18" />
          </button>
        </div>
      </header>
      <div class="main-content">
        <el-config-provider :locale="zhCn">
          <router-view />
        </el-config-provider>
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
  color: var(--text-primary);
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
  background: var(--text-inverse);
}

.sidebar-nav {
  flex: 1;
  overflow-y: auto;
}

.sidebar-menu {
  border-right: none !important;
  --el-menu-bg-color: var(--sidebar-bg);
  --el-menu-text-color: var(--sidebar-text);
  --el-menu-active-color: var(--sidebar-active);
  --el-menu-hover-bg-color: var(--sidebar-hover-bg);
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

.header-right {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.theme-toggle-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: 1px solid var(--border-default);
  border-radius: var(--radius-sm);
  background: var(--fill-secondary);
  color: var(--text-secondary);
  cursor: pointer;
  transition: background 0.15s, color 0.15s, border-color 0.15s;
  flex-shrink: 0;
}

.theme-toggle-btn:hover {
  background: var(--fill-hover);
  color: var(--color-primary);
  border-color: var(--color-primary);
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