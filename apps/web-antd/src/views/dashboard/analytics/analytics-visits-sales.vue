<script lang="ts" setup>
import type { AnalysisScheme } from './api/model';
import type { EchartsUIType } from '@vben/plugins/echarts';

import { EchartsUI, useEcharts } from '@vben/plugins/echarts';
import { onMounted, ref } from 'vue';

import { analysisSchemeApi } from './api';

const chartRef = ref<EchartsUIType>();
const { renderEcharts } = useEcharts(chartRef);

function renderChart(data: AnalysisScheme[]) {
  const sortedData = [...data].sort((a, b) => a.value - b.value);

  renderEcharts({
    series: [
      {
        animationDelay() {
          return Math.random() * 400;
        },
        animationEasing: 'exponentialInOut',
        animationType: 'scale',
        center: ['50%', '50%'],
        color: ['#5ab1ef', '#b6a2de', '#67e0e3', '#2ec7c9'],
        data: sortedData,
        label: {
          formatter: '{b}: {c}',
          show: true,
        },
        name: '商品库存',
        radius: '80%',
        roseType: 'radius',
        type: 'pie',
      },
    ],
    tooltip: {
      trigger: 'item',
    },
  });
}

onMounted(async () => {
  try {
    const res = await analysisSchemeApi.inventoryProductAnalysis();
    renderChart((res as any) || []);
  } catch {
    renderChart([]);
  }
});
</script>

<template>
  <EchartsUI ref="chartRef" />
</template>
