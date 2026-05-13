# PageHeader 通用页面标题组件使用规范

## 组件说明
`PageHeader` 是所有页面标题区域的通用封装，提供标题、副标题、返回按钮、操作区等标准布局。

## 引入
```js
import PageHeader from '@/components/PageHeader.vue'
```

## 基础用法

### 1. 仅标题（字符串）
```vue
<PageHeader title="石楼动态资讯" subtitle="通知下发 → 阅读 → 反馈 → 催办 闭环管理">
  <template #actions>
    <SysButton type="default" variant="outline" :icon="ArrowLeft" @click="router.push('/home')">
      返回一级页面
    </SysButton>
  </template>
</PageHeader>
```

### 2. 带返回按钮
```vue
<PageHeader title="详情" subtitle="通知详情" show-back back-text="返回列表" :back-path="'/news'" />
```

### 3. 自定义标题插槽（复杂标题）
```vue
<PageHeader subtitle="综合风险监控概览">
  <template #title>
    <h2 class="page-header-title">
      隐患舆情监测
      <el-tag size="small" type="warning">实时监测中</el-tag>
    </h2>
  </template>
  <template #actions>
    <SysButton type="primary" :icon="Refresh" @click="refresh">刷新</SysButton>
  </template>
</PageHeader>
```

### 4. 带扩展区（extra 插槽）
```vue
<PageHeader title="通知管理" subtitle="企业通知下发">
  <template #extra>
    <el-tag type="primary">共 {{ total }} 条</el-tag>
  </template>
  <template #actions>
    <SysButton type="primary" :icon="Plus">新建通知</SysButton>
  </template>
</PageHeader>
```

## Props

| Prop | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| title | String | '' | 页面主标题 |
| subtitle | String | '' | 副标题 / 面包屑文字 |
| showBack | Boolean | false | 是否显示返回按钮 |
| backText | String | '返回' | 返回按钮文字 |
| backPath | String | '' | 返回路由路径，为空则调用 `router.back()` |

## Slots

| Slot | 说明 |
|------|------|
| title | 自定义标题区域，替换 `title` prop |
| subtitle | 自定义副标题区域，替换 `subtitle` prop |
| extra | 标题右侧扩展区（标签、统计数字等），位于 left 区域 |
| actions | 最右侧操作按钮区 |

## 约束规则（AI 必须遵守）

1. **所有页面必须使用 PageHeader 组件**作为页面标题区域，禁止在各页面中直接编写 `<div class="page-header">` 裸结构。
2. **`title` 和 `subtitle` 必须通过 prop 传递**，不要使用 `#title` 插槽，除非标题需要嵌入交互元素（如标签、链接等）。
3. **`title` 必须使用二级函数标题的文案规范**：使用 `h2` 样式，文案需完整、准确描述页面功能。
4. **`subtitle` 为可选字段**，用于补充说明页面功能或展示面包屑路径。
5. **返回按钮使用 `showBack` + `backText` + `backPath` 配置**，禁止在 actions 插槽中手写返回按钮。
6. **操作按钮统一放在 `#actions` 插槽中**。
7. **样式不要覆盖 PageHeader 的内部样式**，确需调整时通过组件 props 或 layout tokens 调整。