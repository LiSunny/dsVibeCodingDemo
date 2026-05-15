# 统计图表使用规范 (Chart Usage Standards)

> 规范版本：v1.0.0
> 更新日期：2026-05-15
> 图表引擎：AntV G2Plot

---

## 一、图表组件体系

项目已封装以下图表组件，统一基于 AntV G2Plot 实现，并支持浅色/深色主题自动切换：

| 组件 | 用途 | 使用场景 |
|---|---|---|
| **StatsCard** | 环形进度卡片 | 首页统计指标、单个进度展示 |
| **MiniRingChart** | 迷你单值进度环 | 模块卡片等紧凑空间的单值百分比展示 (44x44px inline SVG) |
| **SysLineChart** | 折线图 | 趋势分析、时间序列变化、多系列对比 |
| **SysBarChart** | 柱状图/条形图 | 分类对比、分组/堆叠数据、排名展示 |
| **SysRingChart** | 饼图/圆环图 | 占比分布、多类别比例展示 |

---

## 二、组件 Props 说明

### SysLineChart 折线图

| Prop | 类型 | 默认值 | 说明 |
|---|---|---|---|
| `data` | Array | required | 图表数据 |
| `xField` | String | required | X轴字段名 |
| `yField` | String/Array | 'y' | Y轴字段名 |
| `seriesField` | String | null | 分组字段（多折线时使用） |
| `colors` | Array | [] | 系列颜色数组 |
| `smooth` | Boolean | false | 是否平滑曲线 |
| `point` | Boolean | true | 是否显示数据点 |
| `label` | Boolean/Object | false | 是否显示数据标签 |
| `height` | Number/String | 280 | 图表高度 |
| `title` | String | '' | 图表标题 |
| `legend` | Boolean/Object | true | 是否显示图例 |
| `yAxisGrid` | Boolean | true | 是否显示Y轴网格线 |

### SysBarChart 柱状图

| Prop | 类型 | 默认值 | 说明 |
|---|---|---|---|
| `data` | Array | required | 图表数据 |
| `xField` | String | required | X轴字段名 |
| `yField` | String/Array | required | Y轴字段名 |
| `seriesField` | String | null | 分组字段（分组/堆叠时使用） |
| `isStack` | Boolean | false | 是否为堆叠模式 |
| `isHorizontal` | Boolean | false | 是否为水平条形图 |
| `colors` | Array | [] | 系列颜色数组 |
| `label` | Boolean/Object | false | 是否显示数据标签 |
| `height` | Number/String | 280 | 图表高度 |
| `legend` | Boolean/Object | true | 是否显示图例 |
| `barRadius` | Number | 4 | 柱状图圆角 |

### SysRingChart 饼图/圆环图

| Prop | 类型 | 默认值 | 说明 |
|---|---|---|---|
| `data` | Array | required | 图表数据 |
| `angleField` | String | 'value' | 数值字段名 |
| `colorField` | String | 'type' | 分类字段名 |
| `isRing` | Boolean | true | 是否为圆环模式（false=饼图） |
| `innerRadius` | Number | 0.6 | 圆环内径占比（0-1） |
| `radius` | Number | 0.8 | 饼图外径（isRing=false时） |
| `colors` | Array | [] | 系列颜色数组 |
| `label` | Boolean/Object | false | 是否显示数据标签 |
| `height` | Number/String | 280 | 图表高度 |
| `legend` | Boolean/Object | true | 是否显示图例 |

---

## 三、图表选用指南

| 数据特征 | 推荐图表 | 说明 |
|---|---|---|
| 单指标进度 | `StatsCard type="progress"` | 单个环形进度，最简洁 |
| 时间趋势变化 | `SysLineChart` | 折线图展示数据随时间的变化 |
| 多类别对比 | `SysBarChart` | 柱状图适合分类对比 |
| 占比分布 | `SysRingChart` | 饼图/圆环图展示部分与整体关系 |
| 排名展示 | `SysBarChart isHorizontal` | 水平条形图适合排名数据 |
| 多维度堆叠数据 | `SysBarChart isStack` | 堆叠柱状图展示构成关系 |

---

## 四、主题切换机制

所有图表组件已内置主题适配能力：

1. **初始化时**：读取 `html.dark` class 判断深色模式
2. **自动读取 CSS 变量**：从项目设计令牌获取颜色配置
3. **监听切换**：使用 `MutationObserver` 监听 class 变化
4. **动态更新**：切换时自动调用 `chart.update()` 更新主题色

### 主题颜色对照

| 语义色 | 浅色模式 | 深色模式 |
|---|---|---|
| primary | #3678E3 | #00E5FF |
| success | #059669 | #4CAF50 |
| warning | #D97706 | #FF9800 |
| danger | #DC2626 | #F44336 |

---

## 五、代码示例

### 折线图 - 多系列趋势

```vue
<SysLineChart
  :data="[
    { month: '1月', type: '通知数量', value: 8 },
    { month: '1月', type: '未读企业数', value: 32 },
    { month: '2月', type: '通知数量', value: 6 },
    { month: '2月', type: '未读企业数', value: 28 },
  ]"
  x-field="month"
  y-field="value"
  series-field="type"
  :colors="['#3678E3', '#DC2626']"
  :smooth="true"
/>
```

### 柱状图 - 堆叠

```vue
<SysBarChart
  :data="[
    { month: '1月', type: '新增', value: 10 },
    { month: '1月', type: '整改', value: 8 },
  ]"
  x-field="month"
  y-field="value"
  series-field="type"
  :is-stack="true"
/>
```

### 饼图/圆环图

