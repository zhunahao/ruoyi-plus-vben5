<script lang="ts" setup>
import type { MonthAnalysisScheme } from './api/model';
import type { EchartsUIType } from '@vben/plugins/echarts';

import { EchartsUI, useEcharts } from '@vben/plugins/echarts';
import { onMounted, ref } from 'vue';

import { analysisSchemeApi } from './api';

const chartRef = ref<EchartsUIType>();
const { renderEcharts } = useEcharts(chartRef);

function renderChart(data: MonthAnalysisScheme[]) {
  // 提取唯一的月份作为 x 轴
  const months = [...new Set(data.map((item) => item.month))];
  // 提取唯一的系列名称
  const seriesNames = [...new Set(data.map((item) => item.name))];

  const colors = ['#5ab1ef', '#019680', '#ff7f50', '#9b59b6', '#f1c40f'];
  const series = seriesNames.map((name, index) => ({
    areaStyle: {},
    data: months.map((month) => {
      const item = data.find((d) => d.month === month && d.name === name);
      return item ? item.value : 0;
    }),
    itemStyle: {
      color: colors[index % colors.length] || '#5ab1ef',
    },
    name,
    smooth: true,
    type: 'line',
  }));

  renderEcharts({
    grid: {
      bottom: 0,
      containLabel: true,
      left: '1%',
      right: '1%',
      top: '2%',
    },
    legend: {
      data: seriesNames,
    },
    series: series as any,
    tooltip: {
      axisPointer: {
        lineStyle: {
          color: '#019680',
          width: 1,
        },
      },
      trigger: 'axis',
    },
    xAxis: {
      axisTick: {
        show: false,
      },
      boundaryGap: false,
      data: months,
      splitLine: {
        lineStyle: {
          type: 'solid',
          width: 1,
        },
        show: true,
      },
      type: 'category',
    },
    yAxis: [
      {
        axisTick: {
          show: false,
        },
        splitArea: {
          show: true,
        },
        splitNumber: 4,
        type: 'value',
      },
    ],
  });
}

onMounted(async () => {
  try {
    const res = await analysisSchemeApi.levelUserMonthAnalysis();
    renderChart((res as any) || []);
  } catch {
    // 请求失败时使用空数据
    renderChart([]);
  }
});
</script>

<template>
  <EchartsUI ref="chartRef" />
</template>
