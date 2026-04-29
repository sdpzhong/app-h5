<template>
  <div class="operator-switch-result van-safe-area-bottom">
    <div class="page-wrapper">
      <img class="opt-result-img" src="/src/assets/images/4g/icon-ok.png" alt="" />
      <div class="opt-result">{{ $t('gsmdata.operator-switch.success') }}</div>
      <div style="flex: 1"></div>
      <van-button type="primary" block @click="handleBack">{{
        $t('gsmdata.operator-switch.back')
      }}</van-button>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { useTrafficSetting } from '@/stores';
  import { useRouter } from 'vue-router';

  const trafficSettingStore = useTrafficSetting();

  const router = useRouter();
  function handleBack() {
    const sn = router.currentRoute.value.query['sn'] as string;
    trafficSettingStore.requestDeviceInfo();
    router.replace({
      path: '/gsmdata/setting',
      query: {
        sn,
      },
    });
  }
</script>

<style scoped lang="less">
  .operator-switch-result {
    width: 100%;
    height: 100%;
    overflow-x: hidden;
    overflow-y: auto;
    display: flex;
    flex-direction: column;

    .page-wrapper {
      height: 100%;
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 0 26px 42px 26px;

      .opt-result-img {
        display: block;
        width: 103px;
        height: 103px;
        object-fit: contain;
        margin-top: 130px;
        margin-bottom: 12px;
      }

      .opt-result {
        font-size: 14px;
        color: #232323;
      }
    }
  }
</style>
