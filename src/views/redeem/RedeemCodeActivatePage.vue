<template>
  <div class="redeem-code-activate-page">
    <template v-if="deviceList.length">
      <div class="main-content">
        <!-- <nav-bar-component title="云服务兑换" sticky>
        <template #left>
          <van-icon
            name="arrow-left"
            color="#000"
            size="0.5rem"
            @click="$router.push('/home/redeem-code')"
          />
        </template>
      </nav-bar-component> -->
        <div class="page-content">
          <!-- device select component -->
          <div class="area-title"> {{ $t('redeem-code.select-device') }} </div>

          <RedeemDeviceSelect
            :active-sn="selectedDeviceSn"
            @handle-click-device-card="handleSelectDevice"
          />

          <!-- package detail component -->
          <div class="area-title"> {{ $t('redeem-code.pkg-info') }} </div>

          <PackageDetailDisplay :slect-device-sn="selectedDeviceSn" />

          <!-- redeem desc area -->
          <div class="redeem-desc">
            <div class="area-title"> {{ $t('redeem-code.redeem-introduce') }} </div>
            <div class="redeem-desc-content"> {{ $t('redeem-code.redeem-introduce-value') }} </div>
          </div>
        </div>
      </div>
      <div class="submit-btn">
        <van-button block type="primary" @click="handleSubmit">
          {{ $t('redeem-code.confirm') }}
        </van-button>
      </div>
    </template>
    <template v-else>
      <div class="no-device-empty-img">
        <img src="/src/assets/images/no_device_img.png" alt="" />
        <span class="desc">{{ $t('redeem-code.no-device') }}</span>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
  import { showDialog, showLoadingToast, showToast } from 'vant';
  import { computed, ref } from 'vue';
  import { useRouter } from 'vue-router';
  // import NavBarComponent from './components/NavBarComponent.vue';
  import RedeemDeviceSelect from './components/RedeemDeviceSelect.vue';
  import PackageDetailDisplay from './components/PackageDetailDisplay.vue';
  import { useMethodChannelStore, useRedeemStore } from '@/stores';
  import { useI18n } from 'vue-i18n';
  import { skuType } from '../cloud-storage/order/common';

  const { t } = useI18n();
  const router = useRouter();
  const redeemStore = useRedeemStore();
  const { acceptMessage, postMessage } = useMethodChannelStore();
  let hasInitGetDeviceCover: boolean = false;

  const selectedDeviceSn = ref<string>('');
  const deviceList = computed(() => redeemStore.deviceList);

  function handleSelectDevice(deviceSN: string) {
    if (selectedDeviceSn.value !== deviceSN) {
      selectedDeviceSn.value = deviceSN;
      redeemStore.getDevicePackageStatus(redeemStore.redeemCode!, selectedDeviceSn.value);
    }
    console.log('selectedDeviceSn: ', selectedDeviceSn.value);
  }

  // 提交兑换表单
  async function handleSubmit() {
    if (!redeemStore.deviceList.length) {
      showDialog({
        title: t('toast.tip'),
        message: t('redeem-code.no-device-msg'),
      });
      return;
    }

    if (!selectedDeviceSn.value) {
      showToast(t('redeem-code.select-device-tip'));
      return;
    }

    const toast = showLoadingToast(t('redeem-code.redeeming'));
    try {
      await redeemStore.redeemCloudPackage(selectedDeviceSn.value);
      const deviceSkuType = redeemStore.redeemPackageInfo?.skuType;
      showDialog({
        title: t('toast.tip'),
        message: t('redeem-code.redeem-success'),
      }).then(() => {
        // 判断套餐类型
        if (deviceSkuType === skuType.cs) {
          router.replace(`/cloud-storage/setting?sn=${selectedDeviceSn.value}`);
        } else if (deviceSkuType === skuType.data) {
          router.replace(`/gsmdata/setting?sn=${selectedDeviceSn.value}`);
        } else {
          router.replace('/home/redeem-code');
        }
      });
    } catch (e) {
      console.log('handleSubmit Error: ', e);
    } finally {
      toast.close();
    }
  }

  // 查询兑换码对应套餐信息
  async function getReedemCodeInfo() {
    const query = router.currentRoute.value.query;
    if (query['redeemCode']) {
      // getAllDevcieCloudStoragStatusList(query['redeemCode'] as string);
      await redeemStore.requestRedeemCodeInfo(query['redeemCode'] as string);
    } else {
      router.replace('/home/redeem-code');
    }
  }

  // 获取所需数据
  async function requestServiceData() {
    if (!redeemStore.redeemCode) {
      getReedemCodeInfo();
    }

    if (!redeemStore.deviceList.length) {
      const toast = showLoadingToast(t('toast.loading'));
      try {
        await redeemStore.requestUserDeviceList();

        if (redeemStore.deviceList.length) {
          selectedDeviceSn.value = redeemStore.deviceList[0].sn;
          redeemStore.getDevicePackageStatus(redeemStore.redeemCode!, selectedDeviceSn.value);
        }
      } finally {
        toast.close();
      }
    } else {
      selectedDeviceSn.value = redeemStore.deviceList[0].sn;
      redeemStore.getDevicePackageStatus(redeemStore.redeemCode!, selectedDeviceSn.value);
    }
  }

  requestServiceData();

  // 获取设备封面 （执行一次即可）
  function requestDeviceCoverImages() {
    if (!hasInitGetDeviceCover) {
      postMessage({
        method: 'getDeviceCover',
        data: null,
      });
      hasInitGetDeviceCover = true;
    }
  }

  requestDeviceCoverImages();

  acceptMessage(function (msg) {
    console.log('acceptMessage: ', msg);
    switch (msg.method) {
      case 'getDeviceCover':
        redeemStore.setDeviceCoverData(msg.data);
        break;

      default:
        break;
    }
  });
</script>

<style scoped lang="less">
  .redeem-code-activate-page {
    width: 100%;
    height: 100%;
    background-color: #f9f9f9;
    display: flex;
    flex-direction: column;
    // font-family: 'Honor';

    .main-content {
      flex: auto;

      .page-content {
        padding: 0 26px;
        .area-title {
          padding: 13px 0;
          font-size: 13px;
          font-weight: bold;
          color: #232323;
          line-height: 16px;
        }

        .redeem-desc {
          .redeem-desc-content {
            color: #b3b3b3;
            font-size: 12px;
            line-height: 16px;
          }
        }
      }
    }

    .submit-btn {
      margin: 26px;
    }

    .no-device-empty-img {
      width: 100%;
      height: 100vw;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;

      img {
        width: 166px;
        object-fit: contain;
      }

      .desc {
        font-size: 13px;
        line-height: 13px;
        font-weight: 500;
        color: #232323;
        margin-top: 18px;
      }
    }
  }
</style>
