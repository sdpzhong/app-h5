<template>
  <div class="package-service-card">
    <div class="device-name row-text__ellipsis">
      {{
        simpleDeviceInfo?.name ?? simpleDeviceInfo?.sn ?? $t('cloud-storage.defult-device-name')
      }}</div
    >
    <div class="device-sn" v-if="simpleDeviceInfo?.sn"
      >DID: {{ simpleDeviceInfo?.sn ?? ''
      }}<CopyTextButton style="flex-shrink: 0; margin-left: 4px" :value="sn" is-tip
    /></div>
    <div class="cloud-stroage-state-cell" v-if="simpleDeviceInfo?.owner && isEffected">
      <div class="left-section">
        <div class="left-section__title">{{ $t('cloud-storage.cs-switcher') }}</div>
        <div class="left-section__desc">{{ $t('cloud-storage.state-close-tip') }}</div>
      </div>
      <div class="right-section">
        <van-switch
          :model-value="cloudStorageState"
          :loading="changeLoading"
          :disabled="isShareDevice"
          @update:model-value="onUpdateValue"
          size="0.48rem"
        />
      </div>
    </div>
    <div class="pacakge-service-cell" v-if="deviceServiceInfo" @click="toRecordPage">
      <img src="/src/assets/images/yun.png" alt="" />
      <div class="package-state-info">
        <div class="package-name-cell">
          <div class="package-name">{{ $t('cloud-storage.cs-service') }}</div>
          <div
            class="package-state__tag"
            :class="{
              invalid: deviceServiceInfo.state !== PackageStatus.ACTIVATED,
            }"
          >
            {{
              currentLocale === 'zh-CN'
                ? CsServiceStateTexpMap[deviceServiceInfo.state]
                : CsServiceStateEnTexpMap[deviceServiceInfo.state]
            }}</div
          >
          <img src="/src/assets/images/right-arrow.png" alt="" />
        </div>
        <div class="package-exp" v-if="deviceServiceInfo.expireTime">
          {{ $t('cloud-storage.exp', [dayjs(deviceServiceInfo.expireTime).format('YYYY/MM/DD')]) }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  // import { delayFunction } from '@/utils/delay';
  import { computed, onUnmounted, ref } from 'vue';
  import { useMethodChannelStore } from '@/stores';
  import { useRoute, useRouter } from 'vue-router';
  // import { showFailToast } from 'vant';
  import { getSimpleDeviceInfo, getUserDeviceList } from '@/api/modules/iot-device';
  import { debounce } from 'lodash-es';
  import useLocale from '@/hooks/useLocale';
  import { CsServiceStateEnTexpMap, CsServiceStateTexpMap } from '../common';
  import dayjs from 'dayjs';
  import { PackageStatus } from '@/stores/modules/types/cloudStorage';
  import { useEventListener } from '@vant/use';
  // import { useI18n } from 'vue-i18n';

  defineProps({
    isEffected: {
      type: Boolean,
      default: false,
    },
    deviceServiceInfo: {
      type: Object as PropType<PackageStatusInfo>,
    },
  });

  const router = useRouter();

  const { currentLocale } = useLocale();

  // const lastPackageServiceInfo = computed<PackageInfoItem>(() => {
  //   const packageList = props.deviceServiceInfo?.list ?? [];
  //   return (packageList.length ? packageList[packageList.length - 1] : {}) as PackageInfoItem;
  // });

  // == lifecyle
  onUnmounted(function () {
    clearTimeout(timer);
    timer = null;
  });

  // =======

  // const { t } = useI18n();

  const route = useRoute();
  const sn = (route.query['sn'] ?? '') as string;

  const { postMessage, acceptMessage } = useMethodChannelStore();

  const cloudStorageState = ref(false);
  const changeLoading = ref(false);
  let timer: any;
  const simpleDeviceInfo = ref<SimpleDeviceInfo>();
  const deviceList = ref<UserDeviceInfo[]>([]);
  const isShareDevice = computed(() => !!deviceList.value.find((e) => e.sn === sn)?.shareId);

  async function requestSimpleDeviceInfo() {
    try {
      simpleDeviceInfo.value = await getSimpleDeviceInfo({
        sn: sn ?? '',
      });
    } catch (error) {
      console.log('requestSimpleDeviceInfo fail:', error);
    }
  }

  requestSimpleDeviceInfo();

  async function requestUserDeviceList() {
    try {
      const data = await getUserDeviceList();

      deviceList.value = data;
      console.log('requestUserDeviceList: ', data);
    } catch (error) {
      console.log('requestUserDeviceList fail:', error);
    }
  }

  requestUserDeviceList();

  const onUpdateValue = debounce((value: boolean) => {
    changeLoading.value = true;
    postMessage({
      method: 'setDeviceSetting',
      data: {
        sn,
        params: {
          CloudStorageStatus: ~~value,
        },
      },
    });
  }, 300);

  useEventListener('visibilitychange', (_e) => {
    if (document.visibilityState === 'visible') {
      requestSimpleDeviceInfo();
    }
  });

  acceptMessage(function (message) {
    console.log('!!acceptMessage:', message);
    switch (message.method) {
      case 'setDeviceSetting':
        changeLoading.value = false;

        // https://www.tapd.cn/47505024/markdown_wikis/show/?qy_private_corpid=#1147505024001000304
        // data: {“status”:1,“message”:“xxxx”}// bool status 1.成功 2.失败
        if (message.data['status'] === 1) {
          cloudStorageState.value = !cloudStorageState.value;
        }
        // else {
        //   showFailToast({
        //     message: t('cloud-storage.state-change-fail'),
        //   });
        // }

        break;
      case 'getDeviceSetting':
        changeLoading.value = false;
        cloudStorageState.value = !!Number(message.data['CloudStorageStatus']);
        break;

      default:
        break;
    }
  });

  // 初始获取云录像状态物模型数据
  function getCloudStorageStatus() {
    const sn = route.query['sn'];
    postMessage({
      method: 'getDeviceSetting',
      data: {
        sn,
        id: 'CloudStorageStatus',
      },
    });
    changeLoading.value = true;
    clearTimeout(timer);
    timer = setTimeout(function () {
      if (changeLoading.value) {
        changeLoading.value = false;
      }
    }, 3000);
  }
  getCloudStorageStatus();

  function toRecordPage() {
    const sn = router.currentRoute.value.query['sn'] ?? '';
    router.push({
      path: '/cloud-storage/record',
      query: {
        sn,
      },
    });
  }
</script>

<style scoped lang="less">
  // ::v-deep(.van-switch--on) {
  //   // background: linear-gradient(to bottom, #000, #646464 75%, #000);
  //   background: black url('/src/assets/images/cloud_storage_card.png') repeat;
  //   background-size: cover;

  //   .van-switch__node {
  //     background: linear-gradient(to right, #fff, #d2b987);
  //   }
  // }

  ::v-deep(.van-image__loading) {
    background-color: transparent;
  }

  .package-service-card {
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

    .cloud-stroage-state-cell {
      display: flex;
      align-items: center;
      margin-bottom: 4px;
      .left-section {
        flex: 1;
        flex-shrink: 0;
        margin-right: 4px;
        .left-section__title {
          font-weight: 400;
          font-size: 12px;
          color: #232323;
        }

        .left-section__desc {
          font-weight: 400;
          font-size: 9px;
          color: #8f8f8f;
        }
      }
    }

    .pacakge-service-cell {
      display: flex;
      align-items: center;
      background: linear-gradient(180deg, #fff, rgba(36, 124, 255, 0.1));
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
