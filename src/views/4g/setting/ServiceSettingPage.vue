<template>
  <div class="van-safe-area-bottom">
    <div class="traffic-service-setting-page">
      <!-- notice bar -->
      <div class="traffic-notice-bar" v-if="simpleDeviceInfo?.simType === SimType.sim">
        <img src="/src/assets/icons/icon-error.png" alt="" />
        <span class="notice-info">{{ $t('gsmdata.use-sim-tip-suffix') }}</span>
        <span class="link" @click="showToastPopup">{{ $t('gsmdata.switch-esim') }}</span>
      </div>
      <div
        class="traffic-notice-bar"
        v-else-if="
          simpleDeviceInfo?.simType === SimType.esim &&
          [SimStatusEnum.unactived, SimStatusEnum.recycled].includes(simpleDeviceInfo?.simState)
        "
      >
        <img src="/src/assets/icons/icon-error.png" alt="" />
        <span class="notice-info">{{ $t('gsmdata.esim-unactived-tip-suffix') }}</span>
        <span class="link" @click="showToastPopup">{{ $t('gsmdata.esim-reactive') }}</span>
      </div>

      <div class="page-wrapper">
        <!-- device info section -->
        <!-- <DeviceInfoSection /> -->
        <TrafficServiceCard />

        <!-- introduce info -->
        <TrafficIntroduceCard @open-cloud-stroage-page="openCloudStroagePage" />

        <div style="flex: 1"></div>

        <!-- go to pay button -->
        <!--          v-if="
            simpleDeviceInfo?.simType === SimType.esim &&
            simpleDeviceInfo?.simState === SimStatusEnum.actived
          " -->
        <div class="to-pay-btn" @click="openTrafficPage">{{
          serviceInfo?.state !== PackageStatus.NONACTIVATED
            ? $t('traffic.xufei')
            : $t('cloud-storage.start-service')
        }}</div>
        <!-- <div v-else class="disable-btn-section">
          <div class="disable-msg">
            <img class="disable-msg__icon" src="/src/assets/icons/icon-error.png" alt="" />{{
              $t('traffic.use-sim-msg')
            }}</div
          >
          <div class="disable-btn" @click="showSuggestToast">{{ $t('traffic.xufei') }}</div>
          <div class="show-toast-btn" @click="() => (showPopup = true)">{{
            $t('traffic.msg-question-title')
          }}</div>
        </div> -->
      </div>
    </div>

    <!-- toast popup -->
    <van-popup v-model:show="showPopup" position="bottom" class="toast-popup">
      <div class="inner-box">
        <van-icon
          name="cross"
          class="close-btn van-haptics-feedback"
          size="0.3733rem"
          @click="showPopup = false"
        />
        <div class="toast-title">{{
          simpleDeviceInfo?.simType === SimType.sim
            ? $t('traffic.msg-question-title')
            : $t('traffic.msg-question-title-esim')
        }}</div>
        <div class="toast-content" @click="showResetNetworkPopup">
          <template v-if="simpleDeviceInfo?.simType === SimType.sim">
            <div class="tc-title">{{ $t('gsmdata.opt-title') }} </div>
            <div class="tc-text">{{ $t('gsmdata.switch-esim-step-1') }}</div>
            <div class="tc-text">{{ $t('gsmdata.switch-esim-step-2') }}</div>
          </template>
          <template v-else>
            <div class="tc-title">{{ $t('gsmdata.opt-title') }} </div>
            <div class="tc-text">{{ $t('gsmdata.active-esim-step') }}</div>
          </template>
          <div class="reset-btn">
            {{ $t('gsmdata.reset-network') }}
          </div>
          <div class="reset-help" v-if="simpleDeviceInfo?.simType === SimType.sim">
            <div class="reset-help__label">{{ $t('gsmdata.help-title') }}</div>
            <div class="reset-help__content"> {{ $t('gsmdata.reset-network-help') }}</div>
          </div>
        </div>
        <div class="toast-btn" @click="() => (showPopup = false)">{{ $t('traffic.close') }}</div>
      </div>
    </van-popup>

    <!-- reset network service popup -->
    <van-popup v-model:show="resetNetworkPopup" position="bottom" class="toast-popup">
      <div class="inner-box">
        <van-icon
          name="cross"
          class="close-btn van-haptics-feedback"
          size="0.3733rem"
          @click="resetNetworkPopup = false"
        />
        <div class="toast-title">{{ $t('gsmdata.popup-tip-title') }}</div>
        <div class="toast-content">
          <div class="tc-text">{{ $t('gsmdata.reset-options-1') }}</div>
          <div class="tc-text">{{ $t('gsmdata.reset-options-2') }}</div>
          <div class="reset-help">
            <div class="reset-help__label">{{ $t('gsmdata.help-title') }}</div>
            <div class="reset-help__content">
              {{ $t('gsmdata.reset-tip-1') }}
            </div>
            <div class="reset-help__content">
              {{ $t('gsmdata.reset-tip-2') }}
            </div>
          </div>
        </div>
        <van-button
          style="margin-top: 20px"
          type="primary"
          block
          :loading="loading"
          @click="handleStartReset"
          :loading-text="$t('gsmdata.resetting')"
          >{{ $t('traffic.start-reset') }}</van-button
        >
      </div>
    </van-popup>
  </div>
