# 前端 UI 生成规范 — 企业管理后台

> **使用说明（AI 必读）**
> 每次生成页面前，必须先完成以下自检步骤，再开始输出代码：
> 1. 声明当前页面属于哪种页面类型（数据列表页 / 详情页 / 表单页 / 数据概览页）
> 2. 逐条对照该页面类型的专属规范章节
> 3. 确认所有色彩、字号、间距均使用设计令牌，无任何硬编码值
> 4. 确认每种交互状态（hover / active / disabled / loading / empty）均已实现

---

## 核心原则

生成商业级 SaaS 产品质量的界面，所有色彩 / 字号 / 间距均使用项目设计令牌，不得硬编码任何样式值。每个页面即可直接投入生产使用，禁止输出 Demo 级草稿代码。

---

## 一、页面整体布局规范（应用框架结构）

整个应用的框架为**左菜单 + 右内容**的经典后台布局，右侧内容区再分为**面包屑区 + 内容区**两层。

```
┌──────────────────────────────────────────────────────────┐
│  ┌──────────────┐  ┌──────────────────────────────────┐  │
│  │   左侧菜单栏  │  │  面包屑 / 用户信息（固定在顶部）   │  │
│  │   - logo     │  ├──────────────────────────────────┤  │
│  │   - 折叠按钮 │  │                                  │  │
│  │   - 导航菜单 │  │   内容区（填满剩余空间，可滚动）   │  │
│  │              │  │                                  │  │
│  │  固定宽度    │  │                                  │  │
│  │  可折叠      │  │                                  │  │
│  │  内部滚动    │  │                                  │  │
│  └──────────────┘  └──────────────────────────────────┘  │
└──────────────────────────────────────────────────────────┘
```

### 1.1 布局层级结构

| 层级 | 区域名称 | 对应元素 | 定位方式 | 关键 CSS 约束 |
|------|---------|---------|---------|-------------|
| 第一层 | 应用整体 | `.app` | flex row | `height: 100vh; overflow: hidden` |
| 第二层 | 左侧菜单栏 | `.layout-sidebar` | 固定宽度子项 | `flex-shrink: 0; overflow-y: auto` |
| 第二层 | 右侧主内容区 | `.layout-main` | 弹性子项 | `flex: 1; display: flex; flex-direction: column; overflow: hidden` |
| 第三层 | 面包屑区 | `.main-header` | 顶部固定项 | `flex-shrink: 0` |
| 第三层 | 内容区 | `.main-content` | 弹性填充项 | `flex: 1; overflow-y: auto` |

### 1.2 左侧菜单栏（Sidebar）规范

- 宽度使用设计令牌 `var(--sidebar-width-expanded)` / `var(--sidebar-width-collapsed)`
- 折叠按钮位于菜单栏顶部右侧，点击切换展开 / 收起
- 菜单项使用 `el-menu` 组件，配置 `router` 属性实现路由联动
- 当前激活菜单项：背景色 `var(--color-info-bg)`，文字色 `var(--color-primary)`，左侧 3px 实线 `var(--color-primary)`
- 非激活项：文字色 `var(--text-secondary)`，hover 背景 `var(--fill-hover)`
- 收起状态下仅显示图标，展开状态图标 + 文字并列，层级最多 **2 级**
- 菜单栏内容较长时内部纵向滚动（`overflow-y: auto`）

### 1.3 面包屑区（Main Header）规范

- **始终固定在窗口顶部**，不随页面内容滚动（`flex-shrink: 0`）
- 高度：`var(--header-height)`
- 左侧：当前页面路径（`el-breadcrumb`，分隔符 `/`）
- 右侧：值班员姓名 + 角色 + 主题切换按钮
- 背景色：`var(--fill-surface)`，底部 1px 分割线 `var(--border-low)`

### 1.4 内容区（Main Content）规范

- 宽高填充满父容器：`flex: 1; overflow-y: auto`
- 内边距：`var(--spacing-lg)`（四边统一）
- **禁止**在内容区外层容器设置 `overflow-y: auto`，避免面包屑区一起滚动

---

## 二、页面头部（Page Header）统一模板

