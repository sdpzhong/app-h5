<template>
  <div class="device-info">
    <div class="device-info-container">
      <div class="device-info__name row-text__ellipsis">{{ selectDevice?.name ?? '_' }}</div>
      <div
        class="switch-device__btn van-haptics-feedback"
        v-if="!deviceListLoading && deviceList.length > 1"
        @click="() => (bottomSheetVisiable = true)"
      >
        <!-- <van-icon name="exchange" /> -->
        <v-icon icon="humbleicons:exchange-horizontal" />
      </div>
    </div>
    <div class="device-info__ids">
      <div
        class="device-info__sn"
        v-bind:style="{
          visibility: selectDevice?.sn ? 'visible' : 'hidden',
        }"
        >DID: {{ selectDevice?.sn }}
        <CopyTextButton v-if="selectDevice?.sn" :value="selectDevice?.sn" is-tip
      /></div>
      <!-- <div class="device-info__iccid"
            v-bind:style="{
          visibility: selectDevice?.sn ? 'visible' : 'hidden',
        }"
        >ICCID :AD4155412471157 <CopyTextButton value="AD4155412471157" is-tip
      /></div> -->
    </div>
    <div
      class="service-introduce"
      :class="{
        'service-introduce__en': locale === 'en-US',
      }"
      @click="handleShowMoreInfoPage"
    >
      <van-space size="0.32rem">
        <span class="service-introduce__tag">{{ $t('cloud-storage.safe-save') }}</span>
        <span class="service-introduce__tag">{{ $t('cloud-storage.offline-watch') }}</span>
        <span class="service-introduce__tag"> {{ $t('cloud-storage.video-encrpy') }}</span>
        <span class="service-introduce__tag">{{ $t('cloud-storage.speed-play') }}</span>
      </van-space>
      <span class="service-introduce__tag-icon">></span>
    </div>
  </div>

  <!--  设备选择弹窗 -->
  <van-popup v-model:show="bottomSheetVisiable" round closeable position="bottom">
    <DeviceSelectBottomSheet @close-bottom-sheet="closeBottomSheet" />
  </van-popup>
</template>

<script setup lang="ts">
  import { useCloudStorageStore, useMethodChannelStore } from '@/stores';
  import { storeToRefs } from 'pinia';
  import { ref } from 'vue';
  import { useI18n } from 'vue-i18n';
  import DeviceSelectBottomSheet from './DeviceSelectBottomSheet.vue';

  const { locale } = useI18n();

  const { selectDevice, deviceListLoading, deviceList } = storeToRefs(useCloudStorageStore());

  const bottomSheetVisiable = ref(false);

  const { postMessage } = useMethodChannelStore();

  function handleShowMoreInfoPage() {
    // todo: 调整为应用内跳转
    // router.push('/cloud-storage/introduce');
    postMessage({
      method: 'appRouter',
      data: {
        page: 'OpenWeb',
        params: { url: '#/cloud-storage/introduce?fromBuy=true' },
      },
    });
  }

  function closeBottomSheet() {
    bottomSheetVisiable.value = false;
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
        // background-color: red;
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
      display: inline-block;
      height: 30px;
      max-width: fit-content;
      display: flex;
      align-items: center;
      padding: 0 12px;
      border-radius: 15px;
      border: 1px solid #fff;
      background-color: rgba(255, 255, 255, 0.1);
      font-size: 12px;
      .service-introduce__tag {
        color: #fff;
        line-height: 12px;
        font-weight: 400;
        text-wrap: nowrap;
      }

      .service-introduce__tag-icon {
        color: #fff;
        padding-left: 8px;
        font-size: 12px !important;
      }
    }

    .service-introduce__en {
      font-size: 9px;
    }
  }
</style>
