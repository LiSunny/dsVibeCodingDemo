# 样式使用规范 (Style Standards)

> 适用技术栈：Vue 3 + Element Plus + 原生 CSS / scoped CSS  
> 设计令牌数据来源：Figma 设计变量 (colors / spacing / radius / typography)

---

## 一、样式作用域约定

### 1.1 组件样式：默认使用 `<style scoped>`

所有 Vue 组件内的样式必须添加 `scoped` 属性，防止样式泄漏到其他组件。

```vue
<!-- ✅ 推荐 -->
<style scoped>
.user-card {
  padding: var(--spacing-md);
}
</style>

<!-- ❌ 禁止（除非在全局样式文件中） -->
<style>
.user-card {
  padding: var(--spacing-md);
}
</style>
```

### 1.2 全局样式：限定在 `src/style.css`

- 全局样式（如 reset、body、`#app`、全局字体、CSS 变量等）统一放在 `src/style.css`。
- `src/style.css` 在 `main.js` 中已引入，不要在其他组件中重复引入。
- 禁止在组件内编写不带 `scoped` 的全局样式，除非有明确且文档化的理由。

---

## 二、CSS 类名命名规范

### 2.1 推荐：kebab-case

组件内 CSS 类名统一使用 **kebab-case**（小写单词 + 中横线分隔）。

```vue
<!-- ✅ 推荐 -->
<template>
  <div class="user-info-card">
    <span class="user-name">张三</span>
    <span class="user-email">zhangsan@example.com</span>
  </div>
</template>

<style scoped>
.user-info-card { /* ... */ }
.user-name { /* ... */ }
.user-email { /* ... */ }
</style>
```

### 2.2 可选：类 BEM 风格

当组件结构较复杂时，可采用类 BEM 风格增强可读性：

```
.block {}
.block__element {}
.block--modifier {}
```

### 2.3 禁止事项

- 禁止使用无意义的单字母类名（`.a`、`.b`）。
- 禁止使用驼峰类名（`.userName`）。
- 禁止直接使用 Element Plus 内部类名作为依赖（`.el-button` 内部结构类）。

---

## 三、Element Plus 样式覆盖

### 3.1 使用 `:deep()` 穿透样式

```vue
<style scoped>
/* ✅ 推荐 */
.my-form :deep(.el-input__inner) {
  border-radius: var(--radius-md);
  background: var(--fill-surface);
}

/* ❌ 禁止：使用 /deep/ 或 >>>（已废弃） */
</style>
```

### 3.2 覆盖原则

- 优先通过 Element Plus 的 **props**（如 `size`、`type`、`effect`）控制样式，而非 CSS 覆盖。
- 仅在 props 不满足需求时才使用 `:deep()` 覆盖。
- 覆盖样式应限定在组件局部，不得影响全局。

### 3.3 全局覆盖场景

若确实需要全局调整 Element Plus 主题，在 `src/style.css` 中已通过 CSS 变量覆盖，无需额外处理：

```css
/* src/style.css —— 已内置 */
:root {
  --el-color-primary:   var(--color-primary);
  --el-color-success:   var(--color-success);
  --el-color-warning:   var(--color-warning);
  --el-color-danger:    var(--color-danger);
  --el-color-info:      var(--color-info);
  --el-border-radius-base: var(--radius-md);
}
```

---

## 四、设计令牌与主题系统

> 所有设计令牌统一定义在 `src/style.css`，数据来源为 Figma 设计变量。  
> 支持浅色模式（默认）和深色模式（`<html class="dark">`）。  
> 切换方式为**手动控制**：通过 `<html>` 元素的 `dark` 类名切换。

### 4.1 颜色令牌 (Color)

#### 4.1.1 背景色 (Fill / Background)

| CSS 变量 | Figma 变量 | 浅色模式 | 深色模式 |
|---------|-----------|---------|---------|
| `--fill-page` | `background/main` | `#E4E4E4` | `#002B59` |
| `--fill-surface` | `background/card` | `#FFFFFF` | `#003670` |
| `--fill-secondary` | `background/sub-card` | `#FBFBFB` | `#003b7aca` |
| `--fill-hover` | `background/card-hover` | `#9393932e` | `rgba(249,250,251,0.08)` |
| `--fill-mask` | — | `rgba(0,0,0,0.45)` | `rgba(0,0,0,0.6)` |

