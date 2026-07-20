<script lang="ts" setup>
import type { AnalysisOverviewItem } from '@vben/common-ui';
import type { TabOption } from '@vben/types';

import {
  AnalysisChartCard,
  AnalysisChartsTabs,
  AnalysisOverview,
} from '@vben/common-ui';
import {
  SvgBellIcon,
  SvgCakeIcon,
  SvgCardIcon,
  SvgDownloadIcon,
} from '@vben/icons';

import { markRaw, onMounted, ref } from 'vue';

import AnalyticsTrends from './analytics-trends.vue';
import AnalyticsVisits from './analytics-visits.vue';
import AnalyticsVisitsData from './analytics-visits-data.vue';
import AnalyticsVisitsSales from './analytics-visits-sales.vue';
import AnalyticsVisitsSource from './analytics-visits-source.vue';

import { analysisSchemeApi } from './api';

const overviewItems = ref<AnalysisOverviewItem[]>([]);

onMounted(async () => {
  try {
    const data = await analysisSchemeApi.itemAnalysis();
    overviewItems.value = [
      markRaw({
        icon: markRaw(SvgCardIcon),
        title: '会员数量',
        value: Number(data.memberCount || 0),
        totalTitle: '会员数量',
        totalValue: Number(data.memberCount || 0),
      }) as unknown as AnalysisOverviewItem,
      markRaw({
        icon: markRaw(SvgCakeIcon),
        title: '商品数量',
        value: Number(data.productCount || 0),
        totalTitle: '商品数量',
        totalValue: Number(data.productCount || 0),
      }) as unknown as AnalysisOverviewItem,
      markRaw({
        icon: markRaw(SvgDownloadIcon),
        title: '总余额',
        value: Number(data.totalBalance || 0),
        totalTitle: '总余额',
        totalValue: Number(data.totalBalance || 0),
      }) as unknown as AnalysisOverviewItem,
      markRaw({
        icon: markRaw(SvgBellIcon),
        title: '总收益',
        value: Number(data.totalEarnings || 0),
        totalTitle: '总收益',
        totalValue: Number(data.totalEarnings || 0),
      }) as unknown as AnalysisOverviewItem,
    ];
  } catch {
    // ignore
  }
});

const chartTabs: TabOption[] = [
  {
    label: '代理趋势',
    value: 'agent',
  },
  {
    label: '提货趋势',
    value: 'pick',
  },
];
</script>

<template>
  <div class="p-5">
    <AnalysisOverview :items="overviewItems" />
    <AnalysisChartsTabs :tabs="chartTabs" class="mt-5">
      <template #agent>
        <AnalyticsTrends />
      </template>
      <template #pick>
        <AnalyticsVisits />
      </template>
    </AnalysisChartsTabs>

    <div class="mt-5 w-full md:flex">
      <!-- <AnalysisChartCard class="mt-5 md:mt-0 md:mr-4 md:w-1/3" title="访问数量">
        <AnalyticsVisitsData />
      </AnalysisChartCard> -->
      <AnalysisChartCard class="mt-5 md:mt-0 md:mr-4 md:w-1/2" title="代理人数">
        <AnalyticsVisitsSource />
      </AnalysisChartCard>
      <AnalysisChartCard class="mt-5 md:mt-0 md:w-1/2" title="商品库存">
        <AnalyticsVisitsSales />
      </AnalysisChartCard>
    </div>
  </div>
</template>
