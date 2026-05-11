# Git 提交规范 (Git Commit Standards)

> 基于 [Conventional Commits v1.0.0](https://www.conventionalcommits.org/zh-hans/v1.0.0/)

---

## 一、Commit Message 格式

每次提交信息必须符合以下格式：

```
<type>(<scope>): <subject>

<body>

<footer>
```

### 格式说明

| 字段 | 必填 | 说明 |
|------|------|------|
| `type` | ✅ | 提交类型，定义本次提交的类别 |
| `scope` | ❌ | 影响范围，表示本次改动影响的模块/文件/功能区域 |
| `subject` | ✅ | 简短描述，说明本次改动的核心内容 |
| `body` | ❌ | 详细描述，说明改动的原因、上下文、与之前行为的对比等 |
| `footer` | ❌ | 脚注，通常用于关联 issue（如 `Closes #123`）或标注破坏性变更（BREAKING CHANGE） |

### 格式规则

1. **subject** 不超过 72 个字符。
2. **subject** 使用中文或英文均可，但同一项目需统一（推荐中文）。
3. **subject** 不要以句号结尾。
4. **body** 与 **subject** 之间空一行。
5. **body** 每行不超过 72 个字符。
6. 使用 `git commit -m` 时，如需 body/footer，使用多个 `-m` 参数。

---

## 二、Type 类型定义

| Type | 用途 | 示例 |
|------|------|------|
| `feat` | 新功能 | `feat(user): 新增用户注册页面` |
| `fix` | 修复 Bug | `fix(order): 修复订单列表分页异常` |
| `docs` | 仅文档变更 | `docs(readme): 更新项目启动说明` |
| `style` | 代码风格（不影响功能：空格、分号、格式等） | `style(user): 统一缩进为 2 空格` |
| `refactor` | 代码重构（不新增功能、不修复 Bug） | `refactor(api): 提取公共请求拦截器` |
| `perf` | 性能优化 | `perf(list): 用虚拟滚动优化大数据量列表` |
| `test` | 测试相关（新增/修改测试用例） | `test(user): 增加用户登录单元测试` |
| `chore` | 构建过程 / 工具 / 依赖变更 | `chore(deps): 升级 Element Plus 到 2.15` |
| `ci` | CI/CD 配置变更 | `ci: 添加自动化部署脚本` |
| `revert` | 回滚某次提交 | `revert: 回滚 feat(user) 提交` |

---

## 三、Scope 范围约定

Scope 应使用项目中的模块名或文件名，建议使用小写英文：

```
feat(user)      → 用户模块
fix(order)      → 订单模块
refactor(utils) → 工具函数
chore(deps)     → 依赖管理
docs(readme)    → README 文档
style(global)   → 全局样式
```

若一次改动涉及多个范围，可拆分为多次提交，或在 body 中说明。

---

## 四、完整示例

### 示例 1：简单提交

```
feat(user): 新增用户信息编辑功能
```

### 示例 2：含 body 的提交

```
fix(order): 修复订单详情页金额精度丢失问题

订单金额字段由浮点数切换为 Decimal 类型后，
前端展示未做对应转换，导致小数位显示异常。
本次改为使用 toFixed(2) 统一处理。
```

### 示例 3：含 footer 的提交

```
feat(login): 新增短信验证码登录

支持手机号 + 短信验证码方式登录，
兼容原有的账号密码登录方式。

Closes #42
```

### 示例 4：破坏性变更

```
feat(api)!: 重构用户接口响应结构

BREAKING CHANGE: 所有接口统一返回 { code, data, message } 格式，
旧版 { result, msg } 格式不再支持。
```

> 💡 在 type 后加 `!` 或在 footer 中添加 `BREAKING CHANGE:` 均可标记破坏性变更。

---

## 五、分支命名规范

| 分支类型 | 命名格式 | 示例 |
|---------|---------|------|
| 主分支 | `main` / `master` | — |
| 开发分支 | `develop` | — |
| 功能分支 | `feature/<模块>-<简述>` | `feature/user-login`、`feature/order-export` |
| 修复分支 | `fix/<模块>-<简述>` | `fix/order-pagination`、`fix/login-redirect` |
| 紧急修复 | `hotfix/<版本>-<简述>` | `hotfix/v1.2.1-payment` |
| 发布分支 | `release/<版本号>` | `release/v1.3.0` |

规则：
- 分支名全小写，单词之间用 `-` 分隔。
- 功能开发从 `develop` 拉分支，完成后合并回 `develop`。
- Hotfix 从 `main` 拉分支，修复后合并到 `main` 和 `develop`。

---

## 六、提交流程约束

1. **提交前自检**
   - 代码已在本地编译通过 (`npm run build`)。
   - 无多余的 `console.log` / `debugger` 语句。
   - 相关的无用注释已清理。
   - 不提交 `node_modules`、`dist`、`.env` 等文件（参考 `.gitignore`）。

2. **提交粒度**
   - 一次提交只做一件事（一个功能点 / 一次修复 / 一次重构）。
   - 不要将不相干的改动放入同一次提交。

3. **Commit Message 校验（推荐）**
   - 建议配置 `commitlint` + `husky` 在提交时自动校验 message 格式。

---

## 七、常见错误与纠正

| 错误示例 | 问题 | 正确写法 |
|---------|------|---------|
| `update code` | type 缺失，语义不明 | `feat(user): 新增用户列表筛选功能` |
| `feat:新增功能` | `：` 后面缺少空格 | `feat: 新增功能` |
| `Fix bug` | 首字母不应大写 | `fix: 修复登录页验证码错误` |
| `feat(user): 完成了一个很长的描述信息超过了72个字符的限制这不符合规范要求` | subject 过长 | 缩写，详细信息放 body |