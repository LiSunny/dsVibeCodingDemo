<!--
  组件名称: SysTable
  用途: 系统通用表格+分页组件，封装 Element Plus el-table + el-pagination，统一使用设计令牌
  设计令牌: 全部使用 CSS 变量，支持浅色/深色模式，符合 style-standards.md 规范

  Props:
    data          - 表格数据 Array
    columns       - 列配置 Array<{ prop, label, width, minWidth, align, fixed, sortable, formatter, slot }>
    stripe        - 是否斑马纹
    border        - 是否显示边框（默认 true）
    maxHeight     - 表格最大高度
    height        - 表格固定高度
    showHeader    - 是否显示表头（默认 true）
    emptyText     - 空数据提示文字
    loading       - 是否加载中
    rowKey        - 行唯一键（默认 'id'）
    pagination    - 是否显示分页（Boolean | Object { pageSize, layout, pageSizes }）
    total         - 数据总数（分页用）
    currentPage   - 当前页码（v-model）
    pageSize      - 每页条数（v-model）

  Events:
    current-change  - 页码变化 (page)
    size-change     - 每页条数变化 (size)
    sort-change     - 排序变化 (sortInfo)
    row-click       - 行点击 (row, column, event)
    selection-change - 选择变化 (selection)

  Slots:
    默认插槽: 用于自定义整个表格内容（完全自定义模式）
    具名插槽: column.slot 指定 name 的插槽，如 slot="status" → <template #status="{ row }">
    append:    el-table 的 append 插槽
    empty:     空数据插槽
-->
<script setup>
import { computed, nextTick, ref, watch } from 'vue'

const props = defineProps({
  data: {
    type: Array,
    default: () => [],
  },
  columns: {
    type: Array,
    default: () => [],
  },
  stripe: {
    type: Boolean,
    default: false,
  },
  border: {
    type: Boolean,
    default: true,
  },
  maxHeight: {
    type: [String, Number],
    default: undefined,
  },
  height: {
    type: [String, Number],
    default: undefined,
  },
  showHeader: {
    type: Boolean,
    default: true,
  },
  emptyText: {
    type: String,
    default: '暂无数据',
  },
  loading: {
    type: Boolean,
    default: false,
  },
  rowKey: {
    type: String,
    default: 'id',
  },
  pagination: {
    type: [Boolean, Object],
    default: false,
  },
  total: {
    type: Number,
    default: 0,
  },
  currentPage: {
    type: Number,
    default: 1,
  },
  pageSize: {
    type: Number,
    default: 10,
  },
  fit: {
    type: Boolean,
    default: true,
  },
})

const emit = defineEmits([
  'update:currentPage',
  'update:pageSize',
  'current-change',
  'size-change',
  'sort-change',
  'row-click',
  'selection-change',
])

// 分页配置
const paginationConfig = computed(() => {
  if (typeof props.pagination === 'object') {
    return {
      pageSize: props.pagination.pageSize ?? props.pageSize,
      layout: props.pagination.layout ?? 'total, sizes, prev, pager, next, jumper',
      pageSizes: props.pagination.pageSizes ?? [10, 20, 50, 100],
    }
  }
  return {
    pageSize: props.pageSize,
    layout: 'total, sizes, prev, pager, next, jumper',
    pageSizes: [10, 20, 50, 100],
  }
})

// 是否显示分页
const showPagination = computed(() => {
  return !!props.pagination
})

// 内部当前页（双向绑定）
const innerCurrentPage = ref(props.currentPage)
const innerPageSize = ref(typeof props.pagination === 'object' ? props.pagination.pageSize ?? props.pageSize : props.pageSize)

watch(() => props.currentPage, (val) => { innerCurrentPage.value = val })
watch(() => props.pageSize, (val) => { innerPageSize.value = val })

// 需要自定义插槽的列 prop 集合
const slotColumns = computed(() => {
  return props.columns.filter(col => col.slot).map(col => col.slot || col.prop)
})

