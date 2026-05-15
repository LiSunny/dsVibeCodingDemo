<!--
  组件名称: SysRingChart
  用途: 通用饼图/圆环图组件，基于 AntV G2Plot
  特性:
    - 支持饼图模式（实心）
    - 支持圆环模式（空心）
    - 支持多系列数据
    - 支持图例显示
    - 支持中心统计文字
    - 自动适配浅色/深色主题（CSS 变量动态读取）
    - 主题切换时自动更新颜色
-->
<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import { Pie } from '@antv/g2plot'

const props = defineProps({
  // 图表数据
  data: {
    type: Array,
    required: true,
    default: () => []
  },
  // 数值字段名
  angleField: {
    type: String,
    required: true,
    default: 'value'
  },
  // 分类字段名
  colorField: {
    type: String,
    required: true,
    default: 'type'
  },
  // 是否为圆环模式（true=圆环，false=饼图）
  isRing: {
    type: Boolean,
    default: true
  },
  // 圆环内径占比（0-1），仅 isRing=true 时生效
  innerRadius: {
    type: Number,
    default: 0.6
  },
  // 饼图外径（isRing=false 时使用）
  radius: {
    type: Number,
    default: 0.8
  },
  // 各分类的颜色（按顺序）
  colors: {
    type: Array,
    default: () => []
  },
  // 是否显示数据标签
  label: {
    type: [Boolean, Object],
    default: false
  },
  // 是否显示图例
  legend: {
    type: [Boolean, Object],
    default: true
  },
  // 图表高度
  height: {
    type: [Number, String],
    default: 280
  },
  // 图表标题（可选）
  title: {
    type: String,
    default: ''
  },
  // 中心统计文字配置
  statistic: {
    type: Object,
    default: null
    // 示例: { title: '总计', value: '1,234', formatter: (val) => val }
  },
  // 饼图/圆环图的起始角度（度数）
  startAngle: {
    type: Number,
    default: -90
  },
  // 是否显示引导线
  sectorStyle: {
    type: Object,
    default: null
  }
})

const chartRef = ref(null)
let chartInstance = null
let themeObserver = null

// 获取当前主题状态
const getCurrentTheme = () => {
  return document.documentElement.classList.contains('dark')
}

// 获取主题颜色配置
const getThemeConfig = (isDark) => {
  const colors = {
    light: {
      primary: '#3678E3',
      success: '#059669',
      warning: '#D97706',
      danger: '#DC2626',
      info: '#3678E3',
      bg: '#FFFFFF',
      axisLine: '#E9E9E9',
      axisLabel: '#5E5E5E',
      tooltipBg: 'rgba(0, 0, 0, 0.45)',
      tooltipBorder: '#E9E9E9',
      legendText: '#5E5E5E',
      statisticTitle: '#5E5E5E',
      statisticValue: '#101010'
    },
    dark: {
      primary: '#00E5FF',
      success: '#4CAF50',
      warning: '#FF9800',
      danger: '#F44336',
      info: '#00E5FF',
      bg: '#003670',
      axisLine: '#004774',
      axisLabel: '#8892B0',
      tooltipBg: 'rgba(0, 0, 0, 0.6)',
      tooltipBorder: '#004774',
      legendText: '#8892B0',
      statisticTitle: '#8892B0',
      statisticValue: '#FFFFFF'
    }
  }
  return isDark ? colors.dark : colors.light
}

// 获取系列颜色
const getSeriesColors = (theme) => {
  if (props.colors && props.colors.length > 0) {
    return props.colors
  }
  return [theme.primary, theme.success, theme.warning, theme.danger, theme.info, '#888888']
}

