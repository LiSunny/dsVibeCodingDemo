## 布局规则约束文档（左侧菜单栏 + 右侧内容区）

> **核心约束**：保持您的设计令牌（颜色、字体、字号、圆角、间距等）**完全不变**，仅调整页面布局为**左侧折叠菜单栏 + 右侧内容区**的企业级后台风格。

---

### 1. 整体布局结构

```
┌──────────────────────────────────────────────────────────────┐
│ 左侧菜单栏                          │      右侧主内容区        │
│ (可折叠，宽度可变)                   │  ┌────────────────────┐  │
│ ┌────────────────┐                  │  │ 顶部栏             │  │
│ │ Logo + 折叠按钮 │                  │  │ (面包屑+用户信息)   │  │
│ ├────────────────┤                  │  ├────────────────────┤  │
│ │ 导航菜单        │                  │  │ 内容区             │  │
│ │ - 模块1         │                  │  │ - 页面标题+时间筛选 │  │
│ │ - 模块2         │                  │  │ - 统计卡片网格      │  │
│ │ - 模块3         │                  │  │ - 筛选操作栏        │  │
│ │ ...            │                  │  │ - 数据表格          │  │
│ └────────────────┘                  │  └────────────────────┘  │
└──────────────────────────────────────────────────────────────┘
```

### 2. 布局容器与尺寸

| 元素 | 宽度规则 | 背景 | 备注 |
|------|----------|------|------|
| 左侧菜单栏 | 展开时 `240px`，折叠时 `64px` | 使用您的设计令牌定义的侧栏背景色（如 `--sidebar-bg`） | 过渡动画 `0.2s ease` |
| 右侧内容区 | `flex: 1`，自动占满剩余宽度 | 使用您的设计令牌定义的页面背景色（如 `--bg-color`） | 最小宽度 `600px` |
| 内容区最大宽度 | 可选：`1400px` + 左右自动边距，或直接占满 | - | 推荐设置 `padding: 0 24px` |

### 3. 左侧菜单栏详细规则

#### 3.1 HTML 结构
```html
<aside class="layout-sidebar" data-collapsed="false">
  <div class="sidebar-header">
    <div class="logo">石楼平台</div>
    <button class="collapse-btn">☰</button>
  </div>
  <nav class="sidebar-nav">
    <a href="#" class="nav-item active">石楼动态资讯</a>
    <a href="#" class="nav-item">隐患舆情监测</a>
    <!-- 其他模块 -->
  </nav>
</aside>
```

#### 3.2 CSS 布局类（仅布局，不修改令牌值）
```css
.layout-sidebar {
  width: var(--sidebar-width-expanded);
  transition: width 0.2s ease;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
}
.layout-sidebar[data-collapsed="true"] {
  width: var(--sidebar-width-collapsed);
}
/* 折叠时隐藏文字，只显示图标（可选） */
.sidebar-nav .nav-item span {
  margin-left: 8px;
}
.layout-sidebar[data-collapsed="true"] .sidebar-nav .nav-item span {
  display: none;
}
```

#### 3.3 折叠交互
- 点击折叠按钮，切换 `data-collapsed` 属性。
- 内容区自动适应剩余宽度（无需额外JS处理宽度，因 `flex: 1` 会自动撑开）。

### 4. 右侧内容区详细规则

#### 4.1 整体结构
```html
<main class="layout-main">
  <header class="main-header">
    <div class="breadcrumb">首页 / 模块名称</div>
    <div class="user-info">值班员：xxx</div>
  </header>
  <div class="main-content">
    <!-- 各模块的页面内容按原设计令牌插入 -->
  </div>
</main>
```

#### 4.2 CSS 布局类
```css
.layout-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  background: var(--bg-color);
}
.main-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-md) var(--spacing-lg);
  background: var(--card-bg);
  border-bottom: 1px solid var(--border-color);
}
.main-content {
  padding: var(--spacing-lg);
  /* 可选内容区最大宽度约束 */
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
}
```

### 5. 页面内容布局（模块内部）

保持各模块原有的**统计卡片网格 + 筛选栏 + 表格**结构，但确保其容器位于 `.main-content` 内。

#### 统计卡片区
```css
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-lg);
}
```

#### 筛选操作栏
```css
.action-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-md);
}
```

#### 表格
```css
.data-table {
  width: 100%;
  background: var(--card-bg);
  border-radius: var(--radius-md);
  overflow: auto;
}
.data-table th,
.data-table td {
  padding: 12px var(--spacing-md);
  text-align: left;
  border-bottom: 1px solid var(--border-color);
}
```

### 6. 全局布局样式（App 容器）

```css
.app {
  display: flex;
  height: 100vh;
  overflow: hidden;
}
```

### 7. 响应式与滚动

- 侧栏固定，右侧内容区垂直滚动（`overflow-y: auto`）。
- 侧栏宽度变化时，内容区宽度平滑过渡（因 `flex: 1` 自动重算）。

### 8. 交互行为说明

| 操作 | 行为 |
|------|------|
| 点击折叠按钮 | 侧栏宽度从 `240px` → `64px`，菜单文本隐藏，内容区宽度自动变大 |
| 再次点击 | 侧栏宽度恢复，菜单文本显示 |
| 菜单项点击 | 切换 `active` 样式，右侧内容区加载对应模块（前端路由或页面跳转） |

### 9. 与设计令牌的集成方式

- **禁止修改**任何 `--*` 变量的值。
- **允许新增**与布局相关的自定义变量（如 `--sidebar-width-expanded`），但不得覆盖原始令牌。
- **必须使用**令牌中已定义的 `--spacing-*`、`--radius-*`、`--bg-color`、`--card-bg`、`--border-color` 等。

### 10. 示例：完整左侧菜单 + 右侧内容区的骨架代码

```html
<div class="app">
  <aside class="layout-sidebar" data-collapsed="false">
    <div class="sidebar-header">
      <div class="logo">石楼平台</div>
      <button class="collapse-btn">☰</button>
    </div>
    <nav class="sidebar-nav">
      <a href="#" class="nav-item active">石楼动态资讯</a>
      <a href="#" class="nav-item">隐患舆情监测</a>
    </nav>
  </aside>
  <main class="layout-main">
    <header class="main-header">
      <div class="breadcrumb">首页 / 石楼动态资讯</div>
      <div class="user-info">值班员：张三</div>
    </header>
    <div class="main-content">
      <!-- 此处放置动态资讯模块的所有内容（统计卡片、筛选栏、表格） -->
    </div>
  </main>
</div>
```

### 11. AI 执行检查清单

- [ ] 是否采用了 `display: flex` 实现左右两栏？
- [ ] 侧栏是否具有折叠/展开功能（通过 CSS 类或 data 属性）？
- [ ] 右侧内容区是否独立滚动（不依赖全屏滚动）？
- [ ] 是否完全保留了设计令牌中的颜色、圆角、字体、间距等变量？
- [ ] 统计卡片是否使用网格布局，并保留原有指标？
- [ ] 表格是否保持在卡片容器内？

