<template>
  <div
    class="package-notice-bar"
    :class="{
      'package-status-expired': isExpired,
    }"
    :style="{
      visibility: packageStatusInfo ? 'visible' : 'hidden',
    }"
  >
    <!--  packageStatusInfo && packageStatusInfo.state !== PackageStatus.NONACTIVATED -->
    <template v-if="!isExpired">
      <div>{{ $t('cloud-storage.service-expired-time', [expiredTime]) }}</div>
      <div>{{ $t('cloud-storage.expired-duration', [duration]) }}</div>
    </template>
    <template v-else>
      <template v-if="packageStatusInfo?.state === PackageStatus.NONACTIVATED">
        <div>{{ $t('cloud-storage.nonactived') }}</div>
      </template>
      <template v-else>
        <div>{{ $t('cloud-storage.expried-service', [expiredTime]) }}</div>
        <div>{{ $t('cloud-storage.expried-duration', [duration]) }}</div>
      </template>
    </template>
  </div>
</template>

<script setup lang="ts">
  import { useCloudStorageStore } from '@/stores';
  import { PackageStatus } from '@/stores/modules/types/cloudStorage';
  import dayjs from 'dayjs';
  import { storeToRefs } from 'pinia';
  import { computed } from 'vue';

  const { packageStatusInfo } = storeToRefs(useCloudStorageStore());

  const expiredTime = computed(() =>
    dayjs(packageStatusInfo.value?.expireTime ?? undefined).format('YYYY-MM-DD'),
  );

  // 是否过期
  const isExpired = computed(() => +Date.now() > (packageStatusInfo.value?.expireTime ?? 0));

  // 过期 & 到期时间
  const duration = computed(() =>
    Math.floor(
      Math.abs((+Date.now() - (packageStatusInfo.value?.expireTime ?? 0)) / (24 * 3600 * 1000)),
    ),
  );
</script>

<style scoped lang="less">
  .package-notice-bar {
    padding: 10px 20px;
    height: 38px;
    font-size: 12px;
    color: #ffffff;
    text-shadow: 1px 1px 1px rgba(66, 44, 23, 0.53);
    display: flex;
    justify-content: space-between;
    background-color: rgba(21, 99, 215, 0.6);
  }

  .package-status-expired {
    background-color: rgba(147, 147, 147, 0.6) !important;
  }
</style>