</template>

<script setup lang="ts">
  import { useTrafficSetting } from '@/stores/modules/trafficSetting';
  import { storeToRefs } from 'pinia';
  import { ref } from 'vue';
  import { SimStatusEnum, SimType } from '../types/4g-page';
  import { showToast } from 'vant';
  import { useI18n } from 'vue-i18n';
  import TrafficIntroduceCard from './components/TrafficIntroduceCard.vue';
  import TrafficServiceCard from './components/TrafficServiceCard.vue';
  import { PackageStatus } from '@/stores/modules/types/cloudStorage';
  import { useRouter } from 'vue-router';
  import useLoading from '@/hooks/loading';
  import { resetEsimNetwork } from '@/api/modules/iot-device';
  import { SkuType } from '@/stores/modules/types/purchase';

  const router = useRouter();

  const { t } = useI18n();

  const trafficSettingStore = useTrafficSetting();
  const { simpleDeviceInfo, sn, serviceInfo } = storeToRefs(trafficSettingStore);

  const showPopup = ref<boolean>(false);
  const resetNetworkPopup = ref<boolean>(false);

  function openCloudStroagePage() {
    // postMessage({
    //   method: 'appRouter',
    //   data: {
    //     page: 'OpenWeb',
    //     params: { url: `#/cloud-storage?sn=${sn.value}` },
    //   },
    // });
    router.replace({
      path: '/purchase',
      query: {
        skuType: SkuType.cs,
        sn: sn.value,
      },
    });
  }

  function openTrafficPage() {
    // postMessage({
    //   method: 'appRouter',
    //   data: {
    //     page: 'OpenWeb',
    //     params: { url: `#/gsmdata?sn=${sn.value}` },
    //   },
    // });
    router.replace({
      path: '/purchase',
      query: {
        skuType: SkuType.gsmdata,
        sn: sn.value,
      },
    });
  }

  // @ts-ignore
  function _showSuggestToast() {
    showToast(t('traffic.use-sim-msg'));
  }

  function showToastPopup() {
    if (!simpleDeviceInfo.value?.owner) {
      showToast(t('gsmdata.opt-support-tip'));
      return;
    }
    showPopup.value = true;
  }

  function showResetNetworkPopup() {
    showPopup.value = false;
    resetNetworkPopup.value = true;
  }

  const { loading, setLoading } = useLoading();
  async function handleStartReset() {
    setLoading(true);
    try {
      await resetEsimNetwork({ sn: simpleDeviceInfo.value!.sn }, 'none');
      router.push({
        path: '/gsmdata/operator-switch/start',
        query: {
          sn: sn.value,
        },
      });
    } catch (error) {
      showToast(t('gsmdata.reset-fail'));
      console.log('handleStartReset fail: ', error);
    } finally {
      setLoading(false);
      resetNetworkPopup.value = false;
    }
  }
</script>