#### 4.1.2 文字颜色 (Text)

| CSS 变量 | Figma 变量 | 浅色模式 | 深色模式 |
|---------|-----------|---------|---------|
| `--text-primary` | `text/primary` | `#101010` | `#FFFFFF` |
| `--text-secondary` | `text/secondary` | `#2E2E2E` | `#e4e4e4` |
| `--text-muted` | `text/muted` | `#5E5E5E` | `#8892B0` |
| `--text-inverse` | — | `#FFFFFF` | `#121218` |

#### 4.1.3 品牌色 (Accent / Brand)

| CSS 变量 | Figma 变量 | 浅色模式 | 深色模式 |
|---------|-----------|---------|---------|
| `--color-primary` | `accent/primary` | `#3678E3` | `#00E5FF` |
| `--color-primary-dark` | `accent/dark` | `#204785` | `#0091EA` |

#### 4.1.4 语义色 (Semantic)

| CSS 变量 | Figma 变量 | 浅色模式 | 深色模式 |
|---------|-----------|---------|---------|
| `--color-success` | `semantic/success` | `#059669` | `#4CAF50` |
| `--color-warning` | `semantic/warning` | `#D97706` | `#FF9800` |
| `--color-danger` | `semantic/danger` | `#DC2626` | `#F44336` |
| `--color-info` | `semantic/info` | `#3678E3` | `#00E5FF` |
| `--color-notice` | `semantic/notice` | `#CA8A04` | `#FFD600` |

每种语义色均配有对应的背景色和边框色变量：

| 后缀 | 透明度（Light） | 透明度（Dark） |
|-----|-------------|------------|
| `-bg` | `0.1` | `0.13` |
| `-border` | `0.2` | `0.25` |

示例：

```css
/* success 语义色 */
--color-success:         #059669;                       /* 主色 */
--color-success-bg:      rgba(5, 150, 105, 0.1);        /* 背景 */
--color-success-border:  rgba(5, 150, 105, 0.2);        /* 边框 */
```

#### 4.1.5 边框颜色 (Border)

| CSS 变量 | Figma 变量 | 浅色模式 | 深色模式 |
|---------|-----------|---------|---------|
| `--border-primary` | `border/high` | `#D3D3D3` | `#004E7E` |
| `--border-default` | `border/default` | `#E9E9E9` | `#004774` |
| `--border-low` | `border/low` | `#F3F3F3` | `rgba(0,67,109,0.69)` |
| `--border-focus` | `border/hover` | `rgba(54,120,227,0.19)` | `rgba(0,229,255,0.2)` |

#### 4.1.6 阴影 (Shadow)

| CSS 变量 | Figma 变量 | 浅色模式 | 深色模式 |
|---------|-----------|---------|---------|
| `--shadow-accent` | `shadow/accent` | `rgba(54,120,227,0.15)` | `rgba(255,255,255,0.3)` |
| `--shadow-sm` | — | `0 1px 2px rgba(0,0,0,.06)` | `0 1px 3px rgba(255,255,255,0.06)` |
| `--shadow-md` | — | `0 4px 12px rgba(0,0,0,.08)` | `0 4px 16px rgba(255,255,255,0.08)` |
| `--shadow-lg` | — | `0 8px 24px rgba(0,0,0,.12)` | `0 8px 32px rgba(255,255,255,0.12)` |
| `--shadow-xl` | — | `0 16px 48px rgba(0,0,0,.16)` | `0 16px 64px rgba(255,255,255,0.16)` |

#### 4.1.7 侧边栏 (Sidebar)

| CSS 变量 | 浅色模式 | 深色模式 |
|---------|---------|---------|
| `--sidebar-bg` | `#ffffff` | `#003670` |
| `--sidebar-text` | `var(--text-primary)` | `#dee4f7` |
| `--sidebar-active` | `var(--color-primary)` | `var(--color-primary)` |
| `--sidebar-hover-bg` | `#ebebeb8c` | `#c6c6c632` |
| `--sidebar-width-expanded` | `240px` | `240px` |
| `--sidebar-width-collapsed` | `64px` | `64px` |

#### 4.1.8 布局尺寸 (Layout)

| CSS 变量 | 值 | 使用场景 |
|---------|-----|---------|
| `--header-height` | `48px` | 顶部面包屑/用户信息区高度 |
| `--table-row-height` | `48px` | 表格行高 |

