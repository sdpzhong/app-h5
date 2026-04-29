<template>
  <div class="cs-package-tab-page">
    <!-- expire info cell -->
    <ExpireInfoCell
      v-if="csPackageStatusInfo?.expireTime"
      :expire-time="dayjs(csPackageStatusInfo.expireTime).format('YYYY-MM-DD')"
    />
    <!-- service rights -->
    <CsServiceRightsCell />
    <!-- package list -->
    <LoadingBox :loading="csPkgLoading">
      <div class="packages-section">
        <PackageCellCard
          v-for="pkg of cloudStoragePackageList"
          :key="pkg.packageId"
          :info="pkg"
          :is-active="selectPackage?.packageId === pkg.packageId"
          @click="selectPackage = pkg"
        />
      </div>
    </LoadingBox>
    <!-- service introduction -->
    <ServiceIntroduction />
  </div>
</template>

<script setup lang="ts">
  import PackageCellCard from '../components/PackageCellCard.vue';
  import ServiceIntroduction from '../components/ServiceIntroduction.vue';
  import ExpireInfoCell from '../components/ExpireInfoCell.vue';
  import CsServiceRightsCell from '../components/rights/CsServiceRightsCell.vue';
  import LoadingBox from '../components/LoadingBox.vue';
  import { usePurchaseStore } from '@/stores';
  import { storeToRefs } from 'pinia';
  import { watch } from 'vue';
  import dayjs from 'dayjs';

  const purchaseStore = usePurchaseStore();
  const { selectPackage, csPkgLoading, cloudStoragePackageList, csPackageStatusInfo } =
    storeToRefs(purchaseStore);

  watch(
    () => csPkgLoading.value,
    () => {
      if (!csPkgLoading.value && cloudStoragePackageList.value.length) {
        selectPackage.value = cloudStoragePackageList.value[0];
      }
    },
    {
      immediate: true,
    },
  );
</script>

<style scoped lang="less">
  @import '../common.less';
  .cs-package-tab-page {
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
    overflow-x: hidden;
    overflow-y: auto;
    padding: 19px;

    & > div:not(div:last-child),
    .packages-section > div:not(div:last-child) {
      width: 100%;
      margin-bottom: 10px;
    }
  }
</style>
