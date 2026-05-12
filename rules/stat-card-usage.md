# 统计卡片组件 (StatsCard) 使用规范

> 组件路径: `src/components/StatsCard.vue`
> 适用场景: 综合统计看板、数据概览、Dashboard 页面中的统计指标卡片

---

## 一、组件简介

`StatsCard` 是一个统一的统计指标卡片组件，支持以下五种类型：

| 类型 | type 值 | 说明 | 典型场景 |
|------|---------|------|---------|
| 数字卡片 | `number`（默认） | 纯数字 + 标签文字，数字颜色由 `status` 控制 | 通知总数、应读人次、已读人次 |
| 进度卡片 | `progress` | 环形进度图 + 百分比，颜色根据 `progress` 值动态切换 | 整体已读率、完成率 |
| 异常卡片 | `abnormal` | 仅通过数字颜色 + 卡片 `border` 颜色标识异常，**背景保持 `--fill-surface`** | 未读人次、待反馈通知数 |
| 仪表盘卡片 | `dashboard` | 含图标、主数值+单位、底部状态栏，顶部条由 `status` 着色 | 在线设备数、在线率 |
| 紧凑卡片 | `compact` | 双行布局：标题+Tag / 数值+小环形进度百分比，背景 `--fill-secondary` | 超期未处置、逾期工单等紧凑统计 |

---

## 二、Props 接口

| Prop | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| `type` | `'number' \| 'progress' \| 'abnormal' \| 'dashboard' \| 'compact'` | 否 | `'number'` | 卡片类型 |
| `value` | `String \| Number` | **是** | — | 展示数值 |
| `label` | `String` | **是** | — | 标签文字 |
| `status` | `'primary' \| 'success' \| 'warning' \| 'danger' \| null` | 否 | `null` | 语义状态，控制数字颜色；`abnormal` 类型同时控制边框颜色；`compact` 类型控制数字颜色 |
| `progress` | `Number` | 否 | `null` | 进度值 (0-100)，`progress` 类型和 `compact` 类型均生效 |
| `tag` | `String` | 否 | `''` | 标签文字，显示在 `label` 右侧（`compact` 类型显示在标题右侧） |
| `tagType` | `String` | 否 | `'danger'` | Element Plus Tag 的 `type` 属性 (`'primary' \| 'success' \| 'warning' \| 'danger' \| 'info'`) |
| `unit` | `String` | 否 | `''` | 数值单位，仅 `dashboard` 类型生效 |
| `footerText` | `String` | 否 | `''` | 底部状态文字，仅 `dashboard` 类型生效 |

---

## 三、设计令牌绑定

### 3.1 status → 数字颜色

| status | CSS 变量 |
|--------|---------|
| `primary` | `--color-primary` |
| `success` | `--color-success` |
| `warning` | `--color-warning` |
| `danger` | `--color-danger` |
| `null`（默认） | `--text-primary` |

### 3.2 abnormal 边框颜色

| status | CSS 变量 |
|--------|---------|
| `success` | `--color-success-border` |
| `warning` | `--color-warning-border` |
| `danger` | `--color-danger-border` |

### 3.3 progress 进度条颜色（自动计算）

| 进度值 | 颜色 |
|--------|------|
| ≥ 90% | `--color-success`（绿色） |
| ≥ 70% | `--color-warning`（橙色） |
| < 70% | `--color-danger`（红色） |

### 3.4 compact 环形进度条

- 圆环尺寸：37×37px，stroke-width: 4
- 背景轨道：`--border-low`
- 进度弧：`--color-primary`
- 数字字体：`--font-size-h2` / `--font-weight-bold`（20px / 800）

---

## 四、使用示例

### 4.1 纯数字卡片

```vue
<!-- 未指定 status → 使用默认文字颜色 -->
<StatsCard :value="128" label="应读总人次" />

<!-- 主色调数字 -->
<StatsCard :value="12" label="通知总数" status="primary" />

<!-- 成功状态（绿色数字） -->
<StatsCard :value="336" label="已读总人次" status="success" />

<!-- 带 status 自动计算数字颜色 -->
<StatsCard
  :value="stats.feedbackRate + '%'"
  label="反馈完成率"
  :status="stats.feedbackRate >= 80 ? 'success' : stats.feedbackRate >= 60 ? 'warning' : 'danger'"
/>
```

### 4.2 环形进度卡片

```vue
<StatsCard
  type="progress"
  :value="88.6"
  label="整体已读率"
  :progress="88.6"
/>
```

### 4.3 异常卡片（数字 + 边框变色，背景不变）