// 创建图表
const createChart = () => {
  if (!chartRef.value || !props.data || props.data.length === 0) return

  const isDark = getCurrentTheme()
  const theme = getThemeConfig(isDark)
  const seriesColors = getSeriesColors(theme)

  // 根据模式计算半径
  const radiusConfig = props.isRing 
    ? { innerRadius: props.innerRadius } 
    : { radius: props.radius }

  const config = {
    data: props.data,
    angleField: props.angleField,
    colorField: props.colorField,
    color: seriesColors,
    label: props.label ? {
      type: 'spider',
      content: '{name}\n{percentage}',
      style: {
        fill: theme.axisLabel,
        fontSize: 12
      }
    } : false,
    legend: typeof props.legend === 'boolean' 
      ? (props.legend ? { position: 'right' } : false) 
      : props.legend,
    sectorStyle: {
      stroke: theme.bg,
      lineWidth: 2
    },
    animation: {
      appear: {
        animation: 'fade-in',
        duration: 800
      }
    }
  }

  // 合并半径配置
  Object.assign(config, radiusConfig)

  // 起始角度
  config.startAngle = (props.startAngle * Math.PI) / 180

  // 中心统计文字
  if (props.statistic) {
    config.statistic = {
      title: {
        style: {
          color: theme.statisticTitle,
          fontSize: 14,
          fontWeight: 400
        },
        content: props.statistic.title || '总计'
      },
      content: {
        style: {
          color: theme.statisticValue,
          fontSize: 24,
          fontWeight: 600
        },
        content: props.statistic.value || ''
      }
    }
  }

  config.tooltip = {
    domStyles: {
      'g2-tooltip': {
        background: theme.tooltipBg,
        border: `1px solid ${theme.tooltipBorder}`,
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
      },
      'g2-tooltip-title': {
        color: '#FFFFFF',
        fontSize: '14px',
        fontWeight: '500'
      },
      'g2-tooltip-list-item': {
        color: '#FFFFFF',
        fontSize: '12px'
      },
      'g2-tooltip-value': {
        color: '#FFFFFF',
        fontWeight: '600'
      }
    }
  }

  // 主题背景色
  config.theme = {
    styleSheet: {
      background: 'transparent'
    }
  }

  if (props.title) {
    config.title = {
      text: props.title,
      style: {
        fontSize: 16,
        fill: theme.axisLabel,
        fontWeight: 500
      }
    }
  }

  chartInstance = new Pie(chartRef.value, config)
  chartInstance.render()
}

// 更新主题
const updateTheme = () => {
  if (!chartInstance) return

  const isDark = getCurrentTheme()
  const theme = getThemeConfig(isDark)
  const seriesColors = getSeriesColors(theme)

  chartInstance.update({
    color: seriesColors,
    sectorStyle: {
      stroke: theme.bg,
      lineWidth: 2
    },
    tooltip: {
      domStyles: {
        'g2-tooltip': {
          background: theme.tooltipBg,
          border: `1px solid ${theme.tooltipBorder}`,
          borderRadius: '8px'
        }
      }
    }
  })

  // 如果有中心统计文字，也更新
  if (props.statistic && chartInstance.chart) {
    const { statistic: statConfig } = chartInstance.options
    if (statConfig && statConfig.title) {
      statConfig.title.style.color = theme.statisticTitle
      statConfig.content.style.color = theme.statisticValue
    }
  }
}

// 初始化主题监听
const initThemeObserver = () => {
  themeObserver = new MutationObserver((mutations) => {
    const hasClassChange = mutations.some(m => m.attributeName === 'class')
    if (hasClassChange) {
      updateTheme()
    }
  })
  themeObserver.observe(document.documentElement, { attributes: true })
}

onMounted(() => {
  createChart()
  initThemeObserver()
})

onBeforeUnmount(() => {
  if (chartInstance) {
    chartInstance.destroy()
    chartInstance = null
  }
  if (themeObserver) {
    themeObserver.disconnect()
    themeObserver = null
  }
})

// 监听数据变化
watch(() => props.data, () => {
  if (chartInstance) {
    chartInstance.changeData(props.data)
  }
}, { deep: true })

// 监听配置变化
watch(() => [props.colors, props.height, props.isRing], () => {
  if (chartInstance) {
    // 如果模式变化需要重新创建
    if (props.isRing !== chartInstance.options.innerRadius) {
      chartInstance.destroy()
      createChart()
    } else {
      updateTheme()
    }
  }
})
</script>

<template>
  <div class="sys-ring-chart" :style="{ height: typeof height === 'number' ? height + 'px' : height }">
    <div ref="chartRef" class="chart-container"></div>
  </div>
</template>

<style scoped>
.sys-ring-chart {
  width: 100%;
  position: relative;
}

.chart-container {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
