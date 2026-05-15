<!--
  组件名称: SysBarChart
  用途: 通用柱状图/条形图组件，基于 AntV G2Plot
  特性:
    - 支持普通柱状图、分组柱状图、堆叠柱状图
    - 支持水平条形图模式
    - 支持数据标签
    - 自动适配浅色/深色主题（CSS 变量动态读取）
    - 主题切换时自动更新颜色
-->
<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import { Column, Bar } from '@antv/g2plot'

const props = defineProps({
  // 图表数据
  data: {
    type: Array,
    required: true,
    default: () => []
  },
  // X轴字段名
  xField: {
    type: String,
    required: true,
    default: 'x'
  },
  // Y轴字段名
  yField: {
    type: [String, Array],
    required: true,
    default: 'y'
  },
  // 分组字段（用于分组/堆叠柱状图）
  seriesField: {
    type: String,
    default: null
  },
  // 是否为堆叠模式（true=堆叠，false=分组）
  isStack: {
    type: Boolean,
    default: false
  },
  // 是否为水平条形图模式
  isHorizontal: {
    type: Boolean,
    default: false
  },
  // 各系列的颜色（按顺序）
  colors: {
    type: Array,
    default: () => []
  },
  // 是否显示数据标签
  label: {
    type: [Boolean, Object],
    default: false
  },
  // 数据标签位置：top/center/bottom（垂直图）| left/center/right（水平图）
  labelPosition: {
    type: String,
    default: 'top'
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
  // 是否显示图例
  legend: {
    type: [Boolean, Object],
    default: true
  },
  // 是否有 Y 轴网格线（柱状图时）或 X 轴网格线（条形图时）
  gridLine: {
    type: Boolean,
    default: true
  },
  // Y 轴格式化函数
  yFormatter: {
    type: Function,
    default: null
  },
  // X 轴旋转角度
  xAxisLabelRotate: {
    type: Number,
    default: 0
  },
  // 柱状图圆角
  barRadius: {
    type: Number,
    default: 4
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
      gridLine: '#F3F3F3',
      tickLine: '#E9E9E9'
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
      gridLine: 'rgba(255, 255, 255, 0.08)',
      tickLine: '#004774'
    }
  }
  return isDark ? colors.dark : colors.light
}

// 获取系列颜色
const getSeriesColors = (theme) => {
  if (props.colors && props.colors.length > 0) {
    return props.colors
  }
  return [theme.primary, theme.success, theme.warning, theme.danger, theme.info]
}

// 获取标签位置
const getLabelPosition = () => {
  if (props.isHorizontal) {
    // 水平图：left/center/right
    return props.labelPosition || 'right'
  } else {
    // 垂直图：top/center/bottom
    return props.labelPosition || 'top'
  }
}

// 创建图表
const createChart = () => {
  if (!chartRef.value || !props.data || props.data.length === 0) return

  const isDark = getCurrentTheme()
  const theme = getThemeConfig(isDark)
  const seriesColors = getSeriesColors(theme)

  // 根据是否水平选择图表类型
  const ChartClass = props.isHorizontal ? Bar : Column

  const labelPosition = getLabelPosition()

  const config = {
    data: props.data,
    xField: props.xField,
    yField: props.yField,
    color: seriesColors,
    seriesField: props.seriesField,
    isStack: props.isStack,
    label: props.label ? {
      position: labelPosition,
      style: {
        fill: theme.axisLabel,
        fontSize: 12
      },
      formatter: (v) => {
        const val = typeof v === 'object' ? v.value : v
        return typeof val === 'number' ? val + '%' : val
      }
    } : false,
    theme: {
      styleSheet: {
        background: theme.bg,
        brandColor: theme.primary,
        paletteQualitative10: seriesColors,
        axisLineColor: theme.axisLine,
        axisTickLineColor: theme.tickLine,
        axisLabelColor: theme.axisLabel,
        gridLineColor: theme.gridLine
      }
    },
    legend: typeof props.legend === 'boolean' ? props.legend : props.legend,
    // 柱状图特有的圆角配置
    columnStyle: {
      radius: [props.barRadius, props.barRadius, 0, 0]
    },
    barStyle: {
      radius: [0, props.barRadius, props.barRadius, 0]
    }
  }

  // 根据水平/垂直设置坐标轴
  if (props.isHorizontal) {
    config.yAxis = {
      grid: props.gridLine ? {
        line: {
          style: {
            stroke: theme.gridLine,
            lineDash: [4, 4]
          }
        }
      } : null,
      label: props.yFormatter ? {
        formatter: props.yFormatter,
        style: {
          fill: theme.axisLabel,
          fontSize: 12
        }
      } : {
        style: {
          fill: theme.axisLabel,
          fontSize: 12
        }
      },
      line: {
        style: {
          stroke: theme.axisLine
        }
      },
      tickLine: {
        style: {
          stroke: theme.tickLine
        }
      }
    }
    config.xAxis = {
      label: {
        style: {
          fill: theme.axisLabel,
          fontSize: 12
        }
      },
      line: {
        style: {
          stroke: theme.axisLine
        }
      },
      tickLine: {
        style: {
          stroke: theme.tickLine
        }
      }
    }
  } else {
    config.xAxis = {
      label: {
        rotate: props.xAxisLabelRotate,
        style: {
          fill: theme.axisLabel,
          fontSize: 12
        }
      },
      line: {
        style: {
          stroke: theme.axisLine
        }
      },
      tickLine: {
        style: {
          stroke: theme.tickLine
        }
      }
    }
    config.yAxis = {
      grid: props.gridLine ? {
        line: {
          style: {
            stroke: theme.gridLine,
            lineDash: [4, 4]
          }
        }
      } : null,
      label: props.yFormatter ? {
        formatter: props.yFormatter,
        style: {
          fill: theme.axisLabel,
          fontSize: 12
        }
      } : {
        style: {
          fill: theme.axisLabel,
          fontSize: 12
        }
      },
      line: {
        style: {
          stroke: theme.axisLine
        }
      },
      tickLine: {
        style: {
          stroke: theme.tickLine
        }
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

  config.animation = {
    appear: {
      animation: 'fade-in',
      duration: 600
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

  chartInstance = new ChartClass(chartRef.value, config)
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
    theme: {
      styleSheet: {
        background: theme.bg,
        brandColor: theme.primary,
        paletteQualitative10: seriesColors,
        axisLineColor: theme.axisLine,
        axisTickLineColor: theme.tickLine,
        axisLabelColor: theme.axisLabel,
        gridLineColor: theme.gridLine
      }
    },
    xAxis: {
      label: {
        rotate: props.xAxisLabelRotate,
        style: {
          fill: theme.axisLabel,
          fontSize: 12
        }
      },
      line: {
        style: {
          stroke: theme.axisLine
        }
      }
    },
    yAxis: {
      label: props.yFormatter ? {
        formatter: props.yFormatter,
        style: {
          fill: theme.axisLabel,
          fontSize: 12
        }
      } : {
        style: {
          fill: theme.axisLabel,
          fontSize: 12
        }
      },
      grid: props.gridLine ? {
        line: {
          style: {
            stroke: theme.gridLine,
            lineDash: [4, 4]
          }
        }
      } : null
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
watch(() => [props.colors, props.height, props.isStack], () => {
  if (chartInstance) {
    updateTheme()
  }
})
</script>

<template>
  <div class="sys-bar-chart" :style="{ height: typeof height === 'number' ? height + 'px' : height }">
    <div ref="chartRef" class="chart-container"></div>
  </div>
</template>

<style scoped>
.sys-bar-chart {
  width: 100%;
  position: relative;
}

.chart-container {
  width: 100%;
  height: 100%;
}
</style>