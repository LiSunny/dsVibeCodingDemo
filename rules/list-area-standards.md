# 列表区域 (List Area) 实现规范

> 参考文件: `src/views/NewsCenter.vue` → 通知列表
> 适用场景: 所有二级专题页面的标准列表区域、一级页面的核心列表区域

---

## 一、区域结构

列表区域必须使用以下标准结构（标题独立行 + 筛选栏独立行）：

```html
<div class="section">
  <h3 class="section-title">列表标题</h3>

  <!-- 筛选栏（独立行） → 详见 rules/filter-bar-standards.md -->
  <div class="filter-bar">
    <div class="filter-bar-left">
      <!-- 搜索框 / 下拉筛选 / 查询 / 重置 -->
    </div>
    <div class="filter-bar-right">
      <!-- 操作按钮（导出等） -->
    </div>
  </div>

  <!-- 空状态 -->
  <div v-if="filteredData.length === 0" class="empty-state">
    <el-empty description="暂无匹配的数据" />
  </div>

  <!-- 列表表格 -->
  <template v-else>
    <SysTable
      :data="pagedData"
      :columns="columns"
      stripe
      :pagination="{ layout: 'total, prev, pager, next', pageSize: pageSize }"
      :total="total"
      v-model:current-page="currentPage"
      :default-sort="{ prop: 'defaultSortProp', order: 'descending' }"
      @sort-change="handleTableSort"
    >
      <!-- 列插槽 -->
    </SysTable>
  </template>
</div>
```

| 层级 | 元素 | 说明 |
|------|------|------|
| 1 | `.section` | 区域容器，提供底部间距 |
| 2 | `.section-title` | 列表标题，左侧蓝色强调条 |
| 2 | `.filter-bar` | **筛选栏独立行**，左右分区布局，具体规范见 `filter-bar-standards.md` |
| 2 | `.empty-state` | 空状态容器，数据为空时展示 |
| 2 | `SysTable` | 系统表格组件，承载列表数据 |

---

## 二、标题样式规范

与统计看板区域保持一致的标题样式：

```css
.section {
  margin-bottom: var(--spacing-lg);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-md);
}

.section-header-actions {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.section-title {
  font-size: var(--font-size-h2);        /* 20px */
  font-weight: var(--font-weight-bold);  /* 800 */
  color: var(--text-primary);
  margin: 0 0 var(--spacing-md) 0;
  padding-left: var(--spacing-md);       /* 16px */
  border-left: 4px solid var(--color-primary);  /* 左侧蓝色强调条 */
}
```

---

## 三、搜索与筛选

> **筛选栏已独立为专项规范**，详见 **[rules/filter-bar-standards.md](./filter-bar-standards.md)**。
>
> 搜索框、下拉筛选器、查询/重置按钮、筛选栏布局、CSS 样式与 JS 逻辑均以该规范为准。

列表区域只保留以下与筛选联动的逻辑：

### 3.1 搜索/筛选变更时重置页码

```js
// 方式一：watch 自动重置
watch([searchKeyword, filterA, filterB], () => {
  currentPage.value = 1
})
```

```js
// 方式二：查询按钮手动重置
const handleSearch = () => {
  currentPage.value = 1
}

const handleReset = () => {
  searchKeyword.value = ''
  filterA.value = ''
  filterB.value = ''
  currentPage.value = 1
}
```

### 3.2 筛选后的数据计算

```js
const filteredData = computed(() => {
  let list = [...rawList.value]
  // 搜索过滤
  if (searchKeyword.value.trim()) {
    const kw = searchKeyword.value.trim().toLowerCase()
    list = list.filter(item => item.title.toLowerCase().includes(kw))
  }
  // 下拉筛选过滤
  if (filterA.value) {
    list = list.filter(item => item.field === filterA.value)
  }
  if (filterB.value) {
    list = list.filter(item => item.field === filterB.value)
  }
  // 排序
  if (tableSort.value.prop && tableSort.value.order) {
    const { prop, order } = tableSort.value
    list.sort((a, b) => {
      const valA = a[prop] ?? 0
      const valB = b[prop] ?? 0
      return order === 'ascending' ? valA - valB : valB - valA
    })
  }
  return list
})
```