**每个功能页面的内容区顶部必须包含结构固定的头部区，禁止 AI 自由组合。**

```
┌─ 左侧 ──────────────────────────────────── 右侧 ─┐
│  [状态 Badge]  页面主标题                  操作按钮组  │
│  副标题 / 流程说明（可选）                          │
└───────────────────────────────────────────────────┘
```

### 2.1 组成元素规则

| 元素 | 位置 | 样式规则 | 出现条件 |
|------|------|---------|---------|
| 页面主标题 | 左侧第一行 | `var(--font-size-h2)` + `var(--font-weight-medium)` + `var(--text-primary)` | 必须 |
| 状态 Badge | 标题紧左侧 | 见第七章 Badge 规范 | 仅详情页 |
| 副标题 / 流程说明 | 左侧第二行 | `var(--font-size-xs)` + `var(--text-secondary)`，行间距 `4px` | 可选 |
| 日期范围标签 | **所属区块右上角** | 蓝色边框小标签 | 禁止放在标题行 |
| 返回按钮 | 右侧操作区最左 | 描边按钮，`< 返回列表` 格式 | 详情页 / 二级页 |
| 主操作按钮 | 右侧操作区最右 | 见第七章按钮规范 | 按需 |

### 2.2 禁止事项

- 禁止将日期筛选、数据范围标签嵌入标题行
- 禁止标题行同时出现超过 3 个按钮
- 禁止在主标题行下方再嵌套一层标题行

---

## 三、按页面类型选择布局（禁止千篇一律）

| 页面类型 | 布局模式 | 对应规范章节 |
|------|------|------|
| 数据列表页 | 页面头部 + 筛选栏 + 统计卡片行（可选）+ 表格 + 分页 | 第四章 |
| 详情 / Profile 页 | 页面头部 + 字段信息区 + Tab 分组 + 关联信息 + 底部操作栏 | 第五章 |
| 表单页 | 页面头部 + 分组表单 + 底部操作栏 | 第六章 |
| 数据概览页 | 页面头部 + 统计卡片行 + 图表区 + 列表组合 | 第八章 |

---

## 四、数据列表页规范

### 4.1 整体层级（从上到下，顺序固定）

```
页面头部（Page Header）
  ↓
统计卡片行（可选，有核心指标时使用）
  ↓
筛选栏（独立区域，全宽）
  ↓
表格区（含标题行 + 数据行 + 操作列）
  ↓
分页栏
```

### 4.2 统计卡片行规范

- 单行最多 **6 个**等宽卡片，超出须拆分为两个区块或换行
- 每张卡片必须包含三层信息：
  - 指标名：`var(--font-size-xs)` + `var(--text-secondary)`
  - 数值：`var(--font-size-h1)` + `var(--font-weight-medium)` + `var(--text-primary)`
  - 趋势 / 辅助说明（可选）：`var(--font-size-xs)` + 语义色
- **异型卡片**（榜单型、环形图型等）：宽度等于 2 个普通卡片，只允许出现在行尾
- 数值格式化规则：
  - 万以上使用"1.2万"缩写
  - 百分比保留 1 位小数（如"57.1%"）
  - 时长使用"X 分钟"或"X 小时 Y 分"
  - 正增长显示 `var(--color-success)` + `↑`，负增长显示 `var(--color-danger)` + `↓`

### 4.2.1 综合统计看板区域规范

当统计卡片数据需要按时间范围（如近7天/近30天/全部历史）动态切换时，时间范围筛选器**必须放在统计看板区域的标题行右侧**，不得嵌入 PageHeader 或独立筛选栏。

**布局结构**：
```
┌─ stats-title-row ──────────────────────────────────┐
│  ▌综合统计看板                    数据范围：[近7天 ▾]  │
├─────────────────────────────────────────────────────┤
│  [通知总数]  [应读总人次]  [已读总人次]  [已读率]  ...  │
└─────────────────────────────────────────────────────┘
```

**实现规则**：

