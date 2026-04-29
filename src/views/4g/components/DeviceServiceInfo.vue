<template>
  <div class="device-info">
    <div class="device-info-container">
      <div class="device-info__name row-text__ellipsis">{{ selectDevice?.name ?? '_' }}</div>
      <div
        class="switch-device__btn van-haptics-feedback"
        v-if="!requestDevcieLoading && deviceList.length > 1"
        @click="() => (bottomSheetVisiable = true)"
      >
        <!-- <van-icon name="exchange" /> -->
        <v-icon icon="humbleicons:exchange-horizontal" />
      </div>
    </div>
    <div class="device-info__ids">
      <div
        class="device-info__sn"
        :style="{
          visibility: selectDevice?.sn ? 'visible' : 'hidden',
        }"
        >DID: {{ selectDevice?.sn ?? '' }} <CopyTextButton :value="selectDevice?.sn" is-tip
      /></div>
      <!-- <div class="device-info__iccid"
        >ICCID: {{ selectDevice?.iccid ?? '' }} <CopyTextButton value="ID114514" is-tip
      /></div> -->
    </div>
    <div class="service-introduce">
      <div class="service-introduce-item">
        <img
          class="service-introduce-item__icon"
          src="/src/assets/images/cloud-storage/icon-4g-speed.png"
          alt="icon"
        />
        <div class="service-introduce-item__label"> {{ $t('traffic.speed-network') }} </div>
      </div>
      <div class="service-introduce-item">
        <img
          class="service-introduce-item__icon"
          src="/src/assets/images/cloud-storage/icon-4g-global.png"
          alt="icon"
        />
        <div class="service-introduce-item__label"> {{ $t('traffic.global-network') }} </div>
      </div>
      <div class="right-arrow" @click="handleToIntroducePage">></div>
    </div>
  </div>

  <!--  设备选择弹窗 -->
  <van-popup v-model:show="bottomSheetVisiable" round closeable position="bottom">
    <DeviceSelectBottomSheet @close-bottom-sheet="closeBottomSheet" />
  </van-popup>
</template>

<script setup lang="ts">
  import { useTrafficPackageStore } from '@/stores/modules/trafficPackage';
  import { storeToRefs } from 'pinia';
  import { ref } from 'vue';
  import DeviceSelectBottomSheet from './DeviceSelectBottomSheet.vue';
  import { useMethodChannelStore } from '@/stores';

  const { selectDevice, deviceList, requestDevcieLoading } = storeToRefs(useTrafficPackageStore());

  const bottomSheetVisiable = ref(false);

  function closeBottomSheet() {
    bottomSheetVisiable.value = false;
  }

  const { postMessage } = useMethodChannelStore();

  function handleToIntroducePage() {
    postMessage({
      method: 'appRouter',
      data: {
        page: 'OpenWeb',
        params: { url: '#/gsmdata/introduce?fromBuy=true' },
      },
    });
  }
</script>

<style scoped lang="less">
  .device-info {
    display: flex;
    flex-direction: column;
    padding: 20px;

    .device-info-container {
      display: flex;
      align-items: start;
      .device-info__name {
        flex: 1;
        font-weight: 500;
        font-size: 18px;
        color: #ffffff;
        padding-bottom: 10px;
      }

      .switch-device__btn {
        padding: 4px;
        color: #fff;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 20px;
      }
    }

    .device-info__ids {
      font-weight: 400;
      font-size: 11px;
      color: #ffffff;
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      padding-bottom: 20px;

      ::v-deep(.copy-text-button) {
        color: #fff;
        font-size: 12px;
      }

      .device-info__sn {
        margin-right: 16px;
      }
    }

    .service-introduce {
      display: flex;
      align-items: center;
      color: #ffffff;

      .service-introduce-item {
        flex: 1;
        flex-shrink: 0;
        display: flex;
        align-items: center;
        justify-content: start;

        .service-introduce-item__icon {
          height: 32px;
          width: 32px;
          display: block;
          object-fit: cover;
          margin-right: 4px;
        }

        .service-introduce-item__label {
          font-weight: 500;
          font-size: 11px;
          line-height: 12px;
          text-align: left;
          font-style: normal;
          text-transform: none;
        }
      }

      .right-arrow {
        height: 100%;
        padding: 0 8px;
        transition: 0.36s opacity;

        &:active {
          opacity: 0.6;
        }
      }
    }
  }
</style>