```vue
<!-- 危险状态：红色数字 + 红色边框 + "需催办" Tag -->
<StatsCard
  type="abnormal"
  :value="84"
  label="未读总人次"
  status="danger"
  tag="需催办"
  tag-type="danger"
/>

<!-- 警告状态：橙色数字 + 橙色边框 + "需提醒" Tag -->
<StatsCard
  type="abnormal"
  :value="4"
  label="要求反馈通知数"
  status="warning"
  tag="需提醒"
  tag-type="warning"
/>
```

### 4.4 仪表盘卡片

```vue
<StatsCard
  type="dashboard"
  :value="1263"
  label="设备总数"
  unit="台"
  status="success"
  footerText="在线 1,263 · 在线率 98.2%"
>
  <template #icon>
    <el-icon><Monitor /></el-icon>
  </template>
  <template #footerIcon>
    <el-icon><CircleCheckFilled /></el-icon>
  </template>
</StatsCard>
```

### 4.5 紧凑卡片（双行布局 + 小环形进度）

```vue
<!-- 超期未处置：红色数字 + 橙色标签 + 进度百分比圆环 -->
<StatsCard
  type="compact"
  :value="48"
  label="超期未处置"
  status="danger"
  :progress="75"
  tag="超期"
  tagType="warning"
/>

<!-- 隐患已整改：绿色数字 + 高进度圆环 -->
<StatsCard
  type="compact"
  :value="92"
  label="隐患已整改"
  status="success"
  :progress="92"
  tag="已整改"
  tagType="success"
/>
```

---

## 五、布局约定

### 5.1 使用 Element Plus 栅格包裹

```vue
<el-row :gutter="16" class="stats-row">
  <el-col :span="3">
    <StatsCard :value="12" label="通知总数" status="primary" />
  </el-col>
  <el-col :span="4">
    <StatsCard type="progress" :value="80" label="整体已读率" :progress="80" />
  </el-col>
  <el-col :span="4">
    <StatsCard type="abnormal" :value="84" label="未读总人次" status="danger" tag="需催办" />
  </el-col>
  <el-col :span="3">
    <StatsCard type="compact" :value="48" label="超期未处置" status="danger" :progress="75" tag="超期" tagType="warning" />
  </el-col>
</el-row>
```

### 5.2 布局样式

```css
/* 统计卡片行只需控制底部间距，其他样式已内置于 StatsCard */
.stats-row {
  margin-bottom: 0;
}
```

---

## 六、与旧代码的对比

### 6.1 异常卡片的前后变化

**旧代码（不符合规范）：**
```html
<div class="stat-card stat-card--highlight">
  <div class="stat-card-value stat-card-value--danger">84</div>
  <div class="stat-card-label">未读总人次<el-tag>需催办</el-tag></div>
</div>
```

```css
.stat-card--highlight {
  border-color: var(--color-warning-border);
  background: var(--color-warning-bg); /* ❌ 改变背景色，深色模式下不可读 */
}
```

**新代码（符合设计令牌规范）：**
```vue
<StatsCard type="abnormal" :value="84" label="未读总人次" status="danger" tag="需催办" />
```
- ✅ 背景保持 `--fill-surface`
- ✅ 仅边框和数字颜色变更
- ✅ 深色/浅色模式自适应

### 6.2 环形进度卡片前后变化

**旧代码：** 手动编写 SVG 环形图（约 30 行）
**新代码：** `<StatsCard type="progress" :value="80" label="整体已读率" :progress="80" />`（1 行）

---

## 七、注意事项

1. **所有颜色值必须在组件内部使用 CSS 变量**，禁止硬编码。
2. `abnormal` 类型只改变 `border-color` 和数字 `color`，**不改变 `background`**，确保深色模式下可读。
3. `progress` 类型的环形图进度颜色由 `progress` prop 的值自动计算，无需额外指定。
4. `compact` 类型的环形进度条固定使用 `--color-primary`，圆环 37×37px，stroke-width: 4。
5. `tag` 和 `tagType` 是可选的，仅当需要展示附加信息时使用。
6. 卡片在 `el-row / el-col` 中使用时，会根据列宽自动调整，无需设置固定宽度。

---

## 八、变更记录

| 日期 | 变更内容 |
|------|---------|
| 2026-05-12 | 从 NewsCenter.vue 中抽取统计卡片为统一组件 `StatsCard.vue` |
| 2026-05-12 | 异常卡片改回 `--fill-surface` 背景，仅通过 `border` + 数字颜色标识 |
| 2026-05-12 | 新增 `status: 'primary'` 支持（作为正常的语义状态之一） |
| 2026-05-12 | 新增 `compact` 类型：紧凑双行布局 + 37×37 小环形进度百分比圆环，背景 `--fill-secondary` |
| 2026-05-12 | 新增 `dashboard` 类型文档说明 |