<template>
  <div class="group-package-tab-page">
    <LoadingBox :loading="comboPkgLoading">
      <div class="group-package__row-cell">
        <GroupPackageCard
          v-for="pkg of comboPackageList"
          :key="pkg.packageId"
          :info="pkg"
          :is-active="pkg.packageId === selectPackage?.packageId"
          :pkg-count="comboPackageList.length"
          @click="selectPackage = pkg"
        />
      </div>
      <div
        class="group-package-details"
        v-if="comboPackageList.length && selectPackage && selectPackage?.combinedSubList.length"
      >
        <Divider :title="$t('purchase.about-services')" />
        <div class="group-child-package">
          <GroupChildPackageCard
            v-for="subPkg of selectPackage.combinedSubList"
            :key="'sub' + subPkg.packageId"
            :info="subPkg"
          />
        </div>
      </div>
    </LoadingBox>
    <ServiceIntroduction />
  </div>
</template>

<script setup lang="ts">
  import GroupPackageCard from '../components/GroupPackageCard.vue';
  import ServiceIntroduction from '../components/ServiceIntroduction.vue';
  import Divider from '../components/Divider.vue';
  import GroupChildPackageCard from '../components/GroupChildPackageCard.vue';
  import LoadingBox from '../components/LoadingBox.vue';
  import { watch } from 'vue';
  import { usePurchaseStore } from '@/stores';
  import { storeToRefs } from 'pinia';

  const purchaseStore = usePurchaseStore();
  const { selectPackage, comboPkgLoading, comboPackageList } = storeToRefs(purchaseStore);

  watch(
    () => comboPkgLoading.value,
    () => {
      if (!comboPkgLoading.value && comboPackageList.value.length) {
        selectPackage.value = comboPackageList.value[0];
      }
    },
    {
      immediate: true,
    },
  );
</script>

<style scoped lang="less">
  @import '../common.less';
  .group-package-tab-page {
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
    overflow-x: hidden;
    overflow-y: auto;
    padding: 19px;

    & > div:not(div:last-child),
    .group-child-package > div:not(div:last-child) {
      margin-bottom: 10px;
    }

    .group-package__row-cell {
      display: flex;
      align-items: center;
      overflow-x: auto;
      overflow-y: hidden;
      flex-shrink: 0;
      margin-bottom: 10px;

      & > div {
        flex-shrink: 0;
      }

      & > div:not(div:last-child) {
        margin-right: 10px;
      }
    }

    .group-package-details {
      display: flex;
      flex-direction: column;

      .roup-child-package {
        display: flex;
        flex-direction: column;
      }
    }
  }
</style>
