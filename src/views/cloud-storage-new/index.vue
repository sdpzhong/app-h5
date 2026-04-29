<template>
  <div
    class="cloud-storage van-safe-area-bottom"
    :class="{
      'show-bg': isShowBg,
    }"
  >
    <div class="cloud-storage__header">
      <!-- 过期提醒 -->
      <PackageNoticeBar />
      <!-- 设备服务简略信息 -->
      <DeviceServiceInfo />
    </div>
    <!-- 套餐选择区域 -->
    <PackageSelectComponent />
  </div>
</template>

<script setup lang="ts" name="CloudStorageNewPage">
  import PackageNoticeBar from './components/PackageNoticeBar.vue';
  import DeviceServiceInfo from './components/DeviceServiceInfo.vue';
  import PackageSelectComponent from './components/PackageSelectComponent.vue';
  import { useRoute } from 'vue-router';
  import { onMounted, ref } from 'vue';
  const route = useRoute();
  const isShowBg = ref(false);

  onMounted(() => {
    const compatible = route.query['compatible'];

    if (compatible === 'true') {
      isShowBg.value = true;
    }
  });
</script>

<style scoped lang="less">
  .show-bg {
    background-image: url('/src/assets/images/cloud-storage/cloud-storage-bg.jpg');
    background-repeat: no-repeat;
    background-size: contain;
    background-position: top;
  }

  .cloud-storage {
    display: flex;
    flex-direction: column;

    .cloud-storage__header {
      height: 180px;
      overflow: hidden;
    }
  }
</style>