---

## 四、分页

### 4.1 分页状态

```js
const currentPage = ref(1)
const pageSize = ref(8)
const total = computed(() => filteredData.value.length)

// 分页数据
const pagedData = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  return filteredData.value.slice(start, start + pageSize.value)
})
```

### 4.2 分页配置

```vue
<SysTable
  :pagination="{ layout: 'total, prev, pager, next', pageSize: pageSize }"
  :total="total"
  v-model:current-page="currentPage"
/>
```

---

## 五、表格排序

### 5.1 排序状态

```js
const tableSort = ref({ prop: 'defaultSortProp', order: 'descending' })

const handleTableSort = ({ prop, order }) => {
  tableSort.value = { prop, order }
}
```

### 5.2 排序逻辑（在过滤中实现）

```js
const filteredData = computed(() => {
  let list = [...rawList.value]
  // 搜索过滤
  if (searchKeyword.value.trim()) {
    const kw = searchKeyword.value.trim().toLowerCase()
    list = list.filter(item => item.title.toLowerCase().includes(kw))
  }
  // 筛选过滤
  if (filter.value) {
    list = list.filter(item => item.field === filter.value)
  }
  // 排序
  if (tableSort.value.prop && tableSort.value.order) {
    const { prop, order } = tableSort.value
    list.sort((a, b) => {
      const valA = a[prop] ?? 0
      const valB = b[prop] ?? 0
      return order === 'ascending' ? valA - valB : valB - valA
    })
  }
  return list
})
```

### 5.3 列定义中声明可排序

```js
const columns = [
  { prop: 'title', label: '通知标题', minWidth: 220, showOverflowTooltip: true },
  { prop: 'publishTime', label: '发布时间', width: 120, sortable: 'custom' },
  { prop: 'count', label: '数量', width: 80, sortable: 'custom', align: 'center' },
  { prop: 'type', label: '类型', width: 80, align: 'center', slot: 'type' },
  { prop: 'actions', label: '操作', width: 160, align: 'center', slot: 'actions', fixed: 'right' },
]
```

---

## 六、空状态

```vue
<div v-if="filteredData.length === 0" class="empty-state">
  <el-empty description="暂无匹配的通知数据" />
</div>
```

```css
.empty-state {
  padding: var(--spacing-lg) 0;
  background: var(--fill-surface);
  border-radius: var(--radius-lg);
}
```

---

## 七、加载状态

所有列表区域必须提供加载骨架屏过渡：

```vue
<template v-if="pageLoading">
  <el-skeleton :rows="5" animated class="skeleton-section" />
  <el-skeleton :rows="8" animated class="skeleton-section" />
</template>

<template v-else>
  <!-- 列表区域内容 -->
</template>
```

```css
.skeleton-section {
  margin-bottom: var(--spacing-lg);
  padding: var(--spacing-lg);
  background: var(--fill-surface);
  border-radius: var(--radius-lg);
}
```

---

## 八、列插槽规范

### 8.1 状态/标签列 — 使用 SysTag

```vue
<template #myField="{ row }">
  <SysTag size="small" :type="getType(row.field)" variant="outline">
    {{ row.field }}
  </SysTag>
</template>
```

### 8.2 百分比/数值列 — 加颜色

```vue
<template #rate="{ row }">
  <span :style="{ color: getRateColor(row.rate), fontWeight: 'var(--font-weight-medium)' }">
    {{ row.rate }}%
  </span>
</template>
```

### 8.3 高危高亮列

```vue
<template #count="{ row }">
  <span :class="{ 'unread-highlight': row.count > threshold }">{{ row.count }}</span>
</template>
```

```css
.unread-highlight {
  color: var(--color-danger);
  font-weight: var(--font-weight-bold);
}
```

### 8.4 操作列 — 使用 SysButton

```vue
<template #actions="{ row }">
  <SysButton type="primary" variant="ghost" size="small" @click="handleDetail(row)">
    详情
  </SysButton>
  <SysButton
    type="danger"
    variant="ghost"
    size="small"
    :disabled="row.count === 0"
    @click="handleUrge(row)"
  >
    催办
  </SysButton>
</template>
```

---

## 九、一级页面简化模式