| 规则项 | 具体要求 |
|--------|---------|
| 容器 | `.stats-title-row`：`display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--spacing-sm)` |
| 标题 | 使用标准 `.section-title`（左侧蓝色3px竖线），在 title-row 内 `margin-bottom: 0` |
| 筛选器容器 | `.stats-title-filter`：`display: flex; align-items: center; gap: var(--spacing-xs); flex-shrink: 0` |
| 筛选标签 | 文字 `数据范围：`，样式 `var(--font-size-small)` + `var(--text-secondary)`，白色不换行 |
| 下拉框 | `el-select`，宽度 `120px`，绑定 `v-model="timeRange"` |

**禁止事项**：
- 禁止将看板时间范围筛选放在 PageHeader 的 actions 插槽中
- 禁止将看板时间范围筛选与下方列表筛选栏合并
- 看板筛选仅影响统计卡片数据，不影响下方列表数据

### 4.3 筛选栏规范

- **位置**：必须独立于表格标题行，位于表格区上方，占全宽
- **禁止**将筛选下拉框嵌入表格标题行右侧
- 排列顺序（从左到右）：下拉筛选项 → 输入框搜索 → 查询按钮 → （右侧对齐）新增等操作按钮
- 筛选项超过 **5 个**时折叠，保留最常用的 3 个可见，其余放入"更多筛选"展开面板
- 重置按钮紧跟查询按钮右侧，使用文字按钮（link 类型）

### 4.4 表格规范

- 固定表头（`sticky-header`），行高：`var(--table-row-height)`
- 表格行 hover：背景色 `var(--fill-hover)`
- 列类型与样式：

| 列类型 | 对齐方式 | 样式规则 |
|------|---------|---------|
| 文本列 | 左对齐 | `var(--text-primary)` + `var(--font-size-small)` |
| 数字 / 金额列 | 右对齐 | `font-variant-numeric: tabular-nums` |
| 时间列 | 左对齐 | `var(--text-secondary)` + `var(--font-size-small)` |
| 状态列 | 居中 | Badge 标签，见第七章 |
| 进度列 | 居中 | 横向进度条 + 百分比文字 |
| 操作列 | 右对齐 | 固定在表格右侧（`fixed: right`），宽度 `120px` |

- **空值统一规则**：所有空值显示 `—`（em dash，U+2014），居中对齐，颜色 `var(--text-muted)`
- **图片 / 截图列**：有图时显示缩略图（点击可预览），无图时显示 `—`，不显示破损图标

### 4.5 操作列规范

- 最多同时显示 **3 个**操作，超出使用"…"更多菜单
- 按钮均使用文字按钮（ghost 类型），不使用图标按钮
- 顺序固定（从左到右）：`查看` → `处理` → `详情`
- **按状态条件渲染**：状态不允许操作时置灰（`disabled`），而非隐藏
- 危险操作（删除）放在"…"更多菜单内，不在主操作列直接暴露

### 4.6 分页栏规范

- 位置：表格底部，与表格同宽
- 左侧：总条数（如"共 14 条"）
- 右侧：页码选择器 + 每页条数下拉
- 使用 `el-pagination` 的 `layout="total, sizes, prev, pager, next"` 配置

---

## 五、详情页规范

### 5.1 整体层级（从上到下，顺序固定）

```
页面头部（含返回按钮 + 状态 Badge + 页面标题 + 右侧操作按钮）
  ↓
字段信息区（基础信息网格）
  ↓
媒体预览区（截图 / 视频，若有）
  ↓
AI 识别 / 分析详情区（若有，独立卡片）
  ↓
Tab 导航（多维度内容分组）
  ↓
时间轴 / 流程记录区（若有）
  ↓
底部操作栏（固定在内容区底部）
```

### 5.2 字段展示网格（Field Grid）规范

- 默认 **3 列** grid，`gap: var(--spacing-md)`
- label 样式：`var(--font-size-xs)` + `var(--text-secondary)`，在上
- value 样式：`var(--font-size-small)` + `var(--text-primary)`，在下
- label 与 value 垂直间距固定：`4px`
- 字段组之间间距：`var(--spacing-md)`

**触发跨全行（`grid-column: 1 / -1`）的条件：**