#### 4.1.9 骨架屏 (Skeleton)

| CSS 变量 | 浅色模式 | 深色模式 |
|---------|---------|---------|
| `--el-skeleton-color` | `#f0f0f0` | `rgba(255, 255, 255, 0.06)` |
| `--el-skeleton-to-color` | `#e0e0e0` | `rgba(255, 255, 255, 0.12)` |

#### 4.1.10 Element Plus 深色模式主题变量

以下变量仅在深色模式下生效，覆盖 Element Plus 组件内部样式：

| CSS 变量组 | 主要变量 | 使用场景 |
|-----------|---------|---------|
| Input 输入框 | `--el-input-bg-color`, `--el-input-border-color`, `--el-input-text-color`, `--el-input-placeholder-color` | 深色模式下输入框样式 |
| Select 下拉选择器 | `--el-select-border-color-hover`, `--el-select-input-focus-border-color`, `--el-select-dropdown-bg-color`, `--el-select-dropdown-item-color` | 深色模式下下拉组件样式 |
| Radio Button | `--el-radio-button-bg-color`, `--el-radio-button-checked-bg-color`, `--el-radio-button-checked-text-color` | 深色模式下单选按钮组样式 |

### 4.2 间距令牌 (Spacing)

Figma 定义的数字标号间距，建议优先使用**语义化别名**：

| Figma 变量 | 原始值 | CSS 变量（数字） | 语义化别名（推荐） |
|-----------|--------|---------------|----------------|
| `0` | `0` | `--spacing-0: 0` | — |
| `2` | `2px` | `--spacing-2: 2px` | — |
| `4` | `4px` | `--spacing-4: 4px` | `--spacing-xs` |
| `8` | `8px` | `--spacing-8: 8px` | `--spacing-sm` |
| `12` | `12px` | `--spacing-12: 12px` | — |
| `16` | `16px` | `--spacing-16: 16px` | `--spacing-md` |
| `24` | `24px` | `--spacing-24: 24px` | `--spacing-lg` |

```css
/* ✅ 使用语义化别名（推荐） */
.card {
  padding: var(--spacing-md);
  margin-bottom: var(--spacing-lg);
  gap: var(--spacing-sm);
}

/* ✅ 直接使用数字变量 */
.card {
  padding: var(--spacing-16);
  margin-bottom: var(--spacing-24);
}
```

### 4.3 圆角令牌 (Border Radius)

| Figma 变量 | CSS 变量 | 值 | 使用场景 |
|-----------|---------|-----|---------|
| `sm` | `--radius-sm` | `6px` | 小按钮、标签、Badge |
| `md` | `--radius-md` | `8px` | 标准按钮、输入框、卡片 |
| `lg` | `--radius-lg` | `10px` | 弹窗、大卡片 |
| `xl` | `--radius-xl` | `14px` | 面板 |
| — | `--radius-round` | `999px` | 胶囊按钮、头像 |

### 4.4 字体排版令牌 (Typography)

#### 4.4.1 字号 (Font Size)

| Figma 变量 | CSS 变量 | 值 | 使用场景 |
|-----------|---------|-----|---------|
| `fontSize/xs` | `--font-size-xs` | `12px` | 辅助文字、标签 |
| `fontSize/small` | `--font-size-small` | `14px` | 次要文字 |
| `fontSize/body` | `--font-size-body` | `16px` | 正文 |
| `fontSize/h4` | `--font-size-h4` | `16px` | 四级标题 |
| `fontSize/h3` | `--font-size-h3` | `18px` | 三级标题 |
| `fontSize/h2` | `--font-size-h2` | `20px` | 二级标题 |
| `fontSize/h1` | `--font-size-h1` | `24px` | 一级标题 |

#### 4.4.2 字重 (Font Weight)

| Figma 变量 | CSS 变量 | 值 | 说明 |
|-----------|---------|-----|------|
| `fontWeight/regular` | `--font-weight-regular` | `400` | 常规 |
| `fontWeight/medium` | `--font-weight-medium` | `500` | 中等 |
| `fontWeight/bold` | `--font-weight-bold` | `800` | 加粗 |
| `fontWeight/heavy` | `--font-weight-heavy` | `900` | 重磅（Figma=1000，CSS 上限 900） |

#### 4.4.3 行高 (Line Height)