```vue
<SysRingChart
  :data="[
    { type: '火情', value: 35 },
    { type: '烟雾', value: 25 },
    { type: '闯入', value: 20 },
    { type: '其他', value: 20 },
  ]"
  angle-field="value"
  color-field="type"
  :is-ring="true"
  :inner-radius="0.6"
/>
```

---

## 六、禁止事项

- ❌ 禁止手写 SVG 实现图表
- ❌ 禁止使用 div+css 模拟图表
- ✅ 使用封装组件或 StatsCard

---

## 七、相关文件

| 文件 | 说明 |
|---|---|
| `src/components/SysLineChart.vue` | 折线图封装组件 |
| `src/components/SysBarChart.vue` | 柱状图封装组件 |
| `src/components/SysRingChart.vue` | 饼图/圆环图封装组件 |
| `src/components/StatsCard.vue` | 统计卡片组件 |
| `src/style.css` | 设计令牌（CSS 变量） |

---

## 九、历史趋势分析区块布局规范

所有二级专题页面的"历史趋势分析"区块必须统一采用以下结构。

### 9.1 区块结构

```
┌─────────────────────────────────────────────────┐
│  h3.section-title                               │  ← 区块标题
├──────────────────┬──────────────────────────────┤
│  chart-panel     │  chart-panel                 │  ← el-row :gutter="16"
│  ┌─────────────┐ │  ┌──────────────┐            │
│  │ 标题  │ 图例  │ │  │ 标题         │            │  ← chart-panel-header
│  ├─────────────┤ │  ├──────────────┤            │
│  │ SysLineChart│ │  │ SysBarChart  │            │  ← chart-body
│  │             │ │  │              │            │
│  └─────────────┘ │  └──────────────┘            │
└──────────────────┴──────────────────────────────┘
```

### 9.2 布局规范

| 要求 | 说明 |
|---|---|
| **区块标题** | 使用 `h3.section-title` 带蓝色竖线前缀（与综合统计看板标题一致） |
| **禁止行为** | ❌ 禁止手写 div+css 模拟图表；❌ 禁止使用非封装图表组件 |
| **区块标题** | 使用 `h3.section-title` 带蓝色竖线前缀（与综合统计看板标题一致） |
| **网格布局** | 使用 `el-row :gutter="16"` + `el-col` 均分横向宽度（`:span="12"` 各50% 或按需分配） |
| **标题行结构** | 左侧：图表标题文字（`chart-panel-title`）；右侧：可选图例（`chart-legend`） |
| **图表选择** | 遵循本规范第三章"图表选用指南" |
| **多行间距** | 多行 `el-row` 之间使用 `class="chart-row"` + CSS `margin-top: var(--spacing-md)`，使纵向间距与横向 `gutter="16"` 保持一致 |

### 9.3 提示说明 icon（可选）

如需在标题旁添加提示说明 icon，结构示例：

```vue
<span class="chart-panel-title">
  每日预警总数 vs 误报数（近7天）
  <el-tooltip content="统计周期内各监测点预警总数及经人工核实的误报数量">
    <el-icon><QuestionFilled /></el-icon>
  </el-tooltip>
</span>
```

### 9.4 标准模板

```vue
<!-- ==================== 3.4 历史趋势分析 ==================== -->
<div class="section">
  <h3 class="section-title">历史趋势分析</h3>

  <el-row :gutter="16">
    <el-col :span="12">
      <div class="chart-panel">
        <div class="chart-panel-header">
          <span class="chart-panel-title">图表标题</span>
          <div class="chart-legend">
            <span class="chart-legend-item">
              <span class="chart-legend-dot chart-legend-dot--primary"></span>
              图例项1
            </span>
            <span class="chart-legend-item">
              <span class="chart-legend-dot chart-legend-dot--danger"></span>
              图例项2
            </span>
          </div>
        </div>
        <div class="chart-body">
          <SysLineChart ... />
        </div>
      </div>
    </el-col>

    <el-col :span="12">
      <div class="chart-panel">
        <div class="chart-panel-header">
          <span class="chart-panel-title">图表标题</span>
        </div>
        <div class="chart-body">
          <SysBarChart ... />
        </div>
      </div>
    </el-col>
  </el-row>
</div>
```

### 9.5 CSS 样式（可复用）

```css
/* 图表面板 */
.chart-panel {
  background: var(--fill-surface);
  border-radius: var(--radius-lg);
  border: 1px solid var(--border-default);
  overflow: hidden;
}
.chart-panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-md) var(--spacing-lg);
  border-bottom: 1px solid var(--border-low);
  background: var(--fill-secondary);
}
.chart-panel-title {
  font-size: var(--font-size-body);
  font-weight: var(--font-weight-medium);
  color: var(--text-primary);
}
.chart-body {
  padding: var(--spacing-md);
}

.chart-row {
  margin-top: var(--spacing-md);
}
/* 图例 */
.chart-legend {
  display: flex;
  gap: var(--spacing-md);
}
.chart-legend-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  font-size: var(--font-size-xs);
  color: var(--text-muted);
}
.chart-legend-dot {
  width: 10px;
  height: 10px;
  border-radius: var(--radius-round);
}
.chart-legend-dot--primary { background: var(--color-primary); }
.chart-legend-dot--success { background: var(--color-success); }
.chart-legend-dot--warning { background: var(--color-warning); }
.chart-legend-dot--danger  { background: var(--color-danger); }
```

### 9.6 相关文件

参考 `src/views/NewsCenter.vue` 第3.4节"历史趋势分析"区块的完整实现。

---

## 八、版本历史

| 版本 | 日期 | 更新内容 |
|---|---|---|
| v1.0.0 | 2026-05-15 | 初始版本，集成 AntV G2Plot，封装 3 个图表组件 |
| v1.1.0 | 2026-05-15 | 新增第九章，历史趋势分析区块布局规范 |
