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
  {
    path: '/personnel-supervision',
    name: 'PersonnelSupervision',
    component: () => import('@/views/PersonnelSupervision.vue'),
  },
  {
    path: '/personnel-supervision/detail',
    name: 'PersonnelSupervisionDetail',
    component: () => import('@/views/PersonnelSupervisionDetail.vue'),
  },
  {
    path: '/personnel-supervision/detail/:id',
    name: 'PersonnelSupervisionItem',
    component: () => import('@/views/PersonnelSupervisionItem.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router