// 处理列配置：确保至少有一列（最后一列非 fixed 列）不使用固定 width，
// 使其自适应填充剩余空间，避免拖拽列宽后出现留白
const processedColumns = computed(() => {
  const cols = props.columns
  if (!cols.length) return cols

  // 找出所有未设置 fixed 的列
  const flexibleCols = cols.filter(c => !c.fixed)
  if (flexibleCols.length === 0) return cols

  // 如果所有非 fixed 列都有固定 width，去掉最后一列的 width，让其自动填充
  const allHaveWidth = flexibleCols.every(
    c => c.width !== undefined && c.width !== null && c.width !== ''
  )
  if (!allHaveWidth) return cols

  return cols.map((col, idx) => {
    // 找到最后一个非 fixed 列的原始索引
    const lastFlexibleIdx = cols.lastIndexOf(
      flexibleCols[flexibleCols.length - 1]
    )
    if (idx === lastFlexibleIdx) {
      const { width, ...rest } = col
      return rest
    }
    return col
  })
})

function handleCurrentChange(page) {
  innerCurrentPage.value = page
  emit('update:currentPage', page)
  emit('current-change', page)
}

function handleSizeChange(size) {
  innerPageSize.value = size
  emit('update:pageSize', size)
  emit('size-change', size)
}

function handleSortChange(sortInfo) {
  emit('sort-change', sortInfo)
}

function handleRowClick(row, column, event) {
  emit('row-click', row, column, event)
}

function handleSelectionChange(selection) {
  emit('selection-change', selection)
}

// el-table 组件引用
const tableRef = ref(null)

// 拖拽列宽后消除留白：重置所有非 fixed 列的宽度 + 强制重新布局
function handleHeaderDragEnd() {
  nextTick(() => {
    const store = tableRef.value?.store
    if (!store) return

    const columns = store.states.columns?.value || store.states.columns || []

    // 遍历所有非 fixed 列，清空其内部记录的固定宽度
    // 让 doLayout 重新按自适应规则计算
    columns.forEach((col) => {
      if (!col.fixed) {
        col.width = undefined
        col.realWidth = undefined
        col.minWidth = undefined
      }
    })

    // 触发 el-table 完整重新布局
    tableRef.value?.doLayout()
  })
}

// el-table 的 CSS 变量注入
const tableVars = computed(() => ({
  '--el-table-border-color': 'var(--border-default)',
  '--el-table-row-hover-bg-color': 'var(--fill-hover)',
  '--el-table-header-bg-color': 'var(--fill-surface)',
  '--el-table-header-text-color': 'var(--text-primary)',
  '--el-table-text-color': 'var(--text-secondary)',
  '--el-table-tr-bg-color': 'var(--fill-surface)',
  '--el-fill-color-lighter': 'var(--fill-secondary)',
  '--el-font-size-base': 'var(--font-size-small)',
}))

// el-pagination 的 CSS 变量注入
const paginationVars = computed(() => ({
  '--el-pagination-button-bg-color': 'var(--fill-secondary)',
  '--el-pagination-hover-color': 'var(--color-primary)',
  '--el-pagination-button-color': 'var(--text-primary)',
  '--el-pagination-text-color': 'var(--text-secondary)',
  '--el-pagination-border-radius': 'var(--radius-sm)',
  '--el-pagination-font-size': 'var(--font-size-xs)',
  '--el-color-primary': 'var(--color-primary)',
}))
</script>

