# 筛选栏 (Filter Bar) 实现规范

> 参考文件: `src/views/NewsCenter.vue` → 通知列表 筛选栏
> 适用场景: 所有表格列表区域的搜索 + 筛选 + 操作按钮区

---

## 一、标准结构

筛选栏必须使用以下两栏分区结构：

```html
<div class="filter-bar">
  <div class="filter-bar-left">
    <!-- 搜索框 -->
    <!-- 下拉筛选器 + label -->
    <!-- 查询按钮 -->
    <!-- 重置按钮 -->
  </div>
  <div class="filter-bar-right">
    <!-- 操作按钮（导出等） -->
  </div>
</div>
```

| 层级 | 元素 | 说明 |
|------|------|------|
| 1 | `.filter-bar` | 筛选栏容器，flex 两端对齐，左筛选 + 右操作 |
| 2 | `.filter-bar-left` | 左侧筛选区，flex 横向排列，gap 间距 |
| 2 | `.filter-bar-right` | 右侧操作区，flex 横向排列 |

---

## 二、CSS 样式

使用项目设计 Token，禁止硬编码颜色/字号/间距值：

```css
/* ==================== 筛选栏 ==================== */
.filter-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-md);
  background: var(--fill-surface);
  border-radius: var(--radius-md);
  border: 1px solid var(--border-default);
  margin-bottom: var(--spacing-md);
}

.filter-bar-left {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.filter-bar-right {
  display: flex;
  align-items: center;
}
```

---

## 三、筛选控件

### 3.1 搜索输入框

```vue
<el-input
  v-model="searchKeyword"
  placeholder="搜索关键词"
  clearable
  :prefix-icon="Search"
  class="search-input"
/>
```

```css
.search-input {
  width: 200px;
}
```

### 3.2 筛选标签

每个下拉筛选器前必须带 label：

```vue
<span class="filter-label">发布人：</span>
<el-select
  v-model="publisherFilter"
  placeholder="全部"
  clearable
  class="publisher-select"
>
  <el-option
    v-for="pub in publisherOptions"
    :key="pub"
    :label="pub"
    :value="pub"
  />
</el-select>
```

```css
.filter-label {
  font-size: var(--font-size-small);
  color: var(--text-secondary);
  font-weight: var(--font-weight-medium);
  white-space: nowrap;
}

.publisher-select {
  width: 140px;
}
```

### 3.3 查询 / 重置按钮

查询和重置按钮使用 `SysButton`，紧跟在筛选控件之后：

```vue
<!-- 查询按钮 -->
<SysButton type="primary" @click="handleSearch">查询</SysButton>

<!-- 重置按钮 -->
<SysButton type="default" variant="ghost" @click="handleReset">重置</SysButton>
```

---

## 四、右侧操作区

右侧放置与筛选无关的操作按钮，如导出、批量操作等：

```vue
<div class="filter-bar-right">
  <SysButton type="default" :icon="Download" @click="handleExport">
    导出Excel
  </SysButton>
</div>
```

无操作按钮时可省略 `.filter-bar-right` 区域。

---

## 五、逻辑实现

### 5.1 状态定义

```js
// 搜索关键字
const searchKeyword = ref('')

// 下拉筛选值
const publisherFilter = ref('')

// 筛选选项
const publisherOptions = computed(() => {
  const set = new Set(rawList.value.map(n => n.publisher))
  return Array.from(set)
})
```

### 5.2 查询 / 重置

```js
// 查询按钮
const handleSearch = () => {
  currentPage.value = 1
}

// 重置筛选
const handleReset = () => {
  searchKeyword.value = ''
  publisherFilter.value = ''
  currentPage.value = 1
}
```

### 5.3 筛选/搜索变更时重置页码

```js
// 搜索/筛选变更时重置到第一页
watch([searchKeyword, publisherFilter], () => {
  currentPage.value = 1
})
```

---

## 六、常见模式速查

### 完整模式（搜索 + 多筛选 + 查询/重置 + 操作区）