一级页面的列表通常数据量较小，可以省略分页和搜索筛选：

```html
<div class="section">
  <div class="section-header">
    <h3 class="section-title">最新未改隐患列表（按紧急程度排序）</h3>
    <SysButton type="primary" variant="ghost" @click="goToDetail">
      查看全部历史 →
    </SysButton>
  </div>

  <SysTable
    :data="computedList"
    :columns="columns"
    stripe
    :pagination="false"
  >
    <!-- 列插槽 -->
  </SysTable>
</div>
```

**与二级页面的区别：**
- `:pagination="false"` 直接禁用分页
- 省略搜索框和筛选器
- 省略空状态判断（一级页面数据通常固定存在）

---

## 十、完整示例（二级页面）

参考 `src/views/NewsCenter.vue` 第 3.2 节「通知列表」区域。

### 模板结构

```vue
<template v-if="pageLoading">
  <el-skeleton :rows="8" animated class="skeleton-section" />
</template>

<template v-else>
  <div class="section">
    <h3 class="section-title">列表标题</h3>

    <!-- 筛选栏（独立行） → 详见 rules/filter-bar-standards.md -->
    <div class="filter-bar">
      <div class="filter-bar-left">
        <el-input
          v-model="searchKeyword"
          placeholder="搜索关键词"
          clearable
          :prefix-icon="Search"
          class="search-input"
        />
        <span class="filter-label">筛选：</span>
        <el-select v-model="filterA" placeholder="全部" clearable class="filter-select">
          <el-option v-for="opt in options" :key="opt.value" :label="opt.label" :value="opt.value" />
        </el-select>
        <SysButton type="primary" @click="handleSearch">查询</SysButton>
        <SysButton type="default" variant="ghost" @click="handleReset">重置</SysButton>
      </div>
      <div class="filter-bar-right">
        <SysButton type="default" :icon="Download" @click="handleExport">导出Excel</SysButton>
      </div>
    </div>

    <div v-if="filteredData.length === 0" class="empty-state">
      <el-empty description="暂无匹配的数据" />
    </div>

    <template v-else>
      <SysTable
        :data="pagedData"
        :columns="columns"
        stripe
        :pagination="{ layout: 'total, prev, pager, next', pageSize: pageSize }"
        :total="total"
        v-model:current-page="currentPage"
        :default-sort="{ prop: 'defaultSortProp', order: 'descending' }"
        @sort-change="handleTableSort"
      >
        <!-- 列插槽 -->
      </SysTable>
    </template>
  </div>
</template>
```

---

## 十一、禁止事项

| 禁止项 | 正确做法 |
|-------|---------|
| ❌ 不使用 `.section` 容器 | 必须包裹在 `<div class="section">` 中 |
| ❌ 标题不使用 `.section-title` 样式 | 必须用 `h3.section-title` + 左侧蓝色边框 |
| ❌ 使用 `<h2>` 或其他标签做标题 | 使用 `h3.section-title`，样式驱动外观 |
| ❌ 使用 `.section-card` 自定义容器 | 使用标准 `.section` 类名 |
| ❌ 把筛选栏放在标题行内 | **筛选栏必须独立为 `.filter-bar` 行**，标题行只放标题 |
| ❌ 筛选栏不用 `.filter-bar` 样式 | 筛选栏必须遵循 `filter-bar-standards.md` 规范 |
| ❌ 手写表格 HTML | 使用 `<SysTable>` 组件 |
| ❌ 缺少空状态处理 | 必须提供 `<el-empty>` 空状态占位 |
| ❌ 无骨架屏加载 | 必须提供 `<el-skeleton>` 加载过渡 |
| ❌ 硬编码色值/字号/间距 | 全部使用 CSS 设计令牌 |
| ❌ 使用 emoji 或 el-tag | 标签统一使用 `<SysTag>` 组件 |

---

## 十二、变更记录

| 日期 | 变更内容 |
|------|---------|
| 2026-05-13 | 从 NewsCenter.vue 通知列表提取为标准规范，覆盖二级页面与一级页面两种模式 |
| 2026-05-14 | 筛选栏独立为 `rules/filter-bar-standards.md` 专项规范，`list-area-standards.md` 标题行与筛选栏分离 |
