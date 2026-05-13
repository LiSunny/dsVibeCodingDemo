import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    redirect: '/home',
  },
  {
    path: '/home',
    name: 'Home',
    component: () => import('@/views/Home.vue'),
  },
  {
    path: '/news',
    name: 'NewsCenter',
    component: () => import('@/views/NewsCenter.vue'),
  },
  {
    path: '/news/:id',
    name: 'NewsDetail',
    component: () => import('@/views/NewsDetail.vue'),
  },
  {
    path: '/risk-monitor',
    name: 'RiskMonitor',
    component: () => import('@/views/RiskMonitor.vue'),
  },
  {
    path: '/risk-monitor/detail',
    name: 'RiskMonitorDetail',
    component: () => import('@/views/RiskMonitorDetail.vue'),
  },
  {
    path: '/risk-monitor/detail/:id',
    name: 'RiskMonitorItem',
    component: () => import('@/views/RiskMonitorItem.vue'),
  },
  {
    path: '/ai-warning',
    name: 'AiWarning',
    component: () => import('@/views/AiWarning.vue'),
  },
  {
    path: '/ai-warning/detail',
    name: 'AiWarningDetail',
    component: () => import('@/views/AiWarningDetail.vue'),
  },
  {
    path: '/ai-warning/detail/:id',
    name: 'AiWarningItem',
    component: () => import('@/views/AiWarningItem.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router