| 内容类型 | 处理方式 |
|---------|---------|
| 多行文本（AI 说明、备注、描述） | 跨全行展示 |
| 媒体预览组（截图卡片 / 视频卡片） | 跨全行展示，卡片横向排列 |
| 时间轴 / 处置记录 | 跨全行展示 |
| 外链 / 操作链接 | 保持单列，`var(--color-primary)` 颜色 |

### 5.3 媒体预览卡片规范

- 每张卡片固定尺寸（宽 `140px` × 高 `120px`），圆角 `var(--radius-md)`
- 卡片内：上方为图片 / 视频缩略图占位，下方为描述文字（`var(--font-size-xs)` + 居中）
- 当前选中卡片：`border: 2px solid var(--color-primary)`
- 未选中：`border: 1px solid var(--border-default)`
- 卡片组横向排列，间距 `var(--spacing-sm)`，超出允许横向滚动

### 5.4 Tab 导航规范

- 使用下划线样式（`el-tabs type="line"`）
- Tab 数量建议 **3–6 个**，超出折叠
- 激活 Tab：底部 2px 实线 `var(--color-primary)`，文字色 `var(--color-primary)`
- 每个 Tab 内容区保持与字段网格一致的 padding

### 5.5 时间轴规范

- 使用 `el-timeline` 组件
- 时间节点颜色按事件类型区分：派发 `var(--color-primary)`，核实 `var(--color-warning)`，处置 `var(--color-success)`，闭环 `var(--color-success)`
- 每个节点：时间戳（`var(--font-size-xs)` + `var(--text-secondary)`）在上，内容文字在下，操作标签（小 Badge）在最下
- 时间轴跨全行展示

---

## 六、表单页规范

### 6.1 整体结构

```
页面头部（含返回按钮 + 页面标题）
  ↓
表单内容区（分组呈现）
  ↓
底部操作栏（固定在内容区底部）
```

### 6.2 表单分组规范

- 每组表单有独立**区块标题**（见第九章），下方 `1px` 分割线
- 字段按业务语义分组，同组字段布局使用 **2 列** grid（复杂字段用 1 列）
- 必填字段：label 前加红色星号 `*`，颜色 `var(--color-danger)`
- 字段说明文字：位于输入框下方，`var(--font-size-xs)` + `var(--text-muted)`
- 字段 label 与输入框之间间距：`var(--spacing-xs)`

### 6.3 表单验证规范

- 验证触发时机：失焦（blur）时触发单字段验证，提交时触发全量验证
- 错误提示：输入框变红色边框 `var(--color-danger)`，下方显示红色错误文字（`var(--font-size-xs)`）
- 成功状态：不显示绿色对勾（避免视觉噪声）

---

## 七、按钮系统规范（Button System）

### 7.1 按钮类型与用途

| 类型 | 颜色令牌 | 用途 | 每页上限 |
|------|---------|------|---------|
| 主按钮（primary） | `var(--color-primary)` 填充 | 最核心操作（新增 / 保存 / 派发） | **1 个** |
| 次要按钮（default） | 描边，无填充 | 导出、返回、取消、查询 | 不限 |
| 危险按钮（danger） | `var(--color-danger)` 填充 | 删除（慎用，优先放更多菜单内） | 1 个 |
| 警告按钮（warning） | `var(--color-warning)` 填充 | 误报标记等警示操作 | 1 个 |
| 文字按钮（link） | `var(--color-primary)` 无边框 | 表格操作列、跳转链接、重置 | 不限 |

### 7.2 底部操作栏规则

- 最多 **4 个按钮**，超出折叠进"更多操作"下拉
- 排列顺序（从左到右）：危险操作 → 次要操作 → **主操作（最右）**
- **禁止**同一操作栏出现 2 个以上填充色不同的实心按钮
- 底部操作栏使用 `position: sticky; bottom: 0`，背景色 `var(--fill-surface)`，顶部 1px 分割线

### 7.3 按钮交互状态（必须实现）