```vue
<div class="filter-bar">
  <div class="filter-bar-left">
    <el-input v-model="searchKeyword" placeholder="搜索标题" clearable :prefix-icon="Search" class="search-input" />
    <span class="filter-label">状态：</span>
    <el-select v-model="statusFilter" placeholder="全部" clearable class="filter-select">
      <el-option v-for="opt in statusOptions" :key="opt.value" :label="opt.label" :value="opt.value" />
    </el-select>
    <span class="filter-label">类型：</span>
    <el-select v-model="typeFilter" placeholder="全部" clearable class="filter-select">
      <el-option v-for="opt in typeOptions" :key="opt.value" :label="opt.label" :value="opt.value" />
    </el-select>
    <SysButton type="primary" @click="handleSearch">查询</SysButton>
    <SysButton type="default" variant="ghost" @click="handleReset">重置</SysButton>
  </div>
  <div class="filter-bar-right">
    <SysButton type="default" :icon="Download" @click="handleExport">导出Excel</SysButton>
  </div>
</div>
```

### 简化模式（仅筛选 + 查询/重置，无搜索无操作区）

```vue
<div class="filter-bar">
  <div class="filter-bar-left">
    <span class="filter-label">状态：</span>
    <el-select v-model="statusFilter" placeholder="全部" clearable class="filter-select">
      <el-option v-for="opt in statusOptions" :key="opt.value" :label="opt.label" :value="opt.value" />
    </el-select>
    <SysButton type="primary" @click="handleSearch">查询</SysButton>
    <SysButton type="default" variant="ghost" @click="handleReset">重置</SysButton>
  </div>
</div>
```

### 极简模式（仅筛选，实时过滤，无查询/重置）

当筛选控件 ≤ 2 个且数据量不大时，可省略查询/重置按钮，采用实时过滤：

```vue
<div class="filter-bar">
  <div class="filter-bar-left">
    <span class="filter-label">状态：</span>
    <el-select v-model="statusFilter" placeholder="全部" clearable class="filter-select" @change="clearPage">
      <el-option v-for="opt in statusOptions" :key="opt.value" :label="opt.label" :value="opt.value" />
    </el-select>
  </div>
</div>
```

```js
const clearPage = () => { currentPage.value = 1 }
```

---

## 七、反模式（禁止）

以下写法**禁止**使用：

### 7.1 筛选栏与标题行混排

```html
<!-- ❌ 错误：筛选控件放在 section-header 内，与标题同行 -->
<div class="section-header">
  <h3 class="section-title">列表标题</h3>
  <div class="section-header-actions">
    <el-select v-model="statusFilter">...</el-select>
  </div>
</div>
```

```html
<!-- ✅ 正确：筛选栏独立于标题行 -->
<div class="section-header">
  <h3 class="section-title">列表标题</h3>
</div>
<div class="filter-bar">
  <div class="filter-bar-left">
    <el-select v-model="statusFilter">...</el-select>
  </div>
</div>
```

### 7.2 缺少 filter-bar-left / filter-bar-right 分区

```html
<!-- ❌ 错误：筛选控件直接放在 filter-bar 下，无左右分区 -->
<div class="filter-bar">
  <span class="filter-label">状态：</span>
  <el-select v-model="statusFilter">...</el-select>
</div>
```

```html
<!-- ✅ 正确：必须有 filter-bar-left 包裹 -->
<div class="filter-bar">
  <div class="filter-bar-left">
    <span class="filter-label">状态：</span>
    <el-select v-model="statusFilter">...</el-select>
  </div>
</div>
```

### 7.3 使用内联 style 控制宽度

```html
<!-- ❌ 错误：使用内联 style -->
<el-select v-model="statusFilter" size="small" style="width: 120px">...</el-select>
```

```html
<!-- ✅ 正确：使用 class 控制宽度 -->
<el-select v-model="statusFilter" class="filter-select">...</el-select>
```

```css
.filter-select {
  width: 140px;
}
```

### 7.4 筛选控件与标题行共用同一 section-header

```html
<!-- ❌ 错误 -->
<div class="section-header">
  <h3 class="section-title">列表标题</h3>
  <div class="section-header-actions">
    <el-input v-model="searchKeyword" ... />
    <el-select v-model="statusFilter" ... />
  </div>
</div>
```

筛选控件必须独立放在 `.filter-bar` 中，不要与标题行 `.section-header` 混用。