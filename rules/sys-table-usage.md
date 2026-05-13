# SysTable 系统表格组件

## 概述

`SysTable` 是项目统一的表格+分页组件，封装 `Element Plus el-table` + `el-pagination`，所有样式引用 `src/style.css` 中定义的设计令牌，确保浅色/深色模式一致性和可维护性。

**组件目标：**
- 项目中所有表格优先使用 `SysTable`，而非直接使用 `el-table` / `el-pagination`
- 严格通过设计令牌管理颜色、间距、圆角、字号，禁止硬编码
- 支持自定义列插槽、排序、分页、加载、空状态等完整配置

---

## 快速开始

```vue
<script setup>
import SysTable from '@/components/SysTable.vue'
import { ref } from 'vue'

const tableData = ref([
  { id: 1, name: '张三', status: '已读' },
  { id: 2, name: '李四', status: '未读' },
])

const columns = [
  { prop: 'name', label: '姓名', width: 120 },
  { prop: 'status', label: '状态', width: 100 },
]

const currentPage = ref(1)
const pageSize = ref(10)
</script>

<template>
  <!-- 基础表格 -->
  <SysTable :data="tableData" :columns="columns" />

  <!-- 带分页的表格 -->
  <SysTable
    :data="tableData"
    :columns="columns"
    :pagination="true"
    :total="100"
    v-model:current-page="currentPage"
    v-model:page-size="pageSize"
    @current-change="handlePageChange"
    @size-change="handleSizeChange"
  />
</template>
```

---

## Props

