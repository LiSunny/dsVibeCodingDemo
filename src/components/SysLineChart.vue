<!--
  组件名称: SysLineChart
  用途: 通用折线图组件，基于 AntV G2Plot
  特性:
    - 支持多数据系列（多条折线）
    - 支持平滑曲线
    - 支持数据点标签
    - 自动适配浅色/深色主题（CSS 变量动态读取）
    - 主题切换时自动更新颜色
-->
<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import { Line } from '@antv/g2plot'

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
  // Y轴字段名（或多系列配置）
  yField: {
    type: [String, Array],
    default: 'y'
  },
  // 系列配置（用于多折线场景）
  seriesField: {
    type: String,
    default: null
  },
  // 各系列的颜色（按顺序）
  colors: {
    type: Array,
    default: () => []
  },
  // 是否平滑曲线
  smooth: {
    type: Boolean,
    default: false
  },
  // 是否显示数据点
  point: {
    type: Boolean,
    default: true
  },
  // 是否显示数据点标签
  label: {
    type: [Boolean, Object],
    default: false
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
  // 是否有 Y 轴网格线
  yAxisGrid: {
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

// 创建图表
const createChart = () => {
  if (!chartRef.value || !props.data || props.data.length === 0) return

  const isDark = getCurrentTheme()
  const theme = getThemeConfig(isDark)
  const seriesColors = getSeriesColors(theme)

  const config = {
    data: props.data,
    xField: props.xField,
    yField: props.yField,
    smooth: props.smooth,
    color: seriesColors,
    point: props.point ? {
      size: 4,
      shape: 'circle',
      style: {
        fill: theme.bg,
        stroke: seriesColors[0],
        lineWidth: 2
      }
    } : false,
    label: props.label ? {
      position: 'top',
      style: {
        fill: theme.axisLabel,
        fontSize: 12
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
      },
      tickLine: {
        style: {
          stroke: theme.tickLine
        }
      }
    },
    yAxis: {
      grid: props.yAxisGrid ? {
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
    },
    tooltip: {
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
    },
    animation: {
      appear: {
        animation: 'wave-in',
        duration: 800
      }
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

  if (props.seriesField) {
    config.seriesField = props.seriesField
    config.legend = props.legend ? {
      position: 'top-right'
    } : false
  }

  if (!config.yAxis.grid) {
    config.yAxis.grid = undefined
  }

  chartInstance = new Line(chartRef.value, config)
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
      grid: props.yAxisGrid ? {
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
watch(() => [props.colors, props.smooth, props.height], () => {
  if (chartInstance) {
    updateTheme()
  }
})
</script>

<template>
  <div class="sys-line-chart" :style="{ height: typeof height === 'number' ? height + 'px' : height }">
    <div ref="chartRef" class="chart-container"></div>
  </div>
</template>

<style scoped>
.sys-line-chart {
  width: 100%;
  position: relative;
}

.chart-container {
  width: 100%;
  height: 100%;
}
</style>