<template>
  <div class="sys-table-wrapper">
    <!-- 表格 -->
    <el-table
      ref="tableRef"
      :data="data"
      :stripe="stripe"
      :border="border"
      :max-height="maxHeight"
      :height="height"
      :show-header="showHeader"
      :row-key="rowKey"
      :loading="loading"
      :fit="fit"
      :style="tableVars"
      class="sys-table"
      @sort-change="handleSortChange"
      @row-click="handleRowClick"
      @selection-change="handleSelectionChange"
      @header-dragend="handleHeaderDragEnd"
    >
      <!-- 空数据状态 -->
      <template v-if="!$slots.empty" #empty>
        <div class="sys-table-empty">
          <span class="sys-table-empty__text">{{ emptyText }}</span>
        </div>
      </template>
      <template #empty v-else>
        <slot name="empty" />
      </template>

      <!-- 列定义 -->
      <el-table-column
        v-for="col in processedColumns"
        :key="col.prop || col.label"
        :prop="col.prop"
        :label="col.label"
        :width="col.width"
        :min-width="col.minWidth"
        :align="col.align || 'left'"
        :fixed="col.fixed"
        :sortable="col.sortable"
        :formatter="col.formatter"
        :show-overflow-tooltip="col.showOverflowTooltip"
      >
        <!-- 自定义插槽列 -->
        <template v-if="col.slot" #default="{ row, column, $index }">
          <slot :name="col.slot" :row="row" :column="column" :index="$index" />
        </template>
      </el-table-column>

      <!-- append 插槽 -->
      <template v-if="$slots.append" #append>
        <slot name="append" />
      </template>
    </el-table>

    <!-- 分页 -->
    <div v-if="showPagination" class="sys-table-pagination" :style="paginationVars">
      <el-pagination
        v-model:current-page="innerCurrentPage"
        v-model:page-size="innerPageSize"
        :page-sizes="paginationConfig.pageSizes"
        :layout="paginationConfig.layout"
        :total="total || data.length"
        background
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
      />
    </div>
  </div>
</template>

<style scoped>
/* ============================================================
 * SysTable 封装 - 设计令牌统一
 * ============================================================ */

.sys-table-wrapper {
  width: 100%;
}

/* 表格基础 */
.sys-table {
  width: 100%;
  font-family: var(--font-family-base);
  border-radius: var(--radius-md);
}

/* 横向自适应填充 - 内部 <table> 使用 auto 布局，最后一列自动拉伸填满容器 */
.sys-table :deep(.el-table__header),
.sys-table :deep(.el-table__body),
.sys-table :deep(.el-table__footer) {
  width: 100% !important;
}

.sys-table :deep(table) {
  table-layout: auto !important;
}


/* 表头样式 */
.sys-table :deep(.el-table__header-wrapper th) {
  font-weight: var(--font-weight-medium);
  font-size: var(--font-size-small);
}

/* 表格体 */
.sys-table :deep(.el-table__body-wrapper td) {
  font-size: var(--font-size-small);
}

/* 排序图标颜色 */
.sys-table :deep(.el-table__sort-icon .caret-wrapper .sort-caret.ascending) {
  border-bottom-color: var(--color-primary);
}
.sys-table :deep(.el-table__sort-icon .caret-wrapper .sort-caret.descending) {
  border-top-color: var(--color-primary);
}

/* 加载状态 */
.sys-table :deep(.el-loading-mask) {
  background-color: var(--fill-mask);
}

/* 空数据 */
.sys-table-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-lg) 0;
  color: var(--text-muted);
}

.sys-table-empty__text {
  font-size: var(--font-size-small);
  color: var(--text-muted);
}

/* 分页容器 */
.sys-table-pagination {
  display: flex;
  justify-content: flex-end;
  padding: var(--spacing-md) 0;
}

/* 分页器按钮 */
.sys-table-pagination :deep(.el-pagination .btn-prev),
.sys-table-pagination :deep(.el-pagination .btn-next),
.sys-table-pagination :deep(.el-pager li) {
  border-radius: var(--radius-sm);
}

/* 分页文字 */
.sys-table-pagination :deep(.el-pagination__total),
.sys-table-pagination :deep(.el-pagination__sizes .el-select .el-input__inner) {
  font-size: var(--font-size-xs);
  color: var(--text-secondary);
}

/* 分页选择器 */
.sys-table-pagination :deep(.el-select .el-input__wrapper) {
  border-radius: var(--radius-sm);
}

.sys-table-pagination :deep(.el-select .el-input__inner) {
  font-size: var(--font-size-xs);
}
</style>