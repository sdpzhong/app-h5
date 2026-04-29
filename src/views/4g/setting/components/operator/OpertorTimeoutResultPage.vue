<template>
  <div class="operator-switch-result van-safe-area-bottom">
    <div class="opt-result__header">
      <div class="header-title">{{ $t('gsmdata.operator-switch.fail-title') }}</div>
      <div class="header-subtitle">{{ $t('gsmdata.operator-switch.timeout-title') }}</div>
    </div>
    <div class="fail-desc">
      <div class="fail-desc__label">{{ $t('gsmdata.operator-switch.fail-content-title') }}</div>
      <div class="fail-desc__title">{{ $t('gsmdata.operator-switch.fail-label-1') }}</div>
      <div class="fail-desc__value">{{ $t('gsmdata.operator-switch.fail-desc-1') }} </div>
      <div class="fail-desc__title">{{ $t('gsmdata.operator-switch.fail-label-2') }}</div>
      <div class="fail-desc__value">{{ $t('gsmdata.operator-switch.fail-desc-2') }}</div>
      <div class="fail-desc__title">{{ $t('gsmdata.operator-switch.fail-label-3') }}</div>
      <div class="fail-desc__value">{{ $t('gsmdata.operator-switch.fail-desc-3') }}</div>
      <div class="fail-desc__title">{{ $t('gsmdata.operator-switch.back-tip') }} </div>
    </div>
    <div style="flex: 1"></div>
    <div class="btn-wrapper">
      <van-button type="primary" block @click="handleBack">{{
        $t('gsmdata.operator-switch.back')
      }}</van-button>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { useRouter } from 'vue-router';

  const router = useRouter();
  function handleBack() {
    const sn = router.currentRoute.value.query['sn'] as string;
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

    .opt-result__header {
      width: 100%;
      height: 160px;
      background-image: url('/src/assets/images/4g/fail-banner.png');
      background-repeat: no-repeat;
      background-size: contain;
      background-position: top;
      display: flex;
      flex-direction: column;
      justify-content: center;
      padding: 0 128px 0 26px;

      .header-title {
        font-weight: 500;
        font-size: 23px;
        color: #ff2c2c;
        text-align: left;
        font-style: normal;
      }

      .header-subtitle {
        font-weight: 500;
        font-size: 12px;
        color: rgba(255, 44, 44, 0.5);
        text-align: left;
        font-style: normal;
      }
    }

    .fail-desc {
      padding: 19px 26px;
      display: flex;
      flex-direction: column;

      .fail-desc__label {
        font-size: 14px;
        color: #232323;
        margin-bottom: 10px;
      }

      .fail-desc__title {
        font-size: 12px;
        color: #232323;
        margin-bottom: 3px;
      }

      .fail-desc__value {
        font-size: 12px;
        color: #8f8f8f;
        margin-bottom: 19px;
      }
    }

    .btn-wrapper {
      padding: 0 26px 38px 26px;
    }
  }
</style>