<style scoped lang="less">
  .traffic-service-setting-page {
    height: 100%;
    overflow-x: hidden;
    overflow-y: auto;
    position: relative;
    background: #f9f9f9;
    // background: linear-gradient(128deg, #d1e4ee 0%, #ffffff 100%);
    display: flex;
    flex-direction: column;

    .traffic-notice-bar {
      background-color: #ffcc00;
      font-weight: 400;
      font-size: 11px;
      color: rgba(35, 35, 35, 0.7);
      display: flex;
      align-items: center;
      padding: 6px 26px;

      > img {
        display: block;
        width: 13px;
        height: 13px;
        object-fit: contain;
        margin-right: 4px;
      }

      .link {
        color: #247cff;
      }
    }

    .page-wrapper {
      padding: 13px 26px 26px;
      display: flex;
      flex-direction: column;
      flex: 1;
      overflow-x: hidden;
      overflow-y: auto;

      > div {
        flex-shrink: 0;
      }
    }
  }

  .to-pay-btn {
    flex-shrink: 0;
    height: 46px;
    border-radius: 5px;
    background-color: #1b1b1b;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    font-weight: 400;
    font-size: 13px;
    line-height: 16px;
    font-style: normal;
    text-transform: none;
    transition: 0.36s opacity;
    margin-top: 13px;
    margin-bottom: 17px;

    &:active {
      opacity: 0.6;
    }
  }

  .disable-btn-section {
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin-top: 33px;

    .disable-msg {
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 400;
      font-size: 11px;
      color: #8f8f8f;
      line-height: 100%;
      text-align: left;
      font-style: normal;
      text-transform: none;
      margin-bottom: 10px;

      .disable-msg__icon {
        display: block;
        width: 11px;
        height: 11px;
        object-fit: contain;
        margin-right: 4px;
      }
    }

    .disable-btn {
      height: 46px;
      margin-bottom: 19px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #8f8f8f;
      border-radius: 5px;
      font-weight: 400;
      font-size: 13px;
      color: #ffffff;
      line-height: 16px;
      text-align: left;
      font-style: normal;
      text-transform: none;
    }

    .show-toast-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      color: #247cff;
      font-weight: 400;
      font-size: 12px;
      color: #247cff;
      line-height: 14px;
      text-align: center;
      font-style: normal;
      text-transform: none;
      transition: 0.36s opacity;

      &:active {
        opacity: 0.6;
      }
    }
  }

  .toast-popup {
    background-color: transparent;
    padding: 22px 16px;

    .inner-box {
      padding: 16px;
      min-height: 292px;
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

      .toast-title {
        width: 100%;
        font-weight: bold;
        padding: 13px 0;
        font-size: 14px;
        color: #232323;
        text-align: center;
        font-style: normal;
        text-transform: none;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .toast-content {
        width: 100%;
        flex: 1;
        font-weight: 400;
        font-size: 13px;
        color: #8f8f8f;
        line-height: 16px;
        text-align: left;
        font-style: normal;
        text-transform: none;

        .tc-title {
          font-weight: 500;
          color: #232323;
        }

        .tc-text {
          margin-top: 10px;
          color: #8f8f8f;
        }

        .reset-btn {
          width: fit-content;
          padding: 6px 12px;
          color: #006aff;
          border: 1px solid #006aff;
          border-radius: 2px;
          margin-top: 10px;
          cursor: pointer;
          font-size: 12px;

          &:active {
            opacity: 0.6;
          }
        }

        .reset-help {
          margin-top: 10px;
          .reset-help__label {
            color: #247cff;
            font-weight: 500;
            margin: 5px 0;
          }

          .reset-help__content {
            color: #8f8f8f;
            margin: 5px 0;
          }
        }
      }

      .toast-btn {
        width: 100%;
        padding: 13px;
        font-weight: 400;
        font-size: 13px;
        color: #ffffff;
        line-height: 16px;
        text-align: left;
        font-style: normal;
        text-transform: none;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #247cff;
        border-radius: 5px;
        transition: 0.36s opacity;
        margin-top: 20px;

        &:active {
          opacity: 0.6;
        }
      }
    }
  }
</style>
