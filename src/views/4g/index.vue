<template>
  <div class="cloud-storage-4g van-safe-area-bottom">
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

<script setup lang="ts" name="CloudStorageFourGPage">
  import PackageNoticeBar from './components/PackageNoticeBar.vue';
  import DeviceServiceInfo from './components/DeviceServiceInfo.vue';
  import PackageSelectComponent from './components/PackageSelectComponent.vue';
</script>

<style scoped lang="less">
  .cloud-storage-4g {
    display: flex;
    flex-direction: column;
    // background-image: url('/src/assets/images/cloud-storage/4g-bg.png');
    // background-repeat: no-repeat;
    // background-size: contain;
    // background-position: center top;

    .cloud-storage__header {
      height: 180px;
      overflow: hidden;
    }
  }
</style>
