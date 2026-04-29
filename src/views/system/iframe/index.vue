<template>
  <div class="app-iframe">
    <van-nav-bar
      v-if="$route.meta['showNavBar']"
      class="app-iframe-nav-bar"
      :title="$t($route.meta.title ?? '') ?? ''"
      left-text="返回"
      left-arrow
      safe-area-inset-top
      @click-left="onClickLeft"
    />
    <iframe class="app-iframe-main" :src="url"></iframe>
  </div>
</template>

<script setup lang="ts" name="IframePage">
  import { ref } from 'vue';
  import { useRouter, useRoute } from 'vue-router';

  const router = useRouter();
  const route = useRoute();
  const url = ref<string>('');

  function getIframeUrl() {
    const mate = route.meta as object;
    console.log(mate);
    if (mate['iframeUrl']) {
      url.value = mate['iframeUrl'] as string;
    }
  }

  getIframeUrl();

  function onClickLeft() {
    router.back();
  }
</script>

<style scoped lang="less">
  .app-iframe {
    width: 100vw;
    height: 100vh;
    display: flex;
    flex-direction: column;
    .app-iframe-main {
      flex: auto;
      width: 100%;
      border: none;

      ::-webkit-scrollbar {
        display: none;
      }
      body {
        overflow-x: hidden !important;
        overflow-y: auto;
      }
    }
  }
</style>
