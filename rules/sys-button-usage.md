# SysButton 系统按钮组件

## 概述

`SysButton` 是项目统一的按钮组件，封装 `Element Plus el-button`，所有样式引用 `src/style.css` 中定义的设计令牌，确保浅色/深色模式一致性和可维护性。

**组件目标：**
- 项目中所有按钮优先使用 `SysButton`，而非直接使用 `el-button`
- 严格通过设计令牌管理颜色、间距、圆角，禁止硬编码
- 支持语义类型、风格变体、图标布局、尺寸等完整配置

---

## 快速开始

```vue
<script setup>
import SysButton from '@/components/SysButton.vue'
import { Search, Plus } from '@element-plus/icons-vue'
</script>

<template>
  <!-- 基础实心主色按钮 -->
  <SysButton type="primary" @click="handleClick">确认</SysButton>

  <!-- 线框按钮 + 左侧图标 -->
  <SysButton type="success" variant="outline" :icon="Search">搜索</SysButton>

  <!-- 幽灵按钮 + 右侧图标 -->
  <SysButton type="warning" variant="ghost" :icon="Plus" icon-position="right">添加</SysButton>

  <!-- 圆形图标按钮 -->
  <SysButton type="primary" :icon="Plus" circle />

  <!-- 小尺寸禁用按钮 -->
  <SysButton type="danger" size="small" disabled>删除</SysButton>
</template>
```

---

## Props

| Prop | 类型 | 默认值 | 必填 | 说明 |
|------|------|--------|------|------|
| `type` | `String` | `'default'` | 否 | 语义类型，可选：`'default'` / `'primary'` / `'success'` / `'warning'` / `'danger'` / `'info'` |
| `variant` | `String` | `'solid'` | 否 | 风格变体，可选：`'solid'`（实心）/ `'outline'`（线框）/ `'ghost'`（幽灵） |
| `size` | `String` | `'default'` | 否 | 尺寸，可选：`'large'` / `'default'` / `'small'` / `'mini'` |
| `icon` | `Object` | `null` | 否 | 图标组件实例（从 `@element-plus/icons-vue` 导入后传入） |
| `iconPosition` | `String` | `'left'` | 否 | 图标位置：`'left'` / `'right'` |
| `disabled` | `Boolean` | `false` | 否 | 是否禁用 |
| `loading` | `Boolean` | `false` | 否 | 是否加载中（显示 loading 动画） |
| `circle` | `Boolean` | `false` | 否 | 是否圆形按钮（仅显示图标，宽高等同） |
| `round` | `Boolean` | `true` | 否 | 是否圆角（默认圆角） |
| `fullWidth` | `Boolean` | `false` | 否 | 是否撑满父容器宽度 |

### Events

| 事件 | 参数 | 说明 |
|------|------|------|
| `click` | `event` | 点击事件，禁用/加载中时不触发 |

---

## 使用场景与示例

### 1. 实心按钮（solid）

用于主要操作，如提交、确认、保存等强调性操作。

```vue
<SysButton type="primary">主要操作</SysButton>
<SysButton type="success">成功操作</SysButton>
<SysButton type="warning">警告操作</SysButton>
<SysButton type="danger">危险操作</SysButton>
<SysButton type="info">信息操作</SysButton>
<SysButton type="default">默认操作</SysButton>
```

### 2. 线框按钮（outline）

用于次要操作，如取消、返回、查看详情等。边框使用语义色，hover 时填充淡背景。

```vue
<SysButton type="primary" variant="outline">次要操作</SysButton>
<SysButton type="danger" variant="outline">取消</SysButton>
<SysButton type="default" variant="outline">返回</SysButton>
```

### 3. 幽灵按钮（ghost）

用于更轻量的操作，无边框无背景，hover 时展示淡背景。

```vue
<SysButton type="primary" variant="ghost">文字链接</SysButton>
<SysButton type="default" variant="ghost">轻量操作</SysButton>
```

### 4. 图标按钮

图标通过 `icon` 属性传递 Element Plus 图标组件实例，位置用 `iconPosition` 控制。

```vue
<script setup>
import { Search, ArrowRight, Plus } from '@element-plus/icons-vue'
</script>

<template>
  <!-- 图标在左（默认） -->
  <SysButton type="primary" :icon="Search">搜索</SysButton>

  <!-- 图标在右 -->
  <SysButton type="success" :icon="ArrowRight" icon-position="right">下一步</SysButton>

  <!-- 圆形图标按钮（仅显示图标，circle=true） -->
  <SysButton type="primary" :icon="Plus" circle />
  <SysButton type="danger" :icon="Delete" circle variant="outline" />
</template>
```

**注意：** `circle=true` 时按钮只显示图标，忽略插槽文字内容。

### 5. 尺寸

