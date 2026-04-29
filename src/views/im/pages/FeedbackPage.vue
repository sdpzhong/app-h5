<template>
  <div class="feedback-page van-safe-area-bottom">
    <div class="top-label">{{ $t('im.select-device') }}</div>
    <div class="device-select-section">
      <div class="loading-box" v-if="loading">
        <van-loading v-model="loading" type="spinner" size="0.4267rem" />
      </div>
      <template v-else>
        <div class="device-list" v-if="imService.deviceList.length">
          <div
            class="device-display-card card-border-noconvert"
            :class="{
              active: imService.selectDeviceSn === device.sn,
            }"
            v-for="device of imService.deviceList"
            :key="device.sn"
            @click="imService.selectDeviceSn = device.sn"
          >
            <div class="device-name row-text__ellipsis">{{ device.name ?? '_' }}</div>
            <div class="device-sn row-text__ellipsis">DID: {{ device.sn ?? '' }}</div>
          </div>
        </div>
        <div class="no-device" v-else>
          <img src="/src/assets/images/no_device_img.png" alt="" />
          <div class="no-device__tip">{{ $t('im.no-device') }}</div>
        </div>
      </template>
    </div>
    <div class="bottom-section">
      <!--      :disabled="nextBtnDisable" -->
      <van-button
        type="primary"
        block
        :loading="nextBtnDisable"
        :loading-text="$t('im.loading')"
        @click="handleToChatPage"
        >{{
          imService.deviceList.length ? $t('im.to-feedback-1') : $t('im.to-feedback-2')
        }}</van-button
      >
      <!-- <div class="divider">{{ $t('im.add-feedback') }}</div> -->
      <div class="contact-platforms">
        <!-- <div class="contact-playform-item" @click="$router.push('/feedback')">
          <img src="/src/assets/images/cloud-storage/pay-action/wechat-pay.png" alt="" />
          <div class="platform-name">{{ $t('im.wechat') }}</div>
        </div> -->
      </div>
    </div>
  </div>
</template>

<script setup lang="ts" name="Feedback">
  import useLoading from '@/hooks/loading';
  import { ConnectStateEnum, useImService } from '@/stores';
  import { delayFunction } from '@/utils/delay';
  import { IMSDK, useImSdkInitCallback } from '@/utils/open-im';
  import { LoginStatus } from '@openim/wasm-client-sdk';
  import { computed } from 'vue';
  import { useRouter } from 'vue-router';

  const router = useRouter();
  const imService = useImService();
  const { initCallback } = useImSdkInitCallback();

  const { loading, setLoading } = useLoading();

  const nextBtnDisable = computed(() => loading.value || imService.imLoginLoading);

  async function requestDeviceList() {
    try {
      setLoading(true);
      await imService.getDeviceList();
    } catch (e) {
      console.log('requestDeviceList error: ', e);
    } finally {
      setLoading(false);
    }
  }
  requestDeviceList();

  async function initImService() {
    imService.imLoginLoading = true;
    await initCallback();
    await delayFunction(1000);
    imService.login();

    // IMSDK.getLoginStatus()
    //   .then(() => {
    //     imService.login();
    //   })
    //   .catch(async () => {
    //     await delayFunction(1500);
    //     imService.login();
    //   });
  }
  initImService();

  async function handleToChatPage() {
    // 判断登录状态和连接状态后在跳转
    const { data } = await IMSDK.getLoginStatus();
    if (data == LoginStatus.Logged && imService.connectState === ConnectStateEnum.Success) {
      if (!imService.customerConversation) {
        await imService.getAllConversationList();
      }
      router.push('/im/chat');
    } else {
      // retry
      imService.login();
    }
  }
</script>

<style scoped lang="less">
  .feedback-page {
    padding-top: 13px;
    padding-left: 26px;
    padding-right: 26px;
    height: 100%;
    width: 100%;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    background-color: #f9f9f9;

    .device-list {
      margin-top: 6px;

      .device-display-card {
        min-height: 60px;
        padding: 11px 13px;
        border-radius: 8px;
        background-color: #fff;
        transition: 0.36s border-color;

        &.card-border-noconvert {
          border: 2px solid transparent;
        }

        &.active {
          border-color: #247cff;
        }

        .device-name {
          font-weight: 400;
          font-size: 13px;
          color: #232323;
          text-align: left;
          font-style: normal;
          text-transform: none;
          margin-bottom: 2px;
        }

        .device-sn {
          font-weight: 400;
          font-size: 11px;
          color: #8f8f8f;
          text-align: left;
          font-style: normal;
          text-transform: none;
        }

        &:not(&:last-child) {
          margin-bottom: 6px;
        }
      }
    }

    .top-label {
      font-weight: 400;
      font-size: 12px;
      color: #8f8f8f;
      text-align: left;
      font-style: normal;
      text-transform: none;
    }

    .device-select-section {
      flex: 1;
      overflow-x: hidden;
      overflow-y: auto;
      margin-bottom: 36px;
    }

    .no-device {
      display: flex;
      flex-direction: column;
      align-items: center;

      > img {
        display: block;
        height: 96px;
        object-fit: contain;
        margin-top: 108px;
        margin-bottom: 18px;
      }

      .no-device__tip {
        font-weight: 400;
        font-size: 13px;
        color: #232323;
        text-align: left;
        font-style: normal;
        text-transform: none;
      }
    }

    .bottom-section {
      .divider {
        text-align: center;
        margin: 20px 0 10px;
      }

      .contact-platforms {
        display: flex;
        align-items: center;
        justify-content: center;
        padding-bottom: 38px;
        .contact-playform-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          > img {
            height: 26px;
            width: 26px;
            object-fit: contain;
            display: block;
            margin-bottom: 4px;
          }

          .platform-name {
            font-size: 7px;
            color: #212121;
            text-align: center;
            font-style: normal;
            text-transform: none;
          }

          &:not(&:last-child) {
            margin-right: 22px;
          }
        }
      }
    }
  }

  .loading-box {
    // padding: 24px 0 38px;
    min-height: 118px;
    margin-bottom: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>
