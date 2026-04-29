<template>
  <div class="gsmdata-package-tab-page">
    <!-- expire info -->
    <ExpireInfoCell
      v-if="gsmPackageStatusInfo?.expireTime"
      :expire-time="dayjs(gsmPackageStatusInfo.expireTime).format('YYYY-MM-DD')"
    />
    <!-- rights -->
    <GsmDataServiceRightsCell />
    <!-- package list -->
    <LoadingBox :loading="gsmDataPkgLoading">
      <div class="packages-section">
        <PackageCellCard
          v-for="pkg of gsmdataPackageList"
          :key="pkg.packageId"
          :info="pkg"
          :is-active="selectPackage?.packageId === pkg.packageId"
          @click="selectPackage = pkg"
        />
      </div>
    </LoadingBox>

    <ServiceIntroduction />
  </div>
</template>

<script setup lang="ts">
  import ServiceIntroduction from '../components/ServiceIntroduction.vue';
  import ExpireInfoCell from '../components/ExpireInfoCell.vue';
  import PackageCellCard from '../components/PackageCellCard.vue';
  import GsmDataServiceRightsCell from '../components/rights/GsmDataServiceRightsCell.vue';
  import LoadingBox from '../components/LoadingBox.vue';
  import { usePurchaseStore } from '@/stores';
  import { storeToRefs } from 'pinia';
  import { watch } from 'vue';
  import dayjs from 'dayjs';

  const purchaseStore = usePurchaseStore();
  const { gsmDataPkgLoading, gsmdataPackageList, selectPackage, gsmPackageStatusInfo } =
    storeToRefs(purchaseStore);

  watch(
    () => gsmDataPkgLoading.value,
    () => {
      if (!gsmDataPkgLoading.value && gsmdataPackageList.value.length) {
        selectPackage.value = gsmdataPackageList.value[0];
      }
    },
    {
      immediate: true,
    },
  );
</script>

<style scoped lang="less">
  @import '../common.less';
  .gsmdata-package-tab-page {
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
    overflow-x: hidden;
    overflow-y: auto;
    padding: 19px;

    & > div,
    .packages-section > div:not(div:last-child) {
      width: 100%;
      margin-bottom: 10px;
    }
  }
</style>
