# 统计看板区域 (Stat Section) 实现规范

> 参考文件: `src/views/NewsCenter.vue` → 综合统计看板
> 适用场景: 所有二级专题页面的综合统计看板区域、一级页面的核心指标看板区域

---

## 一、区域结构

统计看板区域必须使用以下三层结构：

```html
<div class="section">
  <div class="section-header">
    <h3 class="section-title">统计看板标题</h3>
    <!-- 可选：时间筛选器 / 数据范围标签 -->
  </div>
  <el-row :gutter="16" class="stats-row">
    <el-col class="stats-col">
      <StatsCard ... />
    </el-col>
    <el-col class="stats-col">
      <StatsCard ... />
    </el-col>
    <!-- 更多卡片... -->
  </el-row>
</div>
```

| 层级 | 元素 | 说明 |
|------|------|------|
| 1 | `.section` | 区域容器，提供底部间距 |
| 2 | `.section-header` | 标题行，flex 两端对齐（标题 + 筛选器） |
| 2 | `.stats-row` | 卡片行容器，使用 `el-row :gutter="16"` |
| 3 | `.stats-col` | 每个卡片列，使用 `flex: 1` 自动平分宽度 |

---

## 二、标题样式规范

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

.section-title {
  font-size: var(--font-size-h2);        /* 20px */
  font-weight: var(--font-weight-bold);  /* 800 */
  color: var(--text-primary);
  margin: 0 0 var(--spacing-md) 0;
  padding-left: var(--spacing-md);       /* 16px */
  border-left: 4px solid var(--color-primary);  /* 左侧蓝色强调条 */
}
```

**关键点：**
- 标题使用 `h3` 标签但字体为 `--font-size-h2`（20px）
- 左侧必须有 4px 主色调竖线
- 标题文字与筛选器同一行（flex 布局）

---

## 三、卡片布局

### 3.1 基础行

```css
.stats-row {
  margin-bottom: 0;
  display: flex;
}

.stats-col {
  flex: 1;  /* 自动平分，无需指定 :span */
}
```

### 3.2 StatsCard 使用

统计看板统一使用 `StatsCard` 组件的 `type="compact"` 类型，参考 `rules/stat-card-usage.md`。

```vue
<el-row :gutter="16" class="stats-row">
  <!-- 纯数字 + 状态色 -->
  <el-col class="stats-col">
    <StatsCard type="compact" :value="5" label="通知总数" status="primary" />
  </el-col>

  <!-- 纯数字（默认色） -->
  <el-col class="stats-col">
    <StatsCard type="compact" :value="420" label="应读总人次" />
  </el-col>

  <!-- 带进度条 -->
  <el-col class="stats-col">
    <StatsCard type="compact" :value="77.8" label="整体已读率" :progress="77.8" />
  </el-col>

  <!-- 带标签 + 状态色 -->
  <el-col class="stats-col">
    <StatsCard
      type="compact"
      :value="41"
      label="未读总人次"
      status="danger"
      tag="需催办"
      tag-type="danger"
    />
  </el-col>

  <!-- 动态 status 计算 -->
  <el-col class="stats-col">
    <StatsCard
      type="compact"
      :value="stats.feedbackRate + '%'"
      label="反馈完成率"
      :status="stats.feedbackRate >= 80 ? 'success' : stats.feedbackRate >= 60 ? 'warning' : 'danger'"
    />
  </el-col>
</el-row>
```

---

## 四、数据驱动

### 4.1 时间范围映射（二级页面标准模式）

二级页面通过 `timeRange` 选择器切换不同时间范围的统计数据：

```js
// 时间筛选
const timeRange = ref('7d')
const timeRangeOptions = [
  { label: '近7天', value: '7d' },
  { label: '近30天', value: '30d' },
  { label: '全部历史', value: 'all' },
]

