<template>
  <van-config-provider :theme="'light'" :theme-vars="VANT_THEME_VARS" class="config-provider">
    <template v-if="loading">
      <div class="loading-box"><van-loading type="spinner" size="0.64rem" /></div>
    </template>
    <router-view v-else />
    <van-floating-bubble
      v-model:offset="offset"
      axis="xy"
      magnetic="x"
      v-if="$route.path != '/system/env' && appEnvStore.isShowEnvButton"
      @click="$router.push('/system/env')"
    >
      <span style="font-size: 0.3733rem">ENV</span></van-floating-bubble
    >
  </van-config-provider>
</template>

<script setup lang="ts">
  import { VANT_THEME_VARS } from '@/theme/vant-theme';
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  import useLocalStorage from './hooks/component/useLocalStorage';
  import useLocale from './hooks/useLocale';
  import { useTitle } from './hooks/useTitle';
  import { useAppEnvStore, useMethodChannelStore, useUserStore } from './stores';
  import { delayFunction } from './utils/delay';
  import { isProdMode } from './utils/env';

  useTitle();

  const { changeLocale } = useLocale();

  const loading = ref<boolean>(false);

  // 初始获取token
  const { postMessage, acceptMessage } = useMethodChannelStore();
  const userStore = useUserStore();
  const appEnvStore = useAppEnvStore();
  const offset = useLocalStorage('ENV_BTN_OFFSET', { x: 24, y: 24 });

  appEnvStore.initEnvCacheInfo();

  function initAppBaseInfo() {
    const routeList = useRouter().getRoutes();
    const publicRoutes = routeList.filter((e) => !!e.meta.public);

    console.log('routeList: ', routeList, ' publicRoutes: ', publicRoutes);

    // 开放路由无需等待
    if (isProdMode() && !publicRoutes.some((e) => location.hash.includes(e.path))) {
      loading.value = true;
    }

    postMessage({
      method: 'getToken',
      data: null,
    });

    postMessage({
      method: 'getAPPInfo',
      data: null,
    });
  }

  initAppBaseInfo();

  acceptMessage<object>(async (params) => {
    if (params.method === 'getToken') {
      const token = params.data['token'] ?? '';
      if (token) {
        userStore.setToken(token);
      } else {
        console.warn('未获取到登录凭证');
      }
    } else if (params.method === 'getAPPInfo') {
      appEnvStore.setAppBaseInfo(params.data, () => {
        if (appEnvStore.baseInfo?.language) {
          changeLocale(appEnvStore.baseInfo?.language as any);
        }
      });
      await delayFunction(0);
      loading.value = false;
    }
  });

  // 初始校准浮动按钮的位置（溢出位置重置）
  function calibratEnvBtnPosition() {
    // 获取当前窗口宽高
    const windowHeight = window.innerHeight;
    const windowWidth = window.innerWidth;

    if (offset.value!.x >= windowWidth && offset.value!.y < windowHeight) {
      offset.value!.x = 24;
      return;
    }

    if (offset.value!.y >= windowHeight && offset.value!.x < windowWidth) {
      offset.value!.y = 24;
      return;
    }

    if (offset.value!.x >= windowWidth || offset.value!.y >= windowHeight) {
      offset.value = { x: 24, y: 24 };
    }
  }

  calibratEnvBtnPosition();
</script>

<style lang="less" scoped>
  .config-provider {
    height: 100%;
    width: 100%;

    .loading-box {
      height: 100%;
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
</style>
