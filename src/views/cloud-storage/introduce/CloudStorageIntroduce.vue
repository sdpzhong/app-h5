<template>
  <div class="cloud-stroage-introduce">
    <main>
      <div class="header-banner">
        <div class="header-banner__title">{{ $t('cloud-storage.introduce-title') }}</div>
        <div class="header-banner__options">
          <div class="display-option">
            <img src="/src/assets/images/introduce/option-1.png" alt="" />
            <div class="display-option__desc">{{ $t('cloud-storage.safe-save') }}</div>
          </div>
          <div class="display-option">
            <img src="/src/assets/images/introduce/option-2.png" alt="" />
            <div class="display-option__desc">{{ $t('cloud-storage.offline-watch') }}</div>
          </div>
          <div class="display-option">
            <img src="/src/assets/images/introduce/option-3.png" alt="" />
            <div class="display-option__desc">{{ $t('cloud-storage.video-encrpy') }}</div>
          </div>
          <div class="display-option">
            <img src="/src/assets/images/introduce/option-4.png" alt="" />
            <div class="display-option__desc">{{ $t('cloud-storage.speed-play') }}</div>
          </div>
        </div>
      </div>
      <div class="devices-card-section" v-if="!isFromBuyPage">
        <div class="top-card-header">
          <div class="top-card-header__label"
            ><img src="/src/assets/images/cloud-storage/icon-camera.png" alt="" />{{
              $t('traffic.support-device')
            }}</div
          >
          <div
            class="show-more van-haptics-feedback"
            v-if="deviceServiceInfoList.length > 1"
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
          <div class="device-service-cards" v-if="deviceServiceInfoList.length">
            <div
              class="device-service-card"
              :class="{
                unactive: firstRecord.serviceInfo?.state !== PackageStatus.ACTIVATED,
              }"
            >
              <div class="device-info">
                <div class="device-name row-text__ellipsis">{{
                  firstRecord.serviceInfo?.name ?? '_'
                }}</div>
                <div class="device-sn"
                  >DID: {{ firstRecord.sn }} <CopyTextButton :value="firstRecord.sn" is-tip
                /></div>
                <!-- <div class="device-iccid"
                >ICCID: {{ firstRecord.sn }} <CopyTextButton :value="firstRecord.sn" is-tip
              /></div> -->
                <div
                  class="service-time"
                  v-if="firstRecord.serviceInfo.state === PackageStatus.ACTIVATED"
                  >{{
                    $t('traffic.service-expire', [
                      dayjs(firstRecord.serviceInfo.expireTime).format('YYYY-MM-DD'),
                    ])
                  }}</div
                >
                <div
                  class="service-time"
                  v-if="firstRecord.serviceInfo.state === PackageStatus.NONACTIVATED"
                  >{{ $t('traffic.service-no-actived') }}</div
                >
                <div
                  class="service-time"
                  v-if="firstRecord.serviceInfo.state === PackageStatus.EXPIRED"
                  >{{ $t('traffic.expired') }}</div
                >
              </div>
              <div
                class="card-btn van-haptics-feedback"
                @click="handleToPurchasePage(firstRecord.sn)"
                >{{
                  firstRecord.serviceInfo.state === PackageStatus.NONACTIVATED
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
                    unactive: record.serviceInfo.state !== PackageStatus.ACTIVATED,
                  }"
                >
                  <div class="device-info">
                    <div class="device-name row-text__ellipsis">{{
                      record.serviceInfo.name ?? '_'
                    }}</div>
                    <div class="device-sn"
                      >DID: {{ record.sn }} <CopyTextButton :value="record.sn" is-tip
                    /></div>
                    <!-- <div class="device-iccid"
                >ICCID: {{ record.sn }} <CopyTextButton :value="record.sn" is-tip
              /></div> -->
                    <div
                      class="service-time"
                      v-if="record.serviceInfo.state === PackageStatus.ACTIVATED"
                      >{{
                        $t('traffic.service-expire', [
                          dayjs(record.serviceInfo.expireTime).format('YYYY-MM-DD'),
                        ])
                      }}</div
                    >
                    <div
                      class="service-time"
                      v-if="record.serviceInfo.state === PackageStatus.NONACTIVATED"
                      >{{ $t('traffic.service-no-actived') }}</div
                    >
                    <div
                      class="service-time"
                      v-if="record.serviceInfo.state === PackageStatus.EXPIRED"
                      >{{ $t('traffic.expired') }}</div
                    >
                  </div>
                  <div
                    class="card-btn van-haptics-feedback"
                    @click="handleToPurchasePage(record.sn)"
                    >{{
                      record.serviceInfo.state === PackageStatus.NONACTIVATED
                        ? $t('traffic.kai-tong')
                        : $t('traffic.xufei')
                    }}</div
                  >
                </div>
              </div>
            </div>
          </div>
          <div class="no-data" v-else> {{ $t('traffic.no-device') }} </div>
        </template>
      </div>

      <div
        style="
          padding-top: 0.6rem;
          padding-left: 0.7rem;
          padding-right: 0.7rem;
          font-family: font_two;
        "
      >
        <div class="row row-cols-1 row-cols-lg-1">
          <div class="col d-flex align-items-start">
            <div>
              <p style="font-size: 0.4103rem; font-family: font_one !important">{{
                $t('cloud-storage.safe-save')
              }}</p>
              <p style="padding-top: 0.1188rem; font-size: 0.3077rem">
                {{ $t('cloud-storage.introduce-page.card1-desc') }}</p
              >
              <div style="position: relative; padding-top: 0.4103rem">
                <div
                  style="
                    position: absolute;
                    z-index: 2;
                    left: 0.3675rem;
                    top: 1.0769rem;
                    color: aliceblue;
                    font-size: 0.3077rem;
                    width: 4rem;
                  "
                >
                  {{ $t('cloud-storage.introduce-page.card1-label') }}</div
                >
                <img
                  src="/src/assets/images/introduce/img1.png"
                  class="img-fluid"
                  height=".7095rem"
                  loading="lazy"
                />
              </div>
            </div>
          </div>

          <div class="col d-flex align-items-start" style="padding-top: 0.6rem">
            <div>
              <p style="font-size: 0.4103rem; font-family: font_one">{{
                $t('cloud-storage.offline-watch')
              }}</p>
              <p style="padding-top: 0.1rem; font-size: 0.3077rem">
                {{ $t('cloud-storage.introduce-page.card2-desc') }}</p
              >
              <div style="position: relative; padding-top: 0.4103rem">
                <div
                  style="
                    position: absolute;
                    z-index: 2;
                    left: 0.3675rem;
                    top: 1.0769rem;
                    font-size: 0.3077rem;
                    width: 4rem;
                  "
                >
                  {{ $t('cloud-storage.introduce-page.card2-label') }}</div
                >
                <img
                  src="/src/assets/images/introduce/img2.png"
                  class="img-fluid"
                  height=".7095rem"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
          <div class="col d-flex align-items-start" style="padding-top: 0.6rem">
            <div>
              <p style="font-size: 0.4103rem; font-family: font_one">{{
                $t('cloud-storage.video-encrpy')
              }}</p>
              <p style="padding-top: 0.1rem; font-size: 0.3077rem">
                {{ $t('cloud-storage.introduce-page.card3-desc') }}
              </p>
              <div style="position: relative; padding-top: 0.4103rem">
                <div
                  style="
                    position: absolute;
                    z-index: 2;
                    left: 0.3675rem;
                    top: 1.0769rem;
                    font-size: 0.3077rem;
                    width: 4rem;
                  "
                >
                  {{ $t('cloud-storage.introduce-page.card3-label') }}</div
                >
                <img
                  src="/src/assets/images/introduce/img3.png"
                  class="img-fluid"
                  height=".7095rem"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
          <div class="col d-flex align-items-start" style="padding-top: 0.6rem">
            <div>
              <p style="font-size: 0.4103rem; font-family: font_one">{{
                $t('cloud-storage.speed-play')
              }}</p>
              <p style="padding-top: 0.1rem; font-size: 0.3077rem">
                {{ $t('cloud-storage.introduce-page.card4-desc') }}</p
              >
              <div style="position: relative; padding-top: 0.4103rem">
                <div
                  style="
                    position: absolute;
                    z-index: 2;
                    left: 0.3675rem;
                    top: 1.0769rem;
                    font-size: 0.3077rem;
                    width: 4rem;
                  "
                >
                  {{ $t('cloud-storage.introduce-page.card4-label') }}</div
                >
                <img
                  src="/src/assets/images/introduce/img4.png"
                  class="img-fluid"
                  height=".7095rem"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style="padding-top: 0.8547rem">
        <img
          src="/src/assets/images/introduce/PK2.png"
          class="img-fluid"
          alt=""
          loading="lazy"
          width="100%"
          style="margin-bottom: 0.5rem"
        />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
  import { getAllDeviceCloudStorageServiceWithDeviceInfo } from '@/api/modules/iot-device';
  import '@/assets/css/introduce.min.css';
  import useLoading from '@/hooks/loading';
  import { PackageStatus } from '@/stores/modules/types/cloudStorage';
  import { SkuType } from '@/stores/modules/types/purchase';
  import { useToggle } from '@vant/use';
  import dayjs from 'dayjs';
  import { computed, ref } from 'vue';
  import { useRoute, useRouter } from 'vue-router';

  const router = useRouter();
  const route = useRoute();
  const isFromBuyPage = route.query?.['fromBuy'] === 'true';

  const [expandState, toggleExpandState] = useToggle(false);
  const { loading, setLoading } = useLoading();
  const deviceServiceInfoList = ref<CloudStorageServiceStrongInfo[]>([]);
  const firstRecord = computed(() => deviceServiceInfoList.value[0]);
  const expandRecords = computed(() => deviceServiceInfoList.value.slice(1));

  function handleToggle() {
    toggleExpandState();
    console.log('expandState: ', expandState.value);
  }

  async function requestDeviceServicenfoList() {
    setLoading(true);
    try {
      const res = await getAllDeviceCloudStorageServiceWithDeviceInfo();

      deviceServiceInfoList.value = res;
    } catch (error) {
      console.log('request device list fail: ', error);
    } finally {
      setLoading(false);
    }
  }

  if (!isFromBuyPage) {
    requestDeviceServicenfoList();
  }

  function handleToPurchasePage(sn: string) {
    // postMessage({
    //   method: 'appRouter',
    //   data: {
    //     page: 'OpenWeb',
    //     params: { url: `#/cloud-storage/new?sn=${sn}` },
    //   },
    // });
    router.replace({
      path: '/purchase',
      query: {
        skuType: SkuType.cs,
        sn: sn,
      },
    });
  }
</script>

<style scoped lang="less">
  // @font-face {
  //   font-family: 'font_one';
  //   src: url('/src/assets/fonts/HONORSansCN-Bold.ttf');
  // }

  // @font-face {
  //   font-family: 'font_two';
  //   src: url('/src/assets/fonts/HONORSansCN-Regular.ttf');
  // }

  // @font-face {
  //   font-family: 'font_three';
  //   src: url('/src/assets/fonts/HONORSansCN-Medium.ttf');
  // }

  @media (min-width: 768px) {
    .bd-placeholder-img-lg {
      font-size: 3.5rem;
    }
  }

  .cloud-stroage-introduce {
    height: 100vh;
    width: 100vw;
    overflow-x: hidden;
    overflow-y: auto;

    .header-banner {
      width: 100%;
      min-height: 226px;
      background: url('/src/assets/images/introduce/header-bg.png');
      background-position: center top;
      background-repeat: no-repeat;
      background-size: cover;
      display: flex;
      flex-direction: column;
      padding: 25px 19px;

      .header-banner__title {
        font-weight: bold;
        font-size: 14px;
        color: #ffffff;
        margin-bottom: 10px;
      }

      .header-banner__options {
        display: flex;
        flex-direction: column;
        .display-option {
          display: flex;
          align-items: center;
          > img {
            height: 26px;
            width: 26px;
            object-fit: contain;
            display: block;
            margin-right: 10px;
          }

          .display-option__desc {
            font-size: 12px;
            font-weight: 500;
            color: #fff;
            opacity: 0.6;
          }

          &:not(&:last-child) {
            margin-bottom: 10px;
          }
        }
      }
    }

    .bd-placeholder-img {
      font-size: 1.125rem;
      text-anchor: middle;
      -webkit-user-select: none;
      -moz-user-select: none;
      user-select: none;
    }

    .b-example-divider {
      height: 3rem;
      background-color: rgba(0, 0, 0, 0.1);
      border: solid rgba(0, 0, 0, 0.15);
      border-width: 1px 0;
      box-shadow: inset 0 0.5em 1.5em rgba(0, 0, 0, 0.1), inset 0 0.125em 0.5em rgba(0, 0, 0, 0.15);
    }

    .b-example-vr {
      flex-shrink: 0;
      width: 1.5rem;
      height: 100vh;
    }

    .bi {
      vertical-align: -0.125em;
      fill: currentColor;
    }

    .nav-scroller {
      position: relative;
      z-index: 2;
      height: 2.75rem;
      overflow-y: hidden;
    }

    .nav-scroller .nav {
      display: flex;
      flex-wrap: nowrap;
      padding-bottom: 1rem;
      margin-top: -1px;
      overflow-x: auto;
      text-align: center;
      white-space: nowrap;
      -webkit-overflow-scrolling: touch;
    }

    .header-bg {
      background: url('/src/assets/images/introduce/header.png');
    }

    p {
      padding-bottom: 0 !important;
      margin-bottom: 0;
    }

    .div-con {
      /* width: 1.0667rem;  */
      border: 0px;
      /* background-size: contain; */
    }

    .div-con img {
      height: 0.8rem;
      object-fit: contain;
      width: 100%;
    }
  }

  .devices-card-section {
    padding: 19px 29px 0;
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
      // padding: 24px 0 38px;
      min-height: 118px;
      margin-bottom: 6px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .device-service-cards {
      display: flex;
      flex-direction: column;
      padding: 6px 0 0 0;

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
        // background: linear-gradient(90deg, #368cff 0%, #45c7ff 100%);
        background: url('/src/assets/images/cs-introduce-banner.png');
        background-repeat: no-repeat;
        background-size: cover;
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
          // background: #247cff;
          background: #ff9500;
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
          // background: #abadb1;
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
</style>
