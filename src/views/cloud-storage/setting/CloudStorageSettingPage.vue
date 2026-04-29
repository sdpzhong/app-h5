<template>
  <div class="cloud-stroage-setting van-safe-area-bottom">
    <!-- <van-nav-bar safe-area-inset-top :border="false">
      <template #title>
        <span class="layout-header-title"> 云服务设置 </span>
      </template>
      <template #left>
        <van-icon name="arrow-left" color="#000" size="0.5rem" @click="$router.back()" />
      </template>
      <template #right> </template>
    </van-nav-bar> -->
    <div class="main-content">
      <!-- <van-notice-bar left-icon="info-o" mode="link" wrapable :scrollable="false">
        eSim服务未激活，前往 <a href="/" style="color: var(--van-text-color)">开启</a>
      </van-notice-bar> -->
      <div class="mian-content-wapper">
        <cloud-stroage-state-switcher
          :is-effected="deviceServiceInfo?.state === PackageStatus.ACTIVATED"
          :device-service-info="deviceServiceInfo"
        />

        <!-- <cloud-storage-service-info
        :loading="loading"
        :cloud-storage-info-list="cloudStorageInfoList"
      /> -->

        <div class="cloud-storage-introduce">
          <div class="cloud-storage-serive-desc">
            <div class="display-title"> {{ $t('cloud-storage.equity') }} </div>
            <!-- <div
          class="cloud-storage-serive-desc__link"
          @click="$router.push('/cloud-storage/introduce')"
          >{{ $t('cloud-storage.introduce') }}<img src="/src/assets/images/right-arrow.png" alt=""
        /></div> -->
          </div>

          <div class="cloud-storage-serive-desc-grid">
            <div class="cloud-storage-serive-desc-grid-item">
              <img
                class="cloud-storage-serive-desc-grid-item__icon"
                src="/src/assets/icons/icon_secure_storage.png"
              />
              <div class="cloud-storage-serive-desc-grid-item__label">{{
                $t('cloud-storage.safe-save')
              }}</div>
            </div>
            <div class="cloud-storage-serive-desc-grid-item">
              <img
                class="cloud-storage-serive-desc-grid-item__icon"
                src="/src/assets/icons/icon_offline_play.png"
              />
              <div class="cloud-storage-serive-desc-grid-item__label">{{
                $t('cloud-storage.offline-watch')
              }}</div>
            </div>
            <div class="cloud-storage-serive-desc-grid-item">
              <img
                class="cloud-storage-serive-desc-grid-item__icon"
                src="/src/assets/icons/icon_video_encipher.png"
              />
              <div class="cloud-storage-serive-desc-grid-item__label">{{
                $t('cloud-storage.video-encrpy')
              }}</div>
            </div>
            <div class="cloud-storage-serive-desc-grid-item">
              <img
                class="cloud-storage-serive-desc-grid-item__icon"
                src="/src/assets/icons/icon_speed_play.png"
              />
              <div class="cloud-storage-serive-desc-grid-item__label">{{
                $t('cloud-storage.speed-play')
              }}</div>
            </div>
          </div>

          <div class="introduce-btn" @click="$router.push('/cloud-storage/introduce')">{{
            $t('cloud-storage.more-qy')
          }}</div>
        </div>

        <!-- <div class="display-title"> 云服务升级包 </div>
      <div class="display-title"> 套餐说明 </div>
      <p class="display-desc" style="margin-bottom: 20px">
        权益1：云服务套餐 <br />
        (1) 购买本套餐后，即刻享受本套餐对应规格的云服务视频录制与消息回放功能。
      </p>
      <p class="display-desc">
        权益2：云服务升级包<br />
        (1) 云服务升级包专享更多优惠，随时随地纵享更优服务。 <br />(2)
        套餐生效期间您可获得购买多种云服务升级包的特权，具体以云服务升级包有效期为准。
      </p>
      <div class="display-title"> 购买须知 </div>
      <p class="display-desc">
        1. 您可在套餐生效期间享受套餐的权益内容，套餐期满或失效后对应的权益将自动失效。
        <br />2.
        特别提醒，当用户购买新套餐时，将立即生效新套餐服务，原套餐对应所有权益包括云服务升级包等将会被新套餐替代，原套餐剩余权益及有效期保持不变，将在新套餐结束后继续生效。
        <br />3. 优惠券等折扣服务仅对规定套餐使用，优惠券对套餐适用范围以具体购买页面为准。 <br />4.
        云服务套餐购买后对设备生效，云服务套餐会跟随设备转移。 <br />5.
        云服务套餐为虛拟产品，购买成功后，不支持退款，请您理解，如果您有其他疑问，可通过客服邮箱进行反馈。
        <br />6. 您可以通过页面右上角"···"查看订单情况。</p
      > -->

        <div style="flex: 1"></div>

        <div class="to-pay-btn" @click="handleToCloudStoragePage">{{
          deviceServiceInfo?.state !== PackageStatus.NONACTIVATED
            ? $t('cloud-storage.xufei')
            : $t('cloud-storage.jihuo')
        }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts" name="CloudStorageSettingPage">
  import CloudStroageStateSwitcher from './components/CloudStroageStateSwitcher.vue';
  // import CloudStorageServiceInfo from './components/CloudStorageServiceInfo.vue';
  import { ref } from 'vue';
  import { showLoadingToast } from 'vant';
  import { useRoute, useRouter } from 'vue-router';
  import { getDeviceCloudStroageStatusInfo } from '@/api/modules/iot-device';
  import { useI18n } from 'vue-i18n';
  import { PackageStatus } from '@/stores/modules/types/cloudStorage';
  import { SkuType } from '@/stores/modules/types/purchase';

  const router = useRouter();
  const route = useRoute();
  const { t } = useI18n();

  const deviceSn = ref<string>('');
  const loading = ref<boolean>(true);

  const deviceServiceInfo = ref<PackageStatusInfo>();
  // const cloudStorageInfoList = computed<PackageInfoItem[]>(
  //   () => deviceServiceInfo.value?.list ?? [],
  // );

  // 云存储过期判断
  // const isExpried = computed(() => {
  //   if (cloudStorageInfoList.value.length) {
  //     return cloudStorageInfoList.value[0].serviceState === 3;
  //   } else {
  //     return true;
  //   }
  // });

  // 获取路径参数
  async function getLocationSearchParams() {
    let params = route.query as unknown as object;
    if (params['sn']) {
      deviceSn.value = params['sn'];
    }

    requestCloudStorageInfoList();
  }
  getLocationSearchParams();

  async function requestCloudStorageInfoList() {
    const toast = showLoadingToast({
      message: t('cloud-storage.loading'),
    });
    loading.value = true;
    try {
      const res = await getDeviceCloudStroageStatusInfo({
        sn: deviceSn.value,
      });

      deviceServiceInfo.value = res;
      console.log('requestCloudStorageInfoList: ', res);
    } catch (e) {
      console.log('requestCloudStorageInfoList Error: ', e);
    } finally {
      toast.close();
      loading.value = false;
    }
  }

  function handleToCloudStoragePage() {
    const sn = route.query['sn'];
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
  .cloud-stroage-setting {
    width: 100vw;
    height: 100vh;
    box-sizing: border-box;
    background-color: #f9f9f9;
    // background: linear-gradient(135deg, #eddace, #fff 100vw, #fff);
    overflow-x: hidden;
    overflow-y: auto;

    .layout-header-title {
      font-weight: bold;
    }

    .main-content {
      // padding: 0 20px;
      // margin: 0 26px;
      // margin-top: 13px;
      display: flex;
      flex-direction: column;
      min-height: 100%;

      .mian-content-wapper {
        flex: 1;
        margin: 0 26px;
        margin-top: 13px;
        display: flex;
        flex-direction: column;
      }

      .display-title {
        font-weight: 500;
        font-size: 15px;
      }

      .display-desc {
        padding: 0 6px;
        color: #686868;
        font-size: 12px;
        font-weight: 500;
      }

      .cloud-storage-introduce {
        background-color: #fff;
        padding: 13px;
        border-radius: 8px;
        .cloud-storage-serive-desc {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 10px;

          .cloud-storage-serive-desc__link {
            padding: 28px 0 20px 0;
            font-size: 10px;
            color: #232323;
            cursor: pointer;
            display: flex;
            align-items: center;

            > img {
              object-fit: contain;
              width: 12px;
              height: 12px;
              margin-left: 3px;
              vertical-align: middle;
            }
          }
        }

        .cloud-storage-serive-desc-grid {
          padding: 0 30px;
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
          margin-bottom: 6px;
          .cloud-storage-serive-desc-grid-item {
            flex: 0 0 50%;
            box-sizing: border-box;
            display: flex;
            align-items: center;
            // justify-content: center;
            text-align: center;
            .cloud-storage-serive-desc-grid-item__icon {
              width: 48px;
            }
            .cloud-storage-serive-desc-grid-item__label {
              color: #232323;
              font-size: 12px;
              padding: 0px;
            }
          }
        }

        .introduce-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 400;
          font-size: 11px;
          color: #232323;
          background-color: rgba(35, 35, 35, 0.03);
          border-radius: 5px;
          height: 32px;
        }
      }
    }

    ::v-deep(.van-nav-bar) {
      background-color: transparent;
      height: 50px;
    }
  }

  .to-pay-btn {
    flex-shrink: 0;
    height: 46px;
    border-radius: 5px;
    background-color: #1b1b1b;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    font-weight: 400;
    font-size: 13px;
    line-height: 16px;
    font-style: normal;
    text-transform: none;
    transition: 0.36s opacity;
    margin-top: 32px;
    margin-bottom: 32px;

    &:active {
      opacity: 0.6;
    }
  }
</style>
