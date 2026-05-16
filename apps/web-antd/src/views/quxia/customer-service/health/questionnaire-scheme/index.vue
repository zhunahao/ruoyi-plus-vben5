<script setup lang="ts">
import { onUnmounted } from 'vue';
import { Page } from '@vben/common-ui';
import { emitter } from './mitt';
// import SchemePanel from './scheme/index.vue';
import QuestionPanel from './question/index.vue';
onUnmounted(() => emitter.off('rowClick'));
</script>

<template>
  <Page :auto-content-height="true" content-class="flex flex-col lg:flex-row gap-4">
    <!-- <SchemePanel class="flex-1 overflow-hidden" /> -->
    <QuestionPanel class="flex-1 overflow-hidden" />
  </Page>
</template>
