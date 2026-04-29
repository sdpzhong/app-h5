<template>
  <div class="van-safe-area-bottom">
    <div class="device-selector">
      <div class="device-selector__cells">
        <van-space direction="vertical" fill size="0.2667rem">
          <div
            class="device-info-cell device-info-cell-border-noconvert"
            :class="{ 'device-info-cell__active': activeItemSn === item.sn }"
            v-for="(item, index) of deviceList"
            :key="index"
            @click="handleSelect(item)"
          >
            <div class="device-info-cell__base-info">
              <div class="device-info-cell__name row-text__ellipsis">{{ item.name ?? '_' }}</div>
              <div class="device-info-cell__sn row-text__ellipsis">DID: {{ item.sn }}</div>
            </div>
            <div class="device-info-cell__check">
              <van-checkbox :model-value="activeItemSn === item.sn" icon-size="0.48rem"
            /></div>
          </div>
        </van-space>
      </div>
      <van-button type="primary" block class="pay-btn" @click="handleExchangeDevice">{{
        $t('cloud-storage.switch-device')
      }}</van-button>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { usePurchaseStore } from '@/stores';
  import { storeToRefs } from 'pinia';
  import { ref } from 'vue';

  const emit = defineEmits(['closeBottomSheet']);

  const purchaseStore = usePurchaseStore();
  const { deviceList, selectDevice, selectDeviceSN, currentPackageType, selectPackage } =
    storeToRefs(purchaseStore);
  const activeItemSn = ref();
  activeItemSn.value = selectDevice.value?.sn;

  function handleSelect(device: UserDeviceInfo) {
    activeItemSn.value = device.sn;
  }

  // 切换设备
  function handleExchangeDevice() {
    if (activeItemSn.value) {
      selectDeviceSN.value = activeItemSn.value;

      // 更新tabbar
      purchaseStore.setTabbarList();
      purchaseStore.updateTabbarTagStatus();

      purchaseStore.comboPackageList = [];
      purchaseStore.cloudStoragePackageList = [];
      purchaseStore.gsmdataPackageList = [];

      //直接刷新套餐列表
      purchaseStore.requestPacakgeList(currentPackageType.value, true);
      // 请求设备服务（状态）信息
      purchaseStore.requestCsPackageServiceStatusInfo(selectDeviceSN.value!, true);
      purchaseStore.requestGsmdataPackageServiceStatusInfo(selectDeviceSN.value!, true);
      selectPackage.value = void 0;
    }
    // 关闭弹窗
    emit('closeBottomSheet');
  }
</script>

<style scoped lang="less">
  .device-selector {
    padding: 35px 26px 20px;

    .device-selector__cells {
      margin: 40px 0;
      max-height: 50vh;
      overflow-x: hidden;
      overflow-y: scroll;

      .device-info-cell-border-noconvert {
        border: 2px solid rgba(35, 35, 35, 0.1);
      }

      .device-info-cell {
        display: flex;
        align-items: center;
        padding: 10px;

        border-radius: 7px;
        transition: 0.3s all;

        .device-info-cell__base-info {
          flex: 1;
          overflow: hidden;
          .device-info-cell__name {
            font-weight: 500;
            font-size: 14px;
            color: #232323;
          }

          .device-info-cell__sn {
            font-weight: 500;
            font-size: 12px;
            color: #8f8f8f;
          }
        }

        .device-info-cell__check {
          flex-shrink: 0;
        }

        .payment-method__icon {
          display: block;
          width: 32px;
          height: 32px;
          object-fit: contain;
          margin-right: 6px;
        }

        .device-info-cell__label {
          flex: 1;
          font-weight: 500;
          font-size: 14px;
          color: #232323;
        }

        &:active {
          background-color: #f2f3f5;
        }
      }

      .device-info-cell__active {
        border-color: #247cff;
      }
    }

    .pay-btn {
      margin-top: 38px;
      font-size: 13px;
      // background: linear-gradient(to right, rgba(36, 124, 255, 1), rgba(96, 160, 255, 1));
      .price {
        .price__pre {
          font-size: 11px;
          margin-left: 4px;
        }
      }
    }
  }
</style>
