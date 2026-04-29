<template>
  <div class="home-page">
    <layout-header :title="$t('home.header.title')" />
    <div class="main-content">
      <van-cell-group inset v-if="isDevMode()">
        <van-cell :title="$t('route.env-setting')" is-link @click="$router.push('/system/env')" />
      </van-cell-group>
      <van-empty v-else />
    </div>
  </div>
</template>

<script setup lang="ts">
  import LayoutHeader from '@/layout/components/header/index.vue';

  import { useUserStore } from '@/stores/modules/user';
  import { isDevMode } from '@/utils/env';
  import { useRoute } from 'vue-router';

  function getTokenFromUrl() {
    const userStore = useUserStore();
    const route = useRoute();

    const token = route.query['token'];
    // token
    if (token) {
      userStore.setToken(token as string);
    }
  }

  getTokenFromUrl();
</script>

<style scoped lang="less">
  .home-page {
    background-color: #f7f8fa;

    .main-content {
      padding: 20px 0;
    }
  }
</style>