| Prop | 类型 | 默认值 | 必填 | 说明 |
|------|------|--------|------|------|
| `data` | `Array` | `[]` | 否 | 表格数据 |
| `columns` | `Array` | `[]` | 否 | 列配置，见 [columns 配置格式](#columns-配置格式) |
| `stripe` | `Boolean` | `false` | 否 | 是否显示斑马纹 |
| `border` | `Boolean` | `true` | 否 | 是否显示纵向边框 |
| `maxHeight` | `String \| Number` | `undefined` | 否 | 表格最大高度（超出滚动） |
| `height` | `String \| Number` | `undefined` | 否 | 表格固定高度 |
| `showHeader` | `Boolean` | `true` | 否 | 是否显示表头 |
| `emptyText` | `String` | `'暂无数据'` | 否 | 空数据提示文字 |
| `loading` | `Boolean` | `false` | 否 | 是否显示加载遮罩 |
| `rowKey` | `String` | `'id'` | 否 | 行数据唯一键名 |
| `pagination` | `Boolean \| Object` | `false` | 否 | 分页配置：`true` 使用默认配置；Object 可自定义 `{ pageSize, layout, pageSizes }` |
| `total` | `Number` | `0` | 否 | 数据总数（分页用） |
| `currentPage` | `Number` | `1` | 否 | 当前页码（支持 v-model） |
| `pageSize` | `Number` | `10` | 否 | 每页条数（支持 v-model） |

### Events

| 事件 | 参数 | 说明 |
|------|------|------|
| `current-change` | `page: Number` | 页码变化时触发 |
| `size-change` | `size: Number` | 每页条数变化时触发 |
| `sort-change` | `sortInfo: Object` | 排序条件变化时触发 |
| `row-click` | `row, column, event` | 行点击时触发 |
| `selection-change` | `selection: Array` | 多选变化时触发 |
| `update:currentPage` | `page: Number` | v-model:current-page 更新 |
| `update:pageSize` | `size: Number` | v-model:page-size 更新 |

### Slots

| 插槽名 | 作用域 | 说明 |
|--------|--------|------|
| 默认插槽 | — | 用于完全自定义表格内容（替代 columns 配置） |
| 具名插槽（列名） | `{ row, column, index }` | 自定义列内容，插槽名由 `columns[i].slot` 指定 |
| `append` | — | 表格最后一行之后插入的内容 |
| `empty` | — | 空数据自定义内容（覆盖默认空状态） |

---

## columns 配置格式

| 字段 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `prop` | `String` | — | 列字段名（同时作为 key，建议必填） |
| `label` | `String` | — | 列标题 |
| `width` | `String \| Number` | — | 列宽 |
| `minWidth` | `String \| Number` | — | 最小列宽 |
| `align` | `String` | `'left'` | 对齐方式：`'left'` / `'center'` / `'right'` |
| `fixed` | `Boolean \| String` | — | 固定列：`true` / `'left'` / `'right'` |
| `sortable` | `Boolean \| String` | — | 是否可排序：`true` / `'custom'` |
| `formatter` | `Function` | — | 格式化函数 `(row, column, cellValue, index) => VNode \| string` |
| `slot` | `String` | — | 自定义插槽名称，开启后需使用 `<template #slotName="{ row }">` 渲染 |
| `showOverflowTooltip` | `Boolean` | — | 内容超出时是否显示 tooltip |

---

## 设计令牌映射

所有样式均通过 CSS 自定义属性引用 `src/style.css` 中的设计令牌，无硬编码值。

### 表格令牌

| CSS 变量 | 令牌来源 | 说明 |
|----------|----------|------|
| `--el-table-border-color` | `--border-default` | 表格边框颜色 |
| `--el-table-row-hover-bg-color` | `--fill-hover` | 行悬停背景色 |
| `--el-table-header-bg-color` | `--fill-surface` | 表头背景色 |
| `--el-table-header-text-color` | `--text-primary` | 表头文字颜色 |
| `--el-table-text-color` | `--text-secondary` | 表格文字颜色 |
| `--el-table-tr-bg-color` | `--fill-surface` | 行背景色 |
| `--el-fill-color-lighter` | `--fill-secondary` | 次要填充色（斑马纹等） |
| `--el-font-size-base` | `--font-size-small` | 表格字号 |

### 表头样式令牌

| CSS 属性 | 令牌值 | 说明 |
|----------|--------|------|
| `font-weight` | `var(--font-weight-medium)` | 表头字重 |
| `font-size` | `var(--font-size-small)` | 表头字号 |

### 排序图标令牌

| 排序方向 | CSS 属性 | 令牌值 |
|----------|----------|--------|
| 升序 | `border-bottom-color` | `var(--color-primary)` |
| 降序 | `border-top-color` | `var(--color-primary)` |

### 加载遮罩令牌

| CSS 属性 | 令牌值 |
|----------|--------|
| `background-color` | `var(--fill-mask)` |

### 空状态令牌

| CSS 属性 | 令牌值 | 说明 |
|----------|--------|------|
| `padding` | `var(--spacing-lg) 0` | 空状态容器内边距 |
| `color` | `var(--text-muted)` | 空状态文字颜色 |
| `font-size` | `var(--font-size-small)` | 空状态字号 |

### 分页令牌

| CSS 变量 | 令牌来源 | 说明 |
|----------|----------|------|
| `--el-pagination-button-bg-color` | `--fill-secondary` | 分页按钮背景 |
| `--el-pagination-hover-color` | `--color-primary` | 分页 hover 颜色 |
| `--el-pagination-button-color` | `--text-primary` | 分页按钮文字 |
| `--el-pagination-text-color` | `--text-secondary` | 分页次要文字 |
| `--el-pagination-border-radius` | `--radius-sm` | 分页圆角 |
| `--el-pagination-font-size` | `--font-size-xs` | 分页字号 |
| `--el-color-primary` | `--color-primary` | 分页激活色 |

### 表格边框圆角

| CSS 属性 | 令牌值 |
|----------|--------|
| `border-radius` | `var(--radius-md)` |

### 分页容器令牌

| CSS 属性 | 令牌值 | 说明 |
|----------|--------|------|
| `padding` | `var(--spacing-md) 0` | 分页区域上下间距 |
| `justify-content` | `flex-end` | 分页右对齐 |

---

## 使用场景与示例

### 1. 基础表格

```vue
<SysTable :data="list" :columns="columns" />
```

### 2. 带分页表格

```vue
<script setup>
const currentPage = ref(1)
const pageSize = ref(10)

function handlePageChange(page) {
  currentPage.value = page
  fetchData()
}

function handleSizeChange(size) {
  pageSize.value = size
  currentPage.value = 1
  fetchData()
}
</script>

<template>
  <SysTable
    :data="list"
    :columns="columns"
    :pagination="true"
    :total="total"
    v-model:current-page="currentPage"
    v-model:page-size="pageSize"
    @current-change="handlePageChange"
    @size-change="handleSizeChange"
  />
</template>
```

### 3. 自定义分页配置

```vue
<SysTable
  :data="list"
  :columns="columns"
  :pagination="{ pageSize: 20, layout: 'total, prev, pager, next', pageSizes: [20, 50, 100] }"
  :total="total"
/>
```

### 4. 自定义列插槽

```vue
<script setup>
const columns = [
  { prop: 'name', label: '姓名', width: 120 },
  { prop: 'status', label: '状态', width: 100, slot: 'status' },
  { prop: 'action', label: '操作', width: 150, slot: 'action', align: 'center' },
]
</script>

<template>
  <SysTable :data="list" :columns="columns">
    <template #status="{ row }">
      <el-tag :type="row.status === '已读' ? 'success' : 'danger'" size="small">
        {{ row.status }}
      </el-tag>
    </template>
    <template #action="{ row }">
      <SysButton type="primary" variant="ghost" size="small" @click="handleView(row)">
        查看
      </SysButton>
    </template>
  </SysTable>
</template>
```

### 5. 排序表格

```vue
<script setup>
const columns = [
  { prop: 'name', label: '姓名' },
  { prop: 'date', label: '日期', sortable: true },
  { prop: 'count', label: '数量', sortable: 'custom' },
]

function handleSortChange({ prop, order }) {
  // order: 'ascending' | 'descending' | null
  console.log('排序字段:', prop, '排序方向:', order)
}
</script>

<template>
  <SysTable
    :data="list"
    :columns="columns"
    @sort-change="handleSortChange"
  />
</template>
```

### 6. 加载状态

```vue
<SysTable
  :data="list"
  :columns="columns"
  :loading="isLoading"
  :pagination="true"
  :total="total"
/>
```

### 7. 自定义空状态

```vue
<SysTable :data="[]" :columns="columns">
  <template #empty>
    <div class="custom-empty">
      <el-icon :size="48"><FolderOpened /></el-icon>
      <p>暂无数据，请调整筛选条件</p>
    </div>
  </template>
</SysTable>
```

### 8. 斑马纹 + 固定高度

```vue
<SysTable
  :data="list"
  :columns="columns"
  stripe
  max-height="400"
/>
```

---

## 布局约定

### 在栅格中使用

```vue
<el-row :gutter="16">
  <el-col :span="24">
    <SysTable
      :data="list"
      :columns="columns"
      :pagination="true"
      :total="total"
    />
  </el-col>
</el-row>
```

> `SysTable` 宽度默认 `100%`，自动撑满父容器，无需额外设置宽度。

---

## 何时使用

| 场景 | 推荐用法 |
|------|----------|
| 通用数据列表展示 | `<SysTable :data="list" :columns="columns" />` |
| 带分页的列表 | `<SysTable :pagination="true" :total="total" ... />` |
| 需要列自定义渲染 | `<template #slotName="{ row }">...` |
| 排序表格 | `columns` 中设 `sortable: true`，监听 `@sort-change` |
| 加载中状态 | `:loading="true"` |
| 空数据提示 | `emptyText="自定义文字"` 或 `#empty` 插槽 |
| 行点击跳转 | 监听 `@row-click` 事件 |

---

## 禁止事项

1. **禁止** 在页面中直接使用 `el-table` / `el-pagination`，请使用 `SysTable`
2. **禁止** 在业务代码中覆盖 `SysTable` 内部样式（如 `.sys-table` / `.sys-table-pagination`）
3. **禁止** 硬编码颜色值（如 `#D3D3D3`），应通过修改 `src/style.css` 令牌变量统一调整
4. **禁止** 硬编码字号、间距、圆角，必须使用设计令牌变量

---

## 相关文件

- 组件源文件：`src/components/SysTable.vue`
- 设计令牌定义：`src/style.css`
- 全局表格分页令牌覆盖：`src/style.css`（el-table / el-pagination 全局样式块）
- 样式规范：`rules/style-standards.md`
- 布局规范：`rules/layout_standards.md`
- 编码规范：`rules/coding-standards.md`