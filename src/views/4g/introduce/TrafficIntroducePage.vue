<template>
  <div class="van-safe-area-bottom">
    <div
      class="traffic-introduce"
      :class="{
        'is-not-chinese': !isChinese,
      }"
    >
      <div class="traffic-introduce-top-card" v-if="!isFromBuyPage">
        <div class="top-card-header">
          <div class="top-card-header__label"
            ><img src="/src/assets/images/cloud-storage/icon-camera.png" alt="" />{{
              $t('traffic.support-device')
            }}</div
          >
          <div
            class="show-more van-haptics-feedback"
            v-if="records.length > 1"
            @click="handleToggle"
            >{{ $t('traffic.expend-more')
            }}<img
              src="/src/assets/images/cloud-storage/icon-expand-arrow.png"
              :class="{
                'show-more__expand': expandState,
              }"
              alt=""
          /></div>
        </div>

        <div class="loading-box" v-if="loading">
          <van-loading v-model="loading" type="spinner" size="0.4267rem" />
        </div>

        <template v-else>
          <div class="device-service-cards" v-if="records.length">
            <div
              class="device-service-card"
              :class="{
                unactive: firstRecord.state !== PackageStatus.ACTIVATED,
              }"
            >
              <div class="device-info">
                <div class="device-name row-text__ellipsis">{{ firstRecord.name ?? '_' }}</div>
                <div class="device-sn"
                  >DID: {{ firstRecord.sn }} <CopyTextButton :value="firstRecord.sn" is-tip
                /></div>
                <!-- <div class="device-iccid"
                >ICCID: {{ firstRecord.sn }} <CopyTextButton :value="firstRecord.sn" is-tip
              /></div> -->
                <div class="service-time" v-if="firstRecord.state === PackageStatus.ACTIVATED">{{
                  $t('traffic.service-expire', [dayjs(firstRecord.expireTime).format('YYYY-MM-DD')])
                }}</div>
                <div class="service-time" v-if="firstRecord.state === PackageStatus.NONACTIVATED">{{
                  $t('traffic.service-no-actived')
                }}</div>
                <div class="service-time" v-if="firstRecord.state === PackageStatus.EXPIRED">{{
                  $t('traffic.expired')
                }}</div>
              </div>
              <div
                class="card-btn van-haptics-feedback"
                @click="handleToPurchasePage(firstRecord)"
                >{{
                  firstRecord.state === PackageStatus.NONACTIVATED
                    ? $t('traffic.kai-tong')
                    : $t('traffic.xufei')
                }}</div
              >
            </div>
            <div
              class="show-more__section"
              :class="{
                expand: expandState,
              }"
            >
              <div class="show-more-device-cards">
                <div
                  v-for="record of expandRecords"
                  :key="record.sn"
                  class="device-service-card"
                  :class="{
                    unactive: record.state !== PackageStatus.ACTIVATED,
                  }"
                >
                  <div class="device-info">
                    <div class="device-name row-text__ellipsis">{{ record.name ?? '_' }}</div>
                    <div class="device-sn"
                      >DID: {{ record.sn }} <CopyTextButton :value="record.sn" is-tip
                    /></div>
                    <!-- <div class="device-iccid"
                >ICCID: {{ record.sn }} <CopyTextButton :value="record.sn" is-tip
              /></div> -->
                    <div class="service-time" v-if="record.state === PackageStatus.ACTIVATED">{{
                      $t('traffic.service-expire', [dayjs(record.expireTime).format('YYYY-MM-DD')])
                    }}</div>
                    <div class="service-time" v-if="record.state === PackageStatus.NONACTIVATED">{{
                      $t('traffic.service-no-actived')
                    }}</div>
                    <div class="service-time" v-if="record.state === PackageStatus.EXPIRED">{{
                      $t('traffic.expired')
                    }}</div>
                  </div>
                  <div
                    class="card-btn van-haptics-feedback"
                    @click="handleToPurchasePage(record)"
                    >{{
                      record.state === PackageStatus.NONACTIVATED
                        ? $t('traffic.kai-tong')
                        : $t('traffic.xufei')
                    }}</div
                  >
                </div>
              </div>
            </div>
          </div>
          <div class="no-data" v-else> {{ $t('traffic.no-device') }} </div>
          <div class="top-card__divider"
            ><img src="/src/assets/images/cloud-storage/divider-left.png" alt="" />{{
              $t('traffic.4g-setting-divider-text')
            }}
            <img src="/src/assets/images/cloud-storage/divider-right.png" alt="" />
          </div>
        </template>

        <div class="top-card-footer">
          <div class="top-card-footer__grid">
            <img src="/src/assets/images/cloud-storage/icon-wifi.png" alt="" class="grid__icon" />
            <div class="grid__label">{{ $t('traffic.4g-setting-grid-1') }}</div>
          </div>
          <div class="top-card-footer__grid">
            <img src="/src/assets/images/cloud-storage/icon-out.png" alt="" class="grid__icon" />
            <div class="grid__label">{{ $t('traffic.4g-setting-grid-2') }}</div>
          </div>
          <div class="top-card-footer__grid">
            <img src="/src/assets/images/cloud-storage/icon-speed.png" alt="" class="grid__icon" />
            <div class="grid__label">{{ $t('traffic.4g-setting-grid-3') }}</div>
          </div>
          <div class="top-card-footer__grid">
            <img
              src="/src/assets/images/cloud-storage/icon-data-safe.png"
              alt=""
              class="grid__icon"
            />
            <div class="grid__label">{{ $t('traffic.4g-setting-grid-4') }}</div>
          </div>
        </div>
      </div>

      <div class="introduce-cards">
        <div class="introduce-card">
          <img :src="isChinese ? adImage1 : adImageEn1" alt="" class="introduce-card__img" />
          <div class="introduce-card__desc">
            <div class="desc__title">{{ $t('traffic.introduce-title-1') }}</div>
            <div class="desc__content">{{ $t('traffic.introduce-content-1') }}</div>
          </div>
        </div>
        <div class="introduce-card">
          <img :src="isChinese ? adImage2 : adImageEn2" alt="" class="introduce-card__img" />
          <div class="introduce-card__desc">
            <div class="desc__title">{{ $t('traffic.introduce-title-2') }}</div>
            <div class="desc__content">{{ $t('traffic.introduce-content-2') }}</div>
          </div>
        </div>
        <div class="introduce-card">
          <img :src="isChinese ? adImage3 : adImageEn3" alt="" class="introduce-card__img" />
          <div class="introduce-card__desc">
            <div class="desc__title">{{ $t('traffic.introduce-title-3') }}</div>
            <div class="desc__content">{{ $t('traffic.introduce-content-3') }}</div>
          </div>
        </div>
        <div class="introduce-card">
          <img :src="isChinese ? adImage4 : adImageEn4" alt="" class="introduce-card__img" />
          <div class="introduce-card__desc">
            <div class="desc__title">{{ $t('traffic.introduce-title-4') }}</div>
            <div class="desc__content">{{ $t('traffic.introduce-conent-4') }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { getAllGsmDeviceTrafficServiceStatus } from '@/api/modules/iot-device';
  import useLoading from '@/hooks/loading';
  import { useToggle } from '@vant/use';
  import { ref, computed } from 'vue';
  import dayjs from 'dayjs';
  import { PackageStatus } from '@/stores/modules/types/cloudStorage';
  import useLocale from '@/hooks/useLocale';
  import adImage1 from '@/assets/images/cloud-storage/4g-ad-1.png';
  import adImage2 from '@/assets/images/cloud-storage/4g-ad-2.png';
  import adImage3 from '@/assets/images/cloud-storage/4g-ad-3.png';
  import adImage4 from '@/assets/images/cloud-storage/4g-ad-4.png';
  import adImageEn1 from '@/assets/images/cloud-storage/4g-ad-1-en.png';
  import adImageEn2 from '@/assets/images/cloud-storage/4g-ad-2-en.png';
  import adImageEn3 from '@/assets/images/cloud-storage/4g-ad-3-en.png';
  import adImageEn4 from '@/assets/images/cloud-storage/4g-ad-4-en.png';
  import { useRoute, useRouter } from 'vue-router';
  import { SkuType } from '@/stores/modules/types/purchase';

  const router = useRouter();
  const route = useRoute();
  const isFromBuyPage = route.query?.['fromBuy'] === 'true';

  const { currentLocale } = useLocale();
  const isChinese = computed(() => currentLocale.value === 'zh-CN');

  const [expandState, toggleExpandState] = useToggle(false);

  function handleToggle() {
    toggleExpandState();
    console.log('expandState: ', expandState.value);
  }

  const records = ref<TrafficPackageServiceStatusInfo[]>([]);
  const firstRecord = computed(() => records.value[0]);
  const expandRecords = computed(() => records.value.slice(1));

  const { loading, setLoading } = useLoading();
  async function requestAllDeviceTrafficaServiceStatus() {
    setLoading(true);
    try {
      records.value = await getAllGsmDeviceTrafficServiceStatus();
      console.log('requestAllDeviceTrafficaServiceStatus: ', records.value);
    } catch (error) {
      console.log('requestAllDeviceTrafficaServiceStatus: ', error);
    } finally {
      setLoading(false);
    }
  }

  if (!isFromBuyPage) {
    requestAllDeviceTrafficaServiceStatus();
  }

  function handleToPurchasePage(device: TrafficPackageServiceStatusInfo) {
    // 判断是否外置卡，外置卡用户弹窗提示无法激活
    // if (device.simType !== SimType.esim) {
    //   showToast(t('gsmdata.esim-state.disabled-toast'));
    //   return;
    // }
    // postMessage({
    //   method: 'appRouter',
    //   data: {
    //     page: 'OpenWeb',
    //     params: { url: `#/gsmdata?sn=${device.sn}` },
    //   },
    // });
    router.replace({
      path: '/purchase',
      query: {
        skuType: SkuType.gsmdata,
        sn: device.sn,
      },
    });
  }
</script>

<style scoped lang="less">
  .traffic-introduce {
    background-image: url('/src/assets/images/cloud-storage/4g-introduce-banner.png');
    background-position: center top;
    background-repeat: no-repeat;
    background-size: contain;
    padding-top: 202px;
    display: flex;
    flex-direction: column;

    &.is-not-chinese {
      background-image: url('/src/assets/images/cloud-storage/4g-introduce-banner-en.png');

      .desc__title {
        font-size: 16px !important;
        line-height: 19px !important;
      }

      .desc__content {
        font-size: 8px !important;
      }
    }

    .traffic-introduce-top-card {
      padding: 19px 29px;
      background: linear-gradient(180deg, #ffffff 0%, #f0f8ff 100%);
      border-radius: 26px;
      display: flex;
      flex-direction: column;

      .top-card-header {
        display: flex;
        align-items: center;
        justify-content: space-between;

        > div {
          display: flex;
          align-items: center;
          font-weight: 400;
          font-size: 12px;
          color: #4a4c3e;
          line-height: 16px;
          text-align: center;
          font-style: normal;
          text-transform: none;

          > img {
            display: block;
            width: 16px;
            height: 16px;
            object-fit: contain;
            margin-right: 2px;
          }
        }

        .show-more {
          color: #aaa;
          // opacity: 0.5;

          > img {
            transition: 250ms transform;
          }

          .show-more__expand {
            transform: rotate(180deg);
          }
        }
      }

      .no-data {
        padding: 24px 0 38px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 400;
        font-size: 13px;
        color: #8f8f8f;
        line-height: 16px;
        text-align: center;
        font-style: normal;
        text-transform: none;
      }

      .loading-box {
        padding: 24px 0 38px;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .device-service-cards {
        display: flex;
        flex-direction: column;
        padding: 6px 0 29px;

        .show-more__section {
          display: grid;
          grid-template-rows: 0fr;
          transition: 250ms all ease-out;
          overflow: hidden;
          opacity: 0;

          &.expand {
            grid-template-rows: 1fr;
            opacity: 1;
          }

          .show-more-device-cards {
            display: flex;
            flex-direction: column;
            overflow: hidden;
          }
        }

        .device-service-card {
          min-height: 110px;
          background: linear-gradient(90deg, #368cff 0%, #45c7ff 100%);
          border-radius: 10px;
          padding: 16px;
          display: flex;
          align-items: center;

          .device-info {
            flex: 1;
            flex-shrink: 0;
            overflow: hidden;

            .device-name,
            .service-time {
              font-weight: 400;
              font-size: 12px;
              color: #ffffff;
              // line-height: 14px;
              text-align: left;
              font-style: normal;
              text-transform: none;
            }

            .device-name {
              margin-bottom: 2px;
            }

            .device-sn,
            .device-iccid {
              font-size: 11px;
              color: #ffffff;
              // line-height: 12px;
              text-align: left;
              font-style: normal;
              text-transform: none;
              opacity: 0.5;
            }

            .service-time {
              margin-top: 10px;
            }
          }

          .card-btn {
            height: 32px;
            flex-shrink: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 0 16px;
            background: #01df94;
            font-weight: 400;
            font-size: 13px;
            color: #ffffff;
            line-height: 16px;
            font-style: normal;
            text-transform: none;
            border-radius: 16px;
            margin-left: 8px;
          }

          &.unactive {
            background: linear-gradient(90deg, #919ba3 0%, #bfc5cc 100%);
          }

          &:not(&:last-child) {
            margin-bottom: 6px;
          }
        }
      }

      .top-card__divider {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-wrap: nowrap;
        height: 20px;
        margin-bottom: 19px;
        font-weight: 400;
        font-size: 13px;
        color: #266e97;
        line-height: 16px;
        text-align: center;
        font-style: normal;
        text-transform: none;

        > img {
          width: 64px;
          object-fit: contain;
        }
      }

      .top-card-footer {
        display: flex;
        justify-content: start;

        .top-card-footer__grid {
          flex: 0 0 25%;
          display: flex;
          flex-direction: column;
          align-items: center;

          .grid__icon {
            height: 38px;
            width: 38px;
            object-fit: contain;
            background: #e0f2ff;
            border-radius: 19px;
            margin-bottom: 6px;
            flex-shrink: 0;
          }

          .grid__label {
            font-weight: 400;
            font-size: 11px;
            color: #8a96a5;
            line-height: 12px;
            text-align: center;
            font-style: normal;
            text-transform: none;
            flex-shrink: 0;
          }
        }
      }
    }

    .introduce-cards {
      display: flex;
      flex-direction: column;

      .introduce-card {
        display: flex;
        overflow: hidden;
        padding: 38px 19px;

        &:nth-child(odd) {
          flex-direction: row;

          .introduce-card__img {
            margin-right: 10px;
          }
        }

        &:nth-child(even) {
          flex-direction: row-reverse;
          background: linear-gradient(180deg, #f6f9f8 0%, #eef9fa 100%);
          .introduce-card__img {
            margin-left: 10px;
          }
        }

        .introduce-card__img {
          width: 192px;
          object-fit: contain;
          flex-shrink: 0;
          border-radius: 10px;
          overflow: hidden;
        }

        .introduce-card__desc {
          flex: 1;
          flex-shrink: 0;
          display: flex;
          flex-direction: column;
          padding: 6px 0;
          overflow: hidden;

          .desc__title {
            font-weight: bold;
            font-size: 19px;
            color: #2c2b23;
            line-height: 23px;
            font-style: normal;
            text-transform: none;
            margin-bottom: 10px;
          }

          .desc__content {
            font-weight: 500;
            font-size: 9px;
            color: #8f8f8f;
            // line-height: 11px;
            font-style: normal;
            text-transform: none;
            word-break: break-word;
            // word-wrap: break-word;
          }
        }
      }
    }
  }
</style>
