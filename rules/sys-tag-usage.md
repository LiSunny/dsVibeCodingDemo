# SysTag 语义标签组件

## 概述

`SysTag` 是项目统一的语义标签组件，用于表格状态标记、剩余天数标签、风险等级标识等场景。所有颜色引用 `src/style.css` 中定义的设计令牌，确保浅色/深色模式一致性和可维护性。

**组件目标：**
- 项目中状态标签、天数标签等优先使用 `SysTag`
- 严格通过设计令牌管理颜色、间距、圆角，禁止硬编码
- 提供 `danger` / `warning` / `success` / `info` / `primary` / `default` 六种语义类型，覆盖常见业务场景
- 支持 `solid`（实心）和 `outline`（线框）两种样式变体

---

## 快速开始

```vue
<script setup>
import SysTag from '@/components/SysTag.vue'
</script>

<template>
  <!-- 超期、危险状态 -->
  <SysTag type="danger">超期2天</SysTag>

  <!-- 今日到期、警告状态 -->
  <SysTag type="warning">今日到期</SysTag>

  <!-- 已整改、成功状态 -->
  <SysTag type="success">已整改</SysTag>

  <!-- 中性信息 -->
  <SysTag type="info">备选方案</SysTag>

  <!-- 强调性标签 -->
  <SysTag type="primary">重点监控</SysTag>

  <!-- 普通剩余天数 -->
  <SysTag type="default">剩余3天</SysTag>

  <!-- 迷你尺寸 -->
  <SysTag type="danger" size="mini">超期5天</SysTag>

  <!-- 线框样式 -->
  <SysTag type="danger" variant="outline">高风险</SysTag>
  <SysTag type="warning" variant="outline">中风险</SysTag>
</template>
```

---

## Props

| Prop | 类型 | 默认值 | 必填 | 说明 |
|------|------|--------|------|------|
| `type` | `String` | `'default'` | 否 | 语义类型，可选：`'danger'` / `'warning'` / `'success'` / `'info'` / `'primary'` / `'default'` |
| `size` | `String` | `'small'` | 否 | 尺寸，可选：`'small'` / `'mini'` |
| `variant` | `String` | `'solid'` | 否 | 样式变体，可选：`'solid'`（实心）/ `'outline'`（线框） |

### 插槽

| 插槽 | 说明 |
|------|------|
| `default` | 标签文本内容 |

---

## 语义类型与设计令牌映射

### 实心样式（`variant="solid"`，默认）

| type | 文字色令牌 | 背景色令牌 | 适用场景 |
|------|-----------|-----------|---------|
| `danger` | `--color-danger` | `--color-danger-bg` | 超期、高风险、严重、删除 |
| `warning` | `--color-warning` | `--color-warning-bg` | 今日到期、需督办、注意 |
| `success` | `--color-success` | `--color-success-bg` | 已整改、已完成、通过 |
| `info` | `--color-info` | `--color-info-bg` | 中性信息、备注、已处理 |
| `primary` | `--color-primary` | `--color-primary-bg` | 重点监控、强调性内容 |
| `default` | `--text-secondary` | `--fill-secondary` | 普通状态、正常剩余天数 |

### 线框样式（`variant="outline"`）

| type | 文字色令牌 | 背景色 | 边框色令牌 | 适用场景 |
|------|-----------|--------|-----------|---------|
| `danger` | `--color-danger` | 透明 | `--color-danger-border` | 风险等级标记、标签组 |
| `warning` | `--color-warning` | 透明 | `--color-warning-border` | 中风险标记、提示标签 |
| `success` | `--color-success` | 透明 | `--color-success-border` | 状态筛选、分类标记 |
| `info` | `--color-info` | 透明 | `--color-info-border` | 信息分类、低优先级标签 |
| `primary` | `--color-primary` | 透明 | `--color-info-border` | 重点标签、强调性分类 |
| `default` | `--text-secondary` | 透明 | `--border-primary` | 普通分类、次要标签 |

> 所有令牌在 `html.dark` 下自动切换为深色主题对应值，无需额外适配。

---

## 尺寸

| 尺寸 | 内边距 | 字号 | 圆角 | 适用场景 |
|------|--------|------|------|----------|
| `small` | `2px 8px` | `--font-size-xs` | `--radius-sm` | 表格单元格内标签 |
| `mini` | `1px 6px` | `--font-size-xs` | `--radius-sm` | 紧凑表格、内联标签 |

```vue
<SysTag type="danger" size="small">超期</SysTag>
<SysTag type="danger" size="mini">超期</SysTag>
```

---

## 使用场景

### 1. 剩余天数标签

```vue
<script setup>
const getTagType = (days) => {
  if (days < 0) return 'danger'
  if (days === 0) return 'warning'
  return 'default'
}
const getTagText = (days) => {
  if (days < 0) return `超期${Math.abs(days)}天`
  if (days === 0) return '今日到期'
  return `剩余${days}天`
}
</script>

<template>
  <SysTag :type="getTagType(row.remainDays)">
    {{ getTagText(row.remainDays) }}
  </SysTag>
</template>
```

### 2. 状态标签

```vue
<SysTag type="success">已整改</SysTag>
<SysTag type="warning">未整改</SysTag>
<SysTag type="danger">超期</SysTag>
```

### 3. 风险等级

```vue
<!-- 实心样式 -->
<SysTag type="danger">高风险</SysTag>
<SysTag type="warning">中风险</SysTag>
<SysTag type="info">低风险</SysTag>

<!-- 线框样式 - 适合在方框内突出风险等级 -->
<SysTag type="danger" variant="outline">高风险</SysTag>
<SysTag type="warning" variant="outline">中风险</SysTag>
<SysTag type="info" variant="outline">低风险</SysTag>
```

### 4. 线框标签混合使用

```vue
<!-- 同一行内实心 + 线框标签组合 -->
<div class="tags-row">
  <SysTag type="danger">超期</SysTag>
  <SysTag type="info" variant="outline">待复核</SysTag>
  <SysTag type="default" variant="outline">3天前</SysTag>
</div>
```

---

## 禁止事项

1. **禁止** 硬编码颜色值（如 `#EF4444`），应通过修改 `src/style.css` 令牌变量统一调整
2. **禁止** 在业务代码中覆盖 `SysTag` 自身样式
3. **禁止** 使用不在 `validator` 范围内的 type 值
4. **禁止** 使用不在 `validator` 范围内的 variant 值

---

## 相关文件

- 组件源文件：`src/components/SysTag.vue`
- 设计令牌定义：`src/style.css`
- 样式规范：`rules/style-standards.md`