<script lang="ts" setup>
import type { TodoAnalysisScheme } from './api/model';

import { onMounted, shallowRef } from 'vue';

import { WorkbenchHeader } from '@vben/common-ui';
import { VbenIcon } from '@vben/icons';
import { preferences } from '@vben/preferences';
import { useUserStore } from '@vben/stores';

import CarouselManage from './components/carousel-manage.vue';

import { workspaceSchemeApi } from './api';

const userStore = useUserStore();

interface StatCard {
  key: string;
  label: string;
  value: number;
  icon: string;
  color: string;
  bgColor: string;
}

const statCards = shallowRef<StatCard[]>([]);
const weatherDesc = shallowRef('20℃ - 32℃');

// WMO weather codes -> 中文天气描述
const weatherCodeMap: Record<number, string> = {
  0: '晴', 1: '大部晴朗', 2: '多云', 3: '阴',
  45: '雾', 48: '冻雾',
  51: '小毛毛雨', 53: '毛毛雨', 55: '大毛毛雨',
  61: '小雨', 63: '中雨', 65: '大雨',
  71: '小雪', 73: '中雪', 75: '大雪',
  77: '雪粒',
  80: '小阵雨', 81: '阵雨', 82: '大阵雨',
  85: '小阵雪', 86: '大阵雪',
  95: '雷暴', 96: '雷暴伴小冰雹', 99: '雷暴伴大冰雹',
};

async function fetchWeather() {
  try {
    const position = await new Promise<GeolocationPosition>((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: false,
        timeout: 5000,
      });
    });

    const { latitude, longitude } = position.coords;
    const lat = latitude.toFixed(4);
    const lon = longitude.toFixed(4);

    // 并行获取天气和位置
    const [weatherRes, geoRes] = await Promise.allSettled([
      fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&timezone=auto`),
      fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=10&accept-language=zh`),
    ]);

    let city = '';
    if (geoRes.status === 'fulfilled' && geoRes.value.ok) {
      const geo = await geoRes.value.json();
      city = geo.address?.city || geo.address?.town || geo.address?.county || geo.address?.province || '';
    }

    let weather = '';
    if (weatherRes.status === 'fulfilled' && weatherRes.value.ok) {
      const json = await weatherRes.value.json();
      const w = json.current_weather;
      const code = weatherCodeMap[w.weathercode] || '未知';
      weather = `今日${code}，${w.temperature}℃`;
    }

    weatherDesc.value = city ? `${city} · ${weather}` : weather;
  } catch {
    // 定位失败或接口异常时保持默认
  }
}

onMounted(async () => {
  fetchWeather();

  try {
    const res = await workspaceSchemeApi.todoAnalysis();
    const data = (res as any) || ({} as TodoAnalysisScheme);

    statCards.value = [
      {
        key: 'pickPendingNum',
        label: '提货订单',
        value: Number(data.pickPendingNum || 0),
        icon: 'ant-design:shopping-cart-outlined',
        color: '#1890ff',
        bgColor: 'bg-blue-50',
      },
      {
        key: 'shopPendingNum',
        label: '商城订单',
        value: Number(data.shopPendingNum || 0),
        icon: 'ant-design:shop-outlined',
        color: '#52c41a',
        bgColor: 'bg-green-50',
      },
      {
        key: 'withdrawPendingNum',
        label: '提现申请',
        value: Number(data.withdrawPendingNum || 0),
        icon: 'ant-design:dollar-outlined',
        color: '#faad14',
        bgColor: 'bg-yellow-50',
      },
      {
        key: 'momentsImgNum',
        label: '今日朋友圈图片',
        value: Number(data.momentsImgNum || 0),
        icon: 'ant-design:picture-outlined',
        color: '#722ed1',
        bgColor: 'bg-purple-50',
      },
      {
        key: 'momentsVideoNum',
        label: '今日朋友圈视频',
        value: Number(data.momentsVideoNum || 0),
        icon: 'ant-design:video-camera-outlined',
        color: '#eb2f96',
        bgColor: 'bg-pink-50',
      },
    ];
  } catch {
    statCards.value = [];
  }
});
</script>

<template>
  <div class="p-5">
    <WorkbenchHeader
      :avatar="userStore.userInfo?.avatar || preferences.app.defaultAvatar"
    >
      <template #title>
        早安, {{ userStore.userInfo?.realName }}, 开始您一天的工作吧！
      </template>
      <template #description> {{ weatherDesc }} </template>
    </WorkbenchHeader>

    <div class="mt-5">
      <h3 class="mb-4 text-base font-semibold">待办事项概览</h3>
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        <div
          v-for="item in statCards"
          :key="item.key"
          class="rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
        >
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-500">{{ item.label }}</p>
              <p class="mt-1 text-2xl font-semibold" :style="{ color: item.color }">
                {{ item.value }}
              </p>
            </div>
            <div
              class="flex h-10 w-10 items-center justify-center rounded-lg"
              :class="item.bgColor"
            >
              <VbenIcon :icon="item.icon" :style="{ color: item.color }" class="text-xl" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="mt-6">
      <CarouselManage />
    </div>
  </div>
</template>
