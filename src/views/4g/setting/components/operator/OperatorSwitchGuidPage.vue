<template>
  <div class="opt-guid-page van-safe-area-bottom">
    <div class="opt-guid__title">{{
      $t('gsmdata.opt-guid.list-label', [operatorList.length])
    }}</div>
    <div class="opt-list">
      <div class="opt-list__item" v-for="item of operatorList" :key="item.operatorId">
        <img class="opt-icon" v-if="item.operatorIconUrl" :src="item.operatorIconUrl" alt="" />
        <span class="opt-name">{{ item.operatorName }}</span>
        <span class="opt-currnt__tag" v-if="currentOperator?.operatorId === item.operatorId">{{
          $t('gsmdata.inuse')
        }}</span>
      </div>
    </div>
    <div style="flex: 1"></div>
    <div class="opt-guid-bottom">
      <div class="opt-tip">{{ $t('gsmdata.opt-net-unuse') }}</div>
      <div class="pain-btn van-haptics-feedback" @click="toStartPage">{{
        $t('gsmdata.network-switch')
      }}</div>
    </div>

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
  import { resetEsimNetwork } from '@/api/modules/iot-device';
  import useLoading from '@/hooks/loading';
  import { useTrafficSetting } from '@/stores';
  import { storeToRefs } from 'pinia';
  import { showToast } from 'vant';
  import { ref } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { useRouter } from 'vue-router';

  const router = useRouter();
  const { t } = useI18n();

  const { sn, currentOperator, operatorList, simpleDeviceInfo } = storeToRefs(useTrafficSetting());

  const resetNetworkPopup = ref<boolean>(false);

  function toStartPage() {
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
  .opt-guid-page {
    width: 100%;
    height: 100%;
    overflow-x: hidden;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    background-color: #f9f9f9;
    padding: 13px 26px 26px;

    .opt-guid__title {
      margin-bottom: 10px;
      font-size: 14px;
      color: #232323;
    }

    .opt-list {
      overflow: auto;
      .opt-list__item {
        height: 50px;
        border-radius: 8px;
        background-color: #fff;
        display: flex;
        align-items: center;
        padding: 0 16px;

        .opt-icon {
          width: 100px;
          max-height: 48px;
          object-fit: contain;
          margin-right: 10px;
        }

        .opt-name {
          flex: 1;
        }

        .opt-currnt__tag {
          color: #247cff;
        }

        &:not(:last-child) {
          margin-bottom: 8px;
        }
      }
    }

    .opt-guid-bottom {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-top: 20px;
      .opt-tip {
        font-size: 11px;
        color: #737373;
        margin-bottom: 6px;
      }

      .pain-btn {
        width: fit-content;
        padding: 4px 8px;
        border-radius: 2px;
        border: 1px solid #006aff;
        color: #006aff;
        font-size: 11px;
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
