<template>
  <div class="device-info-section">
    <van-image
      class="flex-left-area"
      width="1.7067rem"
      height="1.7067rem"
      fit="contain"
      block
      :src="simpleDeviceInfo?.pictureUrl"
    >
      <template v-slot:loading>
        <van-loading type="spinner" size="0.4267rem" />
      </template>
    </van-image>
    <div class="flex-right-area">
      <div class="device-info-area">
        <div class="device-info-area__header">
          <div class="device-name row-text__ellipsis">
            {{ simpleDeviceInfo?.name ?? $t('cloud-storage.defult-device-name') }}
          </div>
          <!-- ([SimType.esim,SimType.sim] as any[]).includes(simpleDeviceInfo?.simType) -->
          <div
            class="device-esim-status"
            v-if="simpleDeviceInfo?.simType !== undefined"
            :class="{
              active: isUseEsim,
            }"
            >{{ isUseEsim ? $t('traffic.use-esim') : $t('traffic.use-sim')
            }}<div
              class="device-esim-status__dot"
              :class="{
                active: isUseEsim,
              }"
            ></div>
          </div>
        </div>
      </div>
      <div class="device-info-area__footer">
        <div class="sn__desc" v-if="simpleDeviceInfo?.sn">
          DID: {{ simpleDeviceInfo?.sn ?? '' }}
          <CopyTextButton style="flex-shrink: 0; margin-left: 4px" :value="sn" is-tip />
        </div>
        <div
          class="esim-state"
          :class="{
            active: simpleDeviceInfo?.simState === SimStatusEnum.actived,
          }"
          v-if="simpleDeviceInfo"
          >{{ renderSimStateText(simpleDeviceInfo?.simState) }}</div
        >
      </div>
    </div>
  </div>
  <div class="esim-use-tip" v-if="!isUseEsim"
    ><img src="/src/assets/images/warning-icon.png" alt="" />{{
      $t('traffic.suggest-use-esim')
    }}</div
  >
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';
  import { useTrafficSetting } from '@/stores/modules/trafficSetting';
  import { computed } from 'vue';
  import { SimStatusEnum, SimType } from '../types/4g-page';
  import { useI18n } from 'vue-i18n';

  const { t } = useI18n();

  const { simpleDeviceInfo, sn } = storeToRefs(useTrafficSetting());

  const isUseEsim = computed(() => simpleDeviceInfo.value?.simType === SimType.esim);

  function renderSimStateText(simState: any) {
    switch (simState) {
      case SimStatusEnum.unactived:
        return t('gsmdata.esim-state.unactived');
      case SimStatusEnum.actived:
        return t('gsmdata.esim-state.actived');
      case SimStatusEnum.inuse:
        return t('gsmdata.esim-state.inuse');
      case SimStatusEnum.recycled:
        return t('gsmdata.esim-state.recycled');
      default:
        return '';
    }
  }
</script>

<style scoped lang="less">
  .device-info-section {
    display: flex;
    margin-bottom: 22px;

    .flex-left-area {
      flex-shrink: 0;
      width: 64px;
      height: 64px;
      object-fit: contain;
    }

    .flex-right-area {
      flex: auto;
      display: flex;
      flex-direction: column;
      justify-content: center;
      overflow: hidden;
      margin-left: 6px;

      .device-info-area {
        display: flex;
        align-items: center;
        flex-shrink: 1;
        margin-bottom: 6px;

        .device-info-area__header {
          width: 100%;
          display: flex;
          .device-name {
            flex: 1;
            flex-shrink: 0;
            font-size: 15px;
            font-weight: 500;
            color: #000;
            width: 0;
          }

          .device-esim-status {
            display: flex;
            align-items: center;
            .device-esim-status__dot {
              width: 6px;
              height: 6px;
              border-radius: 3px;
              background-color: #76bdff;
              margin-left: 4px;

              &.active {
                background-color: #49e8a5;
              }
            }

            &.active {
              .device-esim-status__dot {
                background-color: #76bdff;
              }
            }
          }
        }
      }

      .device-info-area__footer {
        width: 100%;
        display: flex;
        align-items: center;

        .sn__desc {
          // width: 100%;
          color: #686868;
          font-size: 11px;
          flex-shrink: 0;
        }

        .esim-state {
          flex: 1;
          font-weight: 400;
          font-size: 9px;
          color: #8f8f8f;
          line-height: 11px;
          text-align: right;
          font-style: normal;
          text-transform: none;

          &.active {
            color: #247cff;
          }
        }
      }
    }
  }

  .esim-use-tip {
    margin-bottom: 20px;
    font-weight: 400;
    font-size: 9px;
    color: #8f8f8f;
    line-height: 11px;
    font-style: normal;
    > img {
      height: 12px;
      width: 12px;
      object-fit: contain;
      vertical-align: bottom;
      margin-right: 2px;
    }
  }

  ::v-deep(.van-image__loading) {
    background-color: transparent;
  }
</style>