// 统计数据映射
const statsDataMap = {
  '7d': { total: 5, readRate: 77.8, /* ... */ },
  '30d': { total: 12, readRate: 80.0, /* ... */ },
  'all': { total: 48, readRate: 88.6, /* ... */ },
}

// 计算属性驱动
const stats = computed(() => {
  if (timeRange.value === 'custom') {
    return statsDataMap['30d'] // 自定义日期默认取近30天
  }
  return statsDataMap[timeRange.value] || statsDataMap['30d']
})
```

### 4.2 一级页面模式（固定数据范围）

一级页面通常有固定的数据范围（如"近7天+超期"），但也建议使用 `computed` 包装，保持一致模式：

```js
const stats = computed(() => ({
  near7NeedFix: 8,
  overdueUnfix: 3,
  fixRate: 62,
  highRiskUnfix: 2,
}))
```

---

## 五、筛选器集成

### 5.1 时间范围选择器（二级页面）

```vue
<div class="section-header">
  <h3 class="section-title">综合统计看板</h3>
  <div class="section-header-filter">
    <el-select v-model="timeRange" class="time-range-select">
      <el-option
        v-for="opt in timeRangeOptions"
        :key="opt.value"
        :label="opt.label"
        :value="opt.value"
      />
    </el-select>
  </div>
</div>
```

### 5.2 数据范围标签（一级页面）

```vue
<div class="section-header">
  <h3 class="section-title">核心指标看板</h3>
  <span class="text-muted" style="font-size: var(--font-size-xs)">
    数据范围：整改期限≤7天 + 超期
  </span>
</div>
```

---

## 六、加载状态

所有统计看板区域必须提供加载骨架屏过渡：

```vue
<template v-if="pageLoading">
  <el-skeleton :rows="5" animated class="skeleton-section" />
  <el-skeleton :rows="8" animated class="skeleton-section" />
</template>

<template v-else>
  <!-- 统计看板内容 -->
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

## 七、完整示例

参考 `src/views/NewsCenter.vue` 第 3.1 节「综合统计看板」区域。

### 模板结构

```vue
<template v-if="pageLoading">
  <el-skeleton :rows="5" animated class="skeleton-section" />
</template>

<template v-else>
  <div class="section">
    <div class="section-header">
      <h3 class="section-title">综合统计看板</h3>
      <div class="section-header-filter">
        <el-select v-model="timeRange" class="time-range-select">
          <el-option
            v-for="opt in timeRangeOptions"
            :key="opt.value"
            :label="opt.label"
            :value="opt.value"
          />
        </el-select>
      </div>
    </div>
    <el-row :gutter="16" class="stats-row">
      <el-col class="stats-col">
        <StatsCard type="compact" :value="stats.total" label="通知总数" status="primary" />
      </el-col>
      <el-col class="stats-col">
        <StatsCard type="compact" :value="stats.readRate" label="整体已读率" :progress="stats.readRate" />
      </el-col>
      <!-- ...更多卡片 -->
    </el-row>
  </div>
</template>
```

---

## 八、禁止事项

| 禁止项 | 正确做法 |
|-------|---------|
| ❌ 不使用 `.section` 容器 | 必须包裹在 `<div class="section">` 中 |
| ❌ 标题不使用 `.section-title` 样式 | 必须用 `h3.section-title` + 左侧蓝色边框 |
| ❌ 使用 `:span="6"` 等固定列宽 | 使用 `.stats-col { flex: 1 }` 自动平分 |
| ❌ 手写统计卡片 HTML | 使用 `<StatsCard type="compact">` 组件 |
| ❌ 硬编码统计数据 | 使用 `computed` + 数据映射模式 |
| ❌ 无加载状态 | 必须提供骨架屏过渡 |
| ❌ 硬编码色值/字号/间距 | 全部使用 CSS 设计令牌 |

---

## 九、变更记录

| 日期 | 变更内容 |
|------|---------|
| 2026-05-13 | 从 NewsCenter.vue 综合统计看板提取为标准规范，覆盖二级页面与一级页面两种模式 |