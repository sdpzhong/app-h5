<template>
  <div class="operator-start-page van-safe-area-bottom">
    <div class="page-wrapper">
      <!-- <img src="/src/assets/images/4g/product-bg.png" alt="" class="device-image" /> -->
      <div class="network-swich-title">{{ $t('gsmdata.operator-switch.help') }}</div>
      <div class="network-swich-content">{{ $t('gsmdata.operator-switch.help-options-1') }}</div>
      <div class="network-swich-content">{{ $t('gsmdata.operator-switch.help-options-2') }}</div>
      <div style="flex: 1"></div>
      <div class="bottom-section">
        <div class="opt-check-box" @click="checked = !checked">
          <van-checkbox
            v-model="checked"
            checked-color="#247CFF"
            class="opt-check-box-target"
            icon-size="0.3467rem"
            @click.stop
          />
          {{ $t('gsmdata.operator-switch.check') }}
        </div>
        <van-button type="primary" block :disabled="!checked" @click="handleStart">{{
          $t('gsmdata.operator-switch.next-step')
        }}</van-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  import { useOperatorSwitch } from './useOperatorSwitch';
  import { useMethodChannelStore } from '@/stores';

  const router = useRouter();

  const { postMessageAndCheckVersion } = useMethodChannelStore();

  const checked = ref(false);

  const { updateProcessEndTime } = useOperatorSwitch();

  async function handleStart() {
    const sn = router.currentRoute.value.query['sn'] as string;
    // 开启屏幕常亮
    postMessageAndCheckVersion({
      method: 'setScreenStatus',
      //  status ：0取消屏幕常亮 1保持屏幕常亮
      data: { status: 1 },
    });

    // 记录过程开始时间
    updateProcessEndTime();
    router.replace({
      path: '/gsmdata/operator-switch/loading',
      query: {
        sn,
      },
    });
  }
</script>

<style scoped lang="less">
  .operator-start-page {
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

      .device-image {
        display: block;
        width: 106px;
        height: 106px;
        object-fit: contain;
        margin: 13px 0;
      }

      .network-swich-title {
        width: 100%;
        font-weight: 500;
        font-size: 14px;
        color: #232323;
        text-align: left;
        margin-bottom: 6px;
        margin-top: 10px;
      }

      .network-swich-content {
        width: 100%;
        font-size: 12px;
        color: #8f8f8f;
        text-align: left;
        margin-bottom: 6px;
      }

      .bottom-section {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;
        .opt-check-box {
          display: flex;
          align-items: center;
          margin-bottom: 20px;
          color: #8f8f8f;

          .opt-check-box-target {
            margin-right: 4px;
            font-size: 12px;
          }
        }
      }

      .tip-label {
        width: 100%;
        display: flex;
        align-items: baseline;
        color: #247cff;
        padding: 8px 0;
        font-size: 14px;
      }
    }
  }

  .toast-popup {
    background-color: transparent;
    padding: 22px 16px;

    .inner-box {
      padding: 16px;
      min-height: 300px;
      display: flex;
      flex-direction: column;
      align-items: center;
      background: linear-gradient(180deg, #edf8ff 0%, #ffffff 100%);
      border-radius: 8px;
      position: relative;

      .close-btn {
        position: absolute;
        right: 12px;
        top: 12px;
      }

      .inner-box__title {
        color: #232323;
        font-size: 14px;
        font-weight: 500;
        margin: 8px 0 16px;
      }

      .inner-box__content {
        > li {
          margin-bottom: 4px;
          font-size: 12px;
          color: #737373;
        }
      }
    }
  }
</style>
