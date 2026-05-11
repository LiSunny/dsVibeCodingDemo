# 编码规范 (Coding Standards)

> 适用技术栈：Vue 3 (Composition API + `<script setup>`) + Vite + Element Plus

---

## 一、命名规范

### 1.1 文件命名

| 类型 | 规范 | 示例 |
|------|------|------|
| Vue 组件文件 | PascalCase | `UserProfile.vue`、`OrderList.vue` |
| 组合式函数 (Composables) | camelCase，以 `use` 开头 | `useUser.ts`、`usePagination.ts` |
| 工具函数 / 常量文件 | camelCase | `formatDate.ts`、`apiConfig.ts` |
| 样式文件 | kebab-case | `user-profile.css` |
| 资源文件 | kebab-case | `hero-bg.png`、`default-avatar.svg` |

### 1.2 变量与函数命名

| 类型 | 规范 | 示例 |
|------|------|------|
| 变量（普通） | camelCase | `userName`、`orderList` |
| 响应式变量 | camelCase | `const count = ref(0)` |
| 常量（编译时） | UPPER_SNAKE_CASE | `MAX_RETRY_COUNT`、`API_BASE_URL` |
| 函数 / 方法 | camelCase | `fetchUserData()`、`handleSubmit()` |
| 事件处理函数 | `handle` + 动作 | `handleClick()`、`handleInputChange()` |
| 组合式函数 | `use` + 名词 | `useRouter()`、`useCounter()` |
| 布尔变量 | `is` / `has` / `can` 前缀 | `isVisible`、`hasPermission`、`canEdit` |

### 1.3 组件命名

- Vue SFC 文件名使用 **PascalCase**。
- 模板中使用 Element Plus 组件时使用 `El` 前缀（`el-button`、`el-dialog`），项目已配置 `unplugin-vue-components` 自动导入。
- 自定义组件模板中使用 PascalCase 或 kebab-case 均可，**统一使用 PascalCase** 以保证一致性。

```vue
<!-- ✅ 推荐 -->
<template>
  <UserCard :user="user" />
</template>

<!-- ❌ 不推荐 —— 风格混用 -->
<template>
  <user-card :user="user"></user-card>
</template>
```

---

## 二、Vue SFC 结构规范

### 2.1 块级顺序

每个 `.vue` 单文件组件按以下顺序组织：

```vue
<!-- 1. <script setup> —— 脚本逻辑 -->
<script setup>
// ...
</script>

<!-- 2. <template> —— 模板 -->
<template>
  <!-- ... -->
</template>

<!-- 3. <style scoped> —— 组件样式 -->
<style scoped>
/* ... */
</style>
```

### 2.2 `<script setup>` 内部结构

```
1. import 声明（Vue API）
2. import 声明（第三方库）
3. import 声明（项目内部模块 / 组件）
4. Props / Emits 定义
5. 响应式状态（ref / reactive）
6. 计算属性（computed）
7. 监听器（watch / watchEffect）
8. 生命周期钩子
9. 方法定义
10. 组合式函数调用
```

```vue
<script setup>
// 1. Vue API
import { ref, computed, watch, onMounted } from 'vue'

// 2. 第三方库
import { ElMessage } from 'element-plus'
import { debounce } from 'lodash-es'

// 3. 项目内部模块
import UserCard from '@/components/UserCard.vue'
import { useUserStore } from '@/stores/user'

// 4. Props / Emits
const props = defineProps({
  userId: { type: Number, required: true }
})
const emit = defineEmits(['update', 'delete'])

// 5. 响应式状态
const user = ref(null)
const loading = ref(false)

// 6. 计算属性
const displayName = computed(() => user.value?.name ?? '未知用户')

// 7. 监听器
watch(() => props.userId, (newId) => {
  fetchUser(newId)
})

// 8. 生命周期
onMounted(() => {
  fetchUser(props.userId)
})

// 9. 方法
async function fetchUser(id) {
  loading.value = true
  try {
    user.value = await getUserApi(id)
  } finally {
    loading.value = false
  }
}
</script>
```