| 状态 | 视觉变化 |
|------|---------|
| hover | 背景加深 10%，transition 150ms |
| active | `transform: scale(0.98)` |
| disabled | 透明度 0.4，`cursor: not-allowed`，禁止点击 |
| loading | 左侧显示 Spin 图标，文字替换为"处理中…"，自动 disabled |

---

## 八、数据概览页规范

### 8.1 整体结构（从上到下，顺序固定）

```
页面头部（含时间范围筛选，放于右侧）
  ↓
统计卡片行（核心指标，遵循第四章 4.2 节）
  ↓
图表区（2 列 grid，大图表可跨全行）
  ↓
列表 / 排名区（辅助信息表格）
```

### 8.2 图表规范

- 图表容器使用白色背景卡片，圆角 `var(--radius-lg)`，内边距 `var(--spacing-md)`
- 图表标题：左上角，`var(--font-size-small)` + `var(--font-weight-medium)`
- 坐标轴文字：`var(--font-size-xs)` + `var(--text-secondary)`
- 图例：图表下方居中，最多 5 项，超出使用滚动或折叠
- 空数据状态：图表区域中央显示空状态提示（见第十章）
- 图表配色使用设计令牌颜色序列（`var(--color-primary)`、`var(--color-success)`、`var(--color-warning)`、`var(--color-danger)`、`var(--color-info)`），禁止硬编码颜色

### 8.3 排名列表规范

- 排名序号：1–3 名使用金 / 银 / 铜色标记（`var(--color-warning)` / `var(--text-muted)` / `var(--color-notice)`），其余显示数字
- 行高与主表格一致，无分页（最多显示 Top 10）

---

## 九、区块标题（Section Title）统一规范

**全站所有区块标题（Section Title）统一使用以下结构，禁止自行选择有无装饰线。**

```css
.section-title {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  font-size: var(--font-size-h3);
  font-weight: var(--font-weight-medium);
  color: var(--text-primary);
  margin-bottom: var(--spacing-sm);
}
.section-title::before {
  content: '';
  display: inline-block;
  width: 3px;
  height: 1em;
  background: var(--color-primary);
  border-radius: 2px;
  flex-shrink: 0;
}
```

- 左侧蓝色 3px 竖线为必须，所有页面统一
- 区块标题与正文内容之间间距：`var(--spacing-sm)`
- 同一页面多个区块之间间距：`var(--spacing-lg)`

---

## 十、状态 Badge / 标签规范

### 10.1 Badge 颜色规则（按语义）

| 语义 | 令牌 | 典型文案 |
|------|------|---------|
| 成功 / 完成 / 已闭环 | `var(--color-success)` | 已闭环、在线、正常 |
| 处理中 / 进行中 | `var(--color-warning)` | 处理中、待审核 |
| 危险 / 未处理 / 紧急 | `var(--color-danger)` | 未处理、离线、异常 |
| 普通 / 信息 | `var(--color-info)` | 已派发、参考、巡报 |
| 禁用 / 已停用 | `var(--text-muted)` | 停用、已关闭 |

### 10.2 Badge 结构要求

- 背景色使用对应语义色的 `-bg` 后缀（如 `var(--color-success-bg)`），文字色使用对应语义色主色（如 `var(--color-success)`）
- 圆角：`var(--radius-sm)`
- 字号：`var(--font-size-xs)`
- 内边距：`2px 8px`
- **禁止**仅用颜色传达状态，文字标签为必须

---

## 十一、交互状态规范（必须实现，不可省略）

### 11.1 全量清单

| 元素 | 必须实现的状态 |
|------|-------------|
| 按钮 | hover / active / disabled / loading |
| 输入框 | focus 边框高亮（`var(--color-primary)` 2px） / error 红色边框 |
| 表格行 | hover 背景色变化 |
| 下拉选择 | focus / open / 已选中项高亮 |
| 表格操作按钮 | hover 颜色加深 / disabled 置灰 |
| 页面整体 | 数据加载骨架屏（不得空白等待） |
| 数据结果 | 空数据状态（插图 + 提示文字 + 可选引导操作） |

### 11.2 骨架屏规范

- 触发时机：所有异步数据请求发出后立即展示
- 骨架色：`var(--el-skeleton-color)`，动画使用 shimmer 效果
- 形状与真实内容保持一致（表格行数与真实分页一致）

### 11.3 空状态规范

- 插图：使用统一空状态 SVG 组件（`<EmptyState />`），禁止自行绘制
- 提示文字：`var(--font-size-small)` + `var(--text-secondary)`，描述无数据原因
- 引导操作（可选）：次要按钮，如"去新增"或"清空筛选条件"

---

## 十二、禁止事项（硬性约束）

- **禁止**硬编码任何色值（如 `#1890ff`）、字号（如 `14px`）、间距数值（如 `16px`）
- **禁止**使用 emoji 替代图标，统一使用 `@ant-design/icons` 或 `lucide-react`
- **禁止**占位数据（如"2025-01-03"）出现在字段 label 位置
- **禁止**缺少任何交互状态
- **禁止**将筛选控件嵌入表格标题行（必须独立筛选栏）
- **禁止**同一操作栏出现 2 个以上不同颜色的实心按钮
- **禁止**空值位置留白，统一显示 `—`
- **禁止**区块标题样式自由发挥，必须使用第九章规定的蓝色竖线结构
- **禁止**将日期范围标签嵌入页面主标题行
- **禁止**底部操作栏超过 4 个按钮
- **禁止**输出 Demo 级草稿代码，每次输出即可直接使用的质量

---

## 附录 A：设计令牌参考列表

> 所有令牌名称和数值以 `src/style.css` 为准。以下为本文档中使用到的令牌速查表。

### 颜色令牌

```
--color-primary          主品牌色（浅色 #3678E3 / 深色 #00E5FF）
--color-success          成功绿
--color-warning          警告橙
--color-danger           危险红
--color-info             信息蓝（浅色同 primary）
--color-notice           提示黄
--text-primary           主文本色
--text-secondary         次要文本色
--text-muted             辅助/禁用文本色
--text-inverse           反色文字（白色）
--fill-surface           页面/卡片背景
--fill-hover             悬停背景
--fill-page              页面底色
--fill-secondary         子级背景
--el-skeleton-color      骨架屏底色
--border-low             分割线颜色
--border-default         表单边框颜色

【语义色背景 / 边框后缀】
--color-success-bg / -border
--color-warning-bg / -border
--color-danger-bg / -border
--color-info-bg / -border
--color-notice-bg / -border
```

### 字号令牌

```
--font-size-xs       12px   辅助说明、Badge 文字
--font-size-small    14px   正文、表格内容、区块标题、字段 value
--font-size-body     16px   次级页面标题、正文
--font-size-h3       18px   三级标题
--font-size-h2       20px   页面主标题
--font-size-h1       24px   统计卡片数值、一级标题
```

### 间距令牌

```
--spacing-xs      4px
--spacing-sm      8px
--spacing-md     16px
--spacing-lg     24px
```

### 圆角令牌

```
--radius-sm        6px    Badge、小标签
--radius-md        8px    卡片、输入框、按钮
--radius-lg       10px    大卡片、弹窗
--radius-xl       14px    面板
```

### 布局尺寸令牌

```
--sidebar-width-expanded   240px
--sidebar-width-collapsed   64px
--header-height             48px
--table-row-height          48px
```

### 字重令牌

```
--font-weight-regular   400
--font-weight-medium    500
--font-weight-bold      800
```

---

## 附录 B：AI 生成前自检模板

在每次生成页面代码前，AI 必须先输出以下自检结论，再开始代码：

```
【页面类型】：（数据列表页 / 详情页 / 表单页 / 数据概览页）
【适用规范章节】：（如：第二章 + 第四章 + 第七章 + 第九章）
【页面头部结构】：（左侧元素 | 右侧元素）
【操作按钮清单】：（列出所有按钮及其类型，确认主按钮唯一）
【特殊组件确认】：（如时间轴 / 媒体卡片 / 异型统计卡 / Tab，说明触发规则）
【令牌使用确认】：无任何硬编码颜色 / 字号 / 间距 ✓
【交互状态确认】：骨架屏 / hover / disabled / empty 均已规划 ✓