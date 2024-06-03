'use client'

import { formatBalance } from '@/utils'
import { BarElement, CategoryScale, ChartData, Chart as ChartJS, ChartOptions, Legend, LinearScale, Title, Tooltip } from 'chart.js'
import merge from 'lodash/merge'
import { Bar } from 'react-chartjs-2'

ChartJS.defaults.font.weight = 500

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const cssVar = (name: string) => {
  if (typeof document === 'undefined') return
  return getComputedStyle(document.documentElement).getPropertyValue(name)
}

type DataPoint = { x: string; y: number }
type BarChartData = ChartData<'bar', Array<DataPoint>, string>
type BarChartOptions = ChartOptions<'bar'>

const gridColor = () => `rgb(${cssVar('--color-accent-100')})`
const positivePrimaryColor = () => `rgb(${cssVar('--color-accent-500')})`
const positiveSecondaryColor = () => `rgb(${cssVar('--color-accent-300')})`
const negativeBarColor = `rgb(${cssVar('--color-error-500')})`

const isDataPoint = (data: any): data is DataPoint => data.x && data.y

const BASE_OPTIONS: BarChartOptions = {
  responsive: true,
  elements: {
    bar: {
      backgroundColor: (context) => {
        if (context?.parsed?.y < 0) return negativeBarColor
        return context?.datasetIndex % 2 === 0 ? positivePrimaryColor() : positiveSecondaryColor()
      },
    },
  },
  datasets: {
    bar: { maxBarThickness: 25 },
  },
  plugins: {
    title: {
      display: false,
      font: { family: 'inherit' },
    },
    legend: { display: false },
    tooltip: {
      callbacks: {
        footer: (contexts) => {
          const context = contexts[0]

          if (context?.chart?.data?.datasets?.length <= 1) return

          const datasets = context.chart.data.datasets
          const dataIndex = context.dataIndex

          const value = datasets.reduce((acc, dataset) => {
            const data = dataset.data[dataIndex]
            if (!isDataPoint(data)) return acc
            return acc + data.y
          }, 0)

          const formattedTotal = formatBalance({ value })

          return `Total: ${formattedTotal}`
        },
      },
    },
  },
  scales: {
    x: {
      grid: { color: gridColor },
      stacked: true,
    },
    y: {
      stacked: true,
      ticks: {
        callback: (rawValue) => {
          const value = parseFloat(rawValue.toString())
          if (isNaN(value)) return rawValue
          return formatBalance({ value, precision: 1, scale: 'k' })
        },
      },
      grid: { color: gridColor },
    },
  },
}

const createOptions = (override?: Partial<BarChartOptions>): BarChartOptions => {
  return merge({}, BASE_OPTIONS, override)
}

type BarChartProps = { datasets: BarChartData['datasets']; title?: string; className?: string }

export const BarChart = ({ datasets, title, className }: BarChartProps) => {
  const options = createOptions({
    plugins: {
      title: {
        display: true,
        text: title,
      },
    },
  })

  return <Bar className={className} options={options} data={{ datasets }} />
}
