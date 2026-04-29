<template>
  <div class="van-safe-area-bottom">
    <div class="cloud-storage-page">
      <!-- <LayoutNavBar /> -->
      <div class="layout-content">
        <DeviceSelectComponent />
        <PackageSelectComponent />
        <CloudStorageIntroduce />
      </div>
      <PayActionComponent :package-info="selectPackage" />
    </div>
    <!-- <PayActionComponent :package-info="selectPackage" /> -->
  </div>
</template>

<script setup lang="ts" name="CloudStoragePage">
  // import LayoutNavBar from './components/LayoutNavBar.vue';
  import DeviceSelectComponent from './components/DeviceSelectComponent.vue';
  import PackageSelectComponent from './components/PackageSelectComponent.vue';
  import CloudStorageIntroduce from './components/CloudStorageIntroduce.vue';
  import PayActionComponent from './components/PayActionComponent.vue';
  import { storeToRefs } from 'pinia';
  import { useCloudStorageStore } from '@/stores';
  import { computed } from 'vue';

  const { selectPackageId, recommendList } = storeToRefs(useCloudStorageStore());
  const selectPackage = computed(() =>
    recommendList.value.find((e) => e.id === selectPackageId.value),
  );
</script>

<style scoped lang="less">
  .cloud-storage-page {
    width: 100vw;
    height: 100vh;
    background: black linear-gradient(to bottom, #000000 78px, #eeeeee 228px, #e9e9e9);
    display: flex;
    flex-direction: column;

    .layout-content {
      padding: 0 13px;
      flex: auto;
      overflow-y: auto;
      overflow-x: hidden;
    }
  }
</style>
