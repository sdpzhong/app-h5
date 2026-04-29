<template>
  <div class="traffic-service-card">
    <div class="device-name">{{ simpleDeviceInfo?.name ?? '_' }}</div>
    <div class="device-sn" v-if="simpleDeviceInfo?.sn"
      >DID: {{ simpleDeviceInfo?.sn ?? ''
      }}<CopyTextButton
        style="flex-shrink: 0; margin-left: 4px"
        :value="simpleDeviceInfo?.sn"
        is-tip
    /></div>
    <div class="option-cell" v-if="simpleDeviceInfo">
      <div class="option-cell__left">{{ $t('gsmdata.esim-state-text') }}</div>
      <div
        class="option-cell__right"
        :class="{
          active: simpleDeviceInfo?.simState === SimStatusEnum.actived,
        }"
        >{{ renderSimStateText(simpleDeviceInfo?.simState) }}</div
      >
    </div>
    <!--  v-if="isUseEsim && currentOperator" -->
    <div class="option-cell" @click="toGuidPage">
      <div class="option-cell__left">{{ $t('gsmdata.net-operator') }}</div>
      <div class="option-cell__right">
        <!-- <img src="/src/assets/images/4g/AT&T.png" alt="" /> -->
        <img
          :src="currentOperator?.operatorIconUrl"
          alt=""
          v-if="currentOperator?.operatorIconUrl"
        />
        <div v-else>{{ currentOperator?.operatorName ?? $t('gsmdata.no') }}</div>
      </div>
      <img src="/src/assets/images/right-arrow.png" alt="" />
    </div>
    <!-- v-if="serviceInfo && serviceInfo.list?.length" -->
    <div class="pacakge-service-cell" v-if="serviceInfo" @click="toTrafficIntroducePage">
      <img src="/src/assets/images/4g.png" alt="" />
      <div class="package-state-info">
        <div class="package-name-cell">
          <div class="package-name">{{ $t('gsmdata.4g-pkg') }}</div>
          <div
            class="package-state__tag"
            :class="{
              invalid: serviceInfo?.state !== PackageStatus.ACTIVATED,
            }"
          >
            {{
              currentLocale === 'zh-CN'
                ? CsServiceStateTexpMap[serviceInfo!.state]
                : CsServiceStateEnTexpMap[serviceInfo!.state]
            }}
          </div>
          <img src="/src/assets/images/right-arrow.png" alt="" />
        </div>
        <div class="package-exp" v-if="serviceInfo.expireTime">
          {{ $t('cloud-storage.exp', [dayjs(serviceInfo.expireTime).format('YYYY/MM/DD')]) }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import dayjs from 'dayjs';
  import { storeToRefs } from 'pinia';
  import { useTrafficSetting } from '@/stores/modules/trafficSetting';
  import { SimStatusEnum, SimType } from '../../types/4g-page';
  import { useI18n } from 'vue-i18n';
  import { PackageStatus } from '@/stores/modules/types/cloudStorage';
  import { useRouter } from 'vue-router';
  import useLocale from '@/hooks/useLocale';
  import {
    CsServiceStateEnTexpMap,
    CsServiceStateTexpMap,
  } from '@/views/cloud-storage/setting/common';
  import { showToast } from 'vant';

  const { t } = useI18n();
  const { currentLocale } = useLocale();
  const router = useRouter();

  const { simpleDeviceInfo, sn, serviceInfo, currentOperator } = storeToRefs(useTrafficSetting());

  // const isUseEsim = computed(() => simpleDeviceInfo.value?.simType === SimType.esim);

  // const lastPackageServiceInfo = computed<PackageInfoItem>(() => {
  //   const packageList = serviceInfo.value?.list ?? [];
  //   return (packageList.length ? packageList[packageList.length - 1] : {}) as PackageInfoItem;
  // });

  function toTrafficIntroducePage() {
    router.push({
      path: '/gsmdata/record',
      query: {
        sn: sn.value,
      },
    });
  }

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

  function toGuidPage() {
    // 判断是否是设备拥有者
    if (!simpleDeviceInfo.value?.owner) {
      showToast(t('gsmdata.opt-support-tip'));
      return;
    }
    if (simpleDeviceInfo.value.simType !== SimType.esim) {
      showToast(t('gsmdata.opt-support-tip-2'));
      return;
    }
    // if (![SimStatusEnum.actived, SimStatusEnum.inuse].includes(simpleDeviceInfo.value?.simState)) {
    //   showToast(t('gsmdata.opt-support-tip-1'));
    //   return;
    // }
    router.push({
      path: '/gsmdata/operator-switch/guid',
      query: {
        sn: sn.value,
      },
    });
  }
</script>

<style scoped lang="less">
  .traffic-service-card {
    display: flex;
    flex-direction: column;
    overflow: hidden;
    background-color: #fff;
    padding: 13px;
    border-radius: 8px;
    margin-bottom: 6px;

    .device-name {
      font-weight: 500;
      font-size: 14px;
      color: #232323;
      margin-bottom: 16px;
    }

    .device-sn {
      font-weight: 400;
      font-size: 11px;
      color: #232323;
      margin-bottom: 12px;
    }

    .option-cell {
      padding: 8px 0;
      display: flex;
      align-items: center;
      font-weight: 400;
      font-size: 11px;

      .option-cell__left {
        color: #8f8f8f;
      }

      .option-cell__right {
        flex: 1;
        text-align: right;
        display: flex;
        justify-content: flex-end;
        color: #8f8f8f;

        > img {
          display: block;
          height: 32px;
          width: 96px;
          object-fit: contain;
        }

        &.active {
          color: #247cff;
        }
      }

      img {
        display: block;
        width: 13px;
        height: 13px;
        object-fit: contain;
      }
    }

    .pacakge-service-cell {
      display: flex;
      align-items: center;
      background: linear-gradient(180deg, #fff, rgba(36, 255, 178, 0.1));
      border-radius: 5px 5px 5px 5px;
      padding: 16px 13px;
      > img {
        display: block;
        height: 35px;
        width: 35px;
        object-fit: contain;
        margin-right: 6px;
      }

      .package-state-info {
        flex: 1;
        display: flex;
        flex-direction: column;

        .package-name-cell {
          display: flex;
          align-items: center;
          width: 100%;

          .package-name {
            flex: 1;
            font-weight: 400;
            font-size: 13px;
            color: #232323;
            margin-bottom: 2px;
          }

          .package-state {
            display: flex;
            align-items: start;
            justify-content: center;
            flex-shrink: 0;
          }

          > img {
            width: 13px;
            height: 13px;
            display: block;
            object-fit: contain;
          }

          .package-state__tag {
            font-weight: 400;
            font-size: 11px;
            color: #247cff;
            text-align: right;
            margin-right: 4px;

            &.invalid {
              color: #8f8f8f !important;
            }
          }

          ::v-deep(.copy-text-button) {
            font-size: 1.2em;
          }
        }
      }

      .package-exp {
        font-weight: 400;
        font-size: 11px;
        color: #8f8f8f;
      }
    }
  }
</style>