### 2.3 Props 定义

- 使用 TypeScript 风格的类型声明（`defineProps` 字面量类型或泛型）。
- 必填项显式标注 `required: true`。
- 提供合理的默认值。

```vue
<script setup>
// ✅ 推荐：类型清晰，含校验
const props = defineProps({
  title: { type: String, required: true },
  count: { type: Number, default: 0 },
  disabled: { type: Boolean, default: false },
  items: { type: Array, default: () => [] },
})

// ✅ 如有 TS，使用泛型
// const props = defineProps<{ title: string; count?: number }>()
</script>
```

---

## 三、Composition API 使用原则

### 3.1 ref vs reactive

| API | 适用场景 |
|-----|----------|
| `ref()` | 基本类型、需要重新赋值的值 |
| `reactive()` | 对象/数组形式的状态集合（如表单数据） |

```javascript
// ✅ 基本类型用 ref
const count = ref(0)
const name = ref('')

// ✅ 表单 / 复杂对象用 reactive
const form = reactive({
  username: '',
  password: '',
  rememberMe: false,
})
```

### 3.2 组合式函数 (Composables)

- 抽取可复用逻辑到 `src/composables/` 目录。
- 函数名以 `use` 开头。
- 返回对象时使用 toRefs 保持响应性。

```javascript
// src/composables/useCounter.js
import { ref } from 'vue'

export function useCounter(initialValue = 0) {
  const count = ref(initialValue)
  const increment = () => count.value++
  const decrement = () => count.value--
  return { count, increment, decrement }
}
```

---

## 四、目录结构规范

```
src/
├── assets/           # 静态资源（图片、字体、图标等），由构建工具处理
├── components/       # 全局 / 共享组件
│   └── common/       # 基础通用组件（Button、Modal 等封装）
├── composables/      # 组合式函数 (use*.js)
├── layout/           # 布局组件
├── router/           # 路由配置（按需）
├── stores/           # 状态管理 (Pinia)
├── styles/           # 全局样式文件
├── utils/            # 工具函数
├── views/            # 页面级路由组件
├── App.vue           # 根组件
└── main.js           # 入口文件
```

规则：
- `components/` 下每个组件一个目录（或一个文件），命名见 1.1。
- 页面级组件放入 `views/`，按路由模块组织。
- 不得在 `App.vue` 中编写业务逻辑。

---

## 五、注释规范

### 5.1 组件注释

每个 Vue 组件文件顶部应包含简短的用途说明：

```vue
<!--
  组件名称: UserCard
  用途: 展示用户头像与基本信息卡片
-->
<script setup>
// ...
</script>
```

### 5.2 函数注释（JSDoc）

```javascript
/**
 * 分页查询用户列表
 * @param {number} page - 当前页号，从 1 开始
 * @param {number} pageSize - 每页条数，默认 20
 * @returns {Promise<{list: Array, total: number}>} 分页结果
 */
async function fetchUsers(page, pageSize = 20) {
  // ...
}
```

### 5.3 标记规范

- `// TODO`: 待实现的功能
- `// FIXME`: 已知问题需要修复
- `// HACK`: 临时方案 / 不优雅的解决方式
- `// NOTE`: 重要说明

```javascript
// TODO(zhangsan): 接入权限校验后需要增加角色筛选
// FIXME: 大数据量时会卡顿，需要做虚拟滚动
// HACK: 后端字段命名不一致，临时做映射
```

---

## 六、Element Plus 使用约定

- 组件已通过 `unplugin-vue-components` 实现按需自动导入，**不需要**手动 import 组件。
- 需要**手动 import** 的仅为指令式调用 API，如 `ElMessage`、`ElNotification`、`ElLoading`。
- 优先使用 Element Plus 提供的组件、图标、布局，避免重复造轮子。

```vue
<script setup>
import { ElMessage } from 'element-plus' // ✅ API 需要手动导入
// el-button、el-dialog 无需手动导入 ✅
</script>