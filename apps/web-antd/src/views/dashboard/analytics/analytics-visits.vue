<script lang="ts" setup>
import type { MonthAnalysisScheme } from './api/model';
import type { EchartsUIType } from '@vben/plugins/echarts';

import { EchartsUI, useEcharts } from '@vben/plugins/echarts';
import { onMounted, ref } from 'vue';

import { analysisSchemeApi } from './api';

const chartRef = ref<EchartsUIType>();
const { renderEcharts } = useEcharts(chartRef);

function renderChart(data: MonthAnalysisScheme[]) {
  const months = [...new Set(data.map((item) => item.month))];
  const seriesNames = [...new Set(data.map((item) => item.name))];

  const series = seriesNames.map((name) => ({
    barMaxWidth: 80,
    data: months.map((month) => {
      const item = data.find((d) => d.month === month && d.name === name);
      return item ? item.value : 0;
    }),
    name,
    type: 'bar',
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
          width: 1,
        },
      },
      trigger: 'axis',
    },
    xAxis: {
      data: months,
      type: 'category',
    },
    yAxis: {
      splitNumber: 4,
      type: 'value',
    },
  });
}

onMounted(async () => {
  try {
    const res = await analysisSchemeApi.inventoryProductMonthAnalysis();
    renderChart((res as any) || []);
  } catch {
    renderChart([]);
  }
});
</script>

<template>
  <EchartsUI ref="chartRef" />
</template>
