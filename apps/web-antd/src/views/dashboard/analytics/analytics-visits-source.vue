<script lang="ts" setup>
import type { AnalysisScheme } from './api/model';
import type { EchartsUIType } from '@vben/plugins/echarts';

import { EchartsUI, useEcharts } from '@vben/plugins/echarts';
import { onMounted, ref } from 'vue';

import { analysisSchemeApi } from './api';

const chartRef = ref<EchartsUIType>();
const { renderEcharts } = useEcharts(chartRef);

function renderChart(data: AnalysisScheme[]) {
  renderEcharts({
    legend: {
      bottom: '2%',
      left: 'center',
    },
    series: [
      {
        animationDelay() {
          return Math.random() * 100;
        },
        animationEasing: 'exponentialInOut',
        animationType: 'scale',
        avoidLabelOverlap: false,
        color: ['#5ab1ef', '#b6a2de', '#67e0e3', '#2ec7c9'],
        data,
        emphasis: {
          label: {
            fontSize: '12',
            fontWeight: 'bold',
            show: true,
          },
        },
        itemStyle: {
          borderRadius: 10,
          borderWidth: 2,
        },
        label: {
          formatter: '{b}: {c}',
          show: true,
        },
        name: '访问来源',
        radius: ['40%', '65%'],
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
    const res = await analysisSchemeApi.levelUserAnalysis();
    renderChart((res as any) || []);
  } catch {
    renderChart([]);
  }
});
</script>

<template>
  <EchartsUI ref="chartRef" />
</template>