| 尺寸 | 内边距 | 字号 | 最小高度 | 适用场景 |
|------|--------|------|----------|----------|
| `large` | `--spacing-sm` `--spacing-lg` | `--font-size-body` | 40px | 表单提交按钮、弹窗确认按钮 |
| `default` | `6px` `--spacing-md` | `--font-size-small` | 32px | 表格操作列、卡片操作 |
| `small` | `--spacing-4` `--spacing-sm` | `--font-size-xs` | 28px | 工具栏、标签行、列表内联操作 |
| `mini` | `--spacing-2` `--spacing-8` | `--font-size-xs` | 24px | 紧凑表格、内联标签操作 |

```vue
<SysButton type="primary" size="large">大按钮</SysButton>
<SysButton type="primary" size="default">默认按钮</SysButton>
<SysButton type="primary" size="small">小按钮</SysButton>
<SysButton type="primary" size="mini">迷你按钮</SysButton>
```

### 6. 状态

```vue
<!-- 加载中 -->
<SysButton type="primary" loading @click="submit">提交中...</SysButton>

<!-- 禁用 -->
<SysButton type="primary" disabled>不可用</SysButton>

<!-- 全宽 -->
<SysButton type="primary" full-width>撑满宽度</SysButton>
```

---

## 设计令牌映射

所有样式均通过 CSS 自定义属性引用 `src/style.css` 中的设计令牌，无硬编码值。

### solid 风格

| CSS 变量 | 令牌来源 | `default` 类型值 | 语义类型值 |
|----------|----------|-------------------|-----------|
| `--btn-bg` | `--fill-secondary` / `--color-*` | `var(--fill-secondary)` | `var(--color-primary)` 等 |
| `--btn-text` | `--text-primary` / `--text-inverse` | `var(--text-primary)` | `var(--text-inverse)` |
| `--btn-border` | 固定值 | `none` | `none` |
| `--btn-hover-brightness` | 固定值 | `0.92` | `0.92` |
| `--btn-active-brightness` | 固定值 | `0.85` | `0.85` |

> **default solid 按钮文字使用 `--text-primary`（深色文案），区别于语义色的 `--text-inverse`（白色文案），确保在浅色背景上可读。**

### outline 风格

| CSS 变量 | 令牌来源 | `default` 类型值 | 语义类型值 |
|----------|----------|-------------------|-----------|
| `--btn-border-color` | `--border-primary` / `--color-*-border` | `var(--border-primary)` | `var(--color-info-border)` 等 |
| `--btn-text` | `--text-primary` / `--color-*` | `var(--text-primary)` | `var(--color-primary)` 等 |
| `--btn-hover-bg` | `--fill-hover` / `--color-*-bg` | `var(--fill-hover)` | `var(--color-info-bg)` 等 |

### ghost 风格

| CSS 变量 | 令牌来源 | `default` 类型值 | 语义类型值 |
|----------|----------|-------------------|-----------|
| `--btn-text` | `--text-primary` / `--color-*` | `var(--text-primary)` | `var(--color-primary)` 等 |
| `--btn-hover-bg` | `--fill-hover` / `--color-*-bg` | `var(--fill-hover)` | `var(--color-info-bg)` 等 |

### 尺寸令牌

| CSS 变量 | 说明 |
|----------|------|
| `--spacing-2` | mini 按钮横向内边距 |
| `--spacing-4` | 图标与文字间距 / small 按钮内边距 |
| `--spacing-8` | mini 按钮左右内边距 |
| `--spacing-sm` | large/small 按钮内边距 |
| `--spacing-md` | default 按钮内边距 |
| `--spacing-lg` | large 按钮左右内边距 |
| `--font-size-xs` | small/mini 按钮字号 |
| `--font-size-small` | default 按钮字号 |
| `--font-size-body` | large 按钮字号 |
| `--radius-sm` | default/small/mini 圆角 |
| `--radius-md` | large 圆角 |

---

## 何时使用

| 场景 | 推荐用法 |
|------|----------|
| 表单主操作按钮 | `<SysButton type="primary" size="large">提交</SysButton>` |
| 弹窗确认/取消 | `<SysButton type="primary">确认</SysButton>` + `<SysButton variant="outline">取消</SysButton>` |
| 表格行操作 | `<SysButton type="primary" variant="ghost" size="small">编辑</SysButton>` |
| 工具栏图标操作 | `<SysButton type="primary" :icon="Plus" size="small" circle />` |
| 危险操作（删除等） | `<SysButton type="danger" size="small">删除</SysButton>` |
| 加载中状态 | `<SysButton type="primary" loading>保存中</SysButton>` |
| 快捷入口导航 | `<SysButton type="default" size="small" @click="navigate">模块名</SysButton>` |

---

## 禁止事项

1. **禁止** 在页面中直接使用 `el-button`，请使用 `SysButton`
2. **禁止** 在业务代码中覆盖 SysButton 自身样式
3. **禁止** 硬编码颜色值（如 `#2563EB`），应通过修改 `src/style.css` 令牌变量统一调整
4. **`circle=true` 时不要传入文字插槽**，圆形按钮仅展示图标

---

## 相关文件

- 组件源文件：`src/components/SysButton.vue`
- 设计令牌定义：`src/style.css`
- 样式规范：`rules/style-standards.md`
- 布局规范：`rules/layout_standards.md`
- 编码规范：`rules/coding-standards.md`