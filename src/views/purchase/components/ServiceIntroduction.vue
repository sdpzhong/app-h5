<template>
  <div
    class="service-introduction"
    v-if="purchaseStore.selectPackage?.type === PackageType.autoRenew"
  >
    <Divider :title="$t('purchase.introduction')" />
    <ul v-if="baseInfo?.platform === 'ios'" style="list-style-type: disc; padding-left: 0.4267rem">
      <li>{{ $t('cloud-storage.renewal-desc.ios-item1') }}</li>
      <li>{{ $t('cloud-storage.renewal-desc.ios-item2') }}</li>
      <li>{{ $t('cloud-storage.renewal-desc.ios-item3') }}</li>
    </ul>

    <ul v-else style="list-style-type: disc; padding-left: 0.4267rem">
      <li>{{ $t('cloud-storage.renewal-desc.android-item1') }}</li>
      <li>{{ $t('cloud-storage.renewal-desc.android-item2') }}</li>
      <li>{{ $t('cloud-storage.renewal-desc.android-item3') }}</li>
    </ul>
  </div>
</template>

<script setup lang="ts">
  import { useAppEnvStore, usePurchaseStore } from '@/stores';
  import Divider from './Divider.vue';
  import { PackageType } from '@/stores/modules/types/cloudStorage';
  import { storeToRefs } from 'pinia';

  const purchaseStore = usePurchaseStore();
  const { baseInfo } = storeToRefs(useAppEnvStore());
</script>

<style scoped lang="less">
  .service-introduction {
    display: flex;
    flex-direction: column;

    ul {
      list-style: inside !important;
      font-weight: 400;
      font-size: 11px;
      color: #8f8f8f;
    }
  }
</style>