| Figma 变量 | CSS 变量 | 值 |
|-----------|---------|-----|
| `lineHeight/default` | `--line-height-normal` | `1.5` |

#### 4.4.4 字体族 (Font Family)

| Figma 变量 | CSS 变量 | 值 |
|-----------|---------|-----|
| `fontFamily/base` | `--font-family-base` | `-apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', ...` |
| `fontFamily/mono` | `--font-family-mono` | `'SF Mono', 'Monaco', 'Menlo', 'Consolas', monospace` |

---

## 五、深色模式切换

通过 `<html>` 元素上添加/移除 `dark` 类名进行手动切换：

```html
<!-- 浅色模式（默认） -->
<html>...</html>

<!-- 深色模式 -->
<html class="dark">...</html>
```

```javascript
// 切换示例
document.documentElement.classList.toggle('dark')

// Vue 中使用 ref 控制
const isDark = ref(false)

function toggleTheme() {
  isDark.value = !isDark.value
  document.documentElement.classList.toggle('dark', isDark.value)
}
```

---

## 六、变量使用规范

- 所有颜色、间距、圆角、阴影**必须使用 CSS 变量**，禁止硬编码。
- 文字颜色用 `--text-*`，背景用 `--fill-*`，边框用 `--border-*`。
- 组件内 `color` 和 `background` **务必成对使用**，确保在两种模式下均保持可读性。

```css
/* ✅ 推荐 */
.card {
  color: var(--text-primary);
  background: var(--fill-surface);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-md);
  padding: var(--spacing-md);
}

/* ❌ 禁止：硬编码颜色（深色模式下不可读） */
.card {
  color: #333;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 6px;
  padding: 16px;
}
```

---

## 七、语义色使用模式

每种语义色（success / warning / danger / info / notice）提供三个层级的变量：

```css
/* 使用示例：成功提示条 */
.alert-success {
  color: var(--color-success);
  background: var(--color-success-bg);
  border: 1px solid var(--color-success-border);
  border-radius: var(--radius-sm);
  padding: var(--spacing-sm) var(--spacing-md);
}

/* 使用示例：纯色按钮 */
.btn-danger {
  background: var(--color-danger);
  color: var(--text-inverse);
  border: none;
}
```

---

## 八、布局规范

### 8.1 页级布局

页面整体布局使用 Element Plus 的 `el-container` / `el-main` / `el-row` / `el-col` 体系。

### 8.2 Flexbox 约定

组件内部布局优先使用 Flexbox：

```css
.flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
}

.flex-between {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
```

### 8.3 间距约定

- 间距优先使用 `gap` 属性（`flex` / `grid` 布局）。
- 所有间距值使用 CSS 变量。

```css
.card-list {
  display: flex;
  gap: var(--spacing-md);
  flex-wrap: wrap;
}
```

---

## 九、响应式设计

### 9.1 断点定义

| 断点名称 | 屏幕宽度 | 适用场景 |
|---------|---------|---------|
| `xs` | < 768px | 手机 |
| `sm` | ≥ 768px | 平板竖屏 |
| `md` | ≥ 992px | 平板横屏 / 小桌面 |
| `lg` | ≥ 1200px | 桌面 |
| `xl` | ≥ 1920px | 大屏 / 超宽桌面 |

### 9.2 响应式写法

- 组件内使用 `@media` 查询。
- 优先使用 Element Plus 的响应式栅格（`el-row`/`el-col` 的 `xs`、`sm`、`md`、`lg`、`xl` 属性）。

---

## 十、禁止事项汇总

| 禁止项 | 说明 |
|-------|------|
| ❌ 组件内使用全局 `<style>` 无 scoped | 样式污染其他组件 |
| ❌ 使用废弃的 `/deep/` 或 `>>>` | 使用 `:deep()` 替代 |
| ❌ 行内样式（`style=""`） | 难以维护，仅在动态值场景可用 |
| ❌ `!important` | 打乱优先级体系，除非作为最后手段且加注释说明 |
| ❌ 直接覆盖 Element Plus 内部 DOM 层类名 | 依赖版本，易在升级后失效 |
| ❌ **硬编码颜色值或尺寸** | **必须使用 CSS 变量** |

---

## 十一、设计令牌变更记录

| 日期 | 变更内容 | 来源 |
|------|---------|------|
| 2026-05-11 | 完全按 Figma 设计变量重构所有设计令牌 | colors / spacing / radius / typography JSON |