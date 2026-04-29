<template>
  <div class="cloud-storage-introduce">
    <div class="top-introduce-card">
      <div class="top-introduce-card-header">
        <div class="top-introduce-card-header__title"> {{ $t('cloud-storage.equity') }} </div>
        <div class="top-introduce-card-header__more" @click="handleShowMoreInfoPage">{{
          $t('cloud-storage.more-info')
        }}</div>
      </div>
      <div class="top-introduce-card-grid-area">
        <div class="top-introduce-card-grid-item"
          ><van-icon size="1rem" :name="SecureStorageIcon" /> {{ $t('cloud-storage.safe-save') }}
        </div>
        <div class="top-introduce-card-grid-item"
          ><van-icon size="1rem" :name="OfflinePlayIcon" /> {{ $t('cloud-storage.offline-watch') }}
        </div>
        <div class="top-introduce-card-grid-item"
          ><van-icon size="1rem" :name="VideoEncipherIcon" /> {{ $t('cloud-storage.video-encrpy') }}
        </div>
        <div class="top-introduce-card-grid-item"
          ><van-icon size="1rem" :name="SpeedPlayIcon" /> {{ $t('cloud-storage.speed-play') }}
        </div>
      </div>
    </div>

    <div class="sub-desc-area" v-if="isOverseaEnv">
      <div class="bottom-sub-title"> {{ $t('cloud-storage.renewal-title') }} </div>
      <div class="bottom-sub-desc">
        <!-- {{
          baseInfo?.platform === 'ios'
            ? $t('cloud-storage.auto-renewal-tip.ios')
            : $t('cloud-storage.auto-renewal-tip.android')
        }} -->
        <ul
          v-if="baseInfo?.platform === 'ios'"
          style="list-style-type: disc; padding-left: 0.4267rem"
        >
          <li>{{ $t('cloud-storage.renewal-desc.ios-item1') }}</li>
          <li>{{ $t('cloud-storage.renewal-desc.ios-item2') }}</li>
          <li>{{ $t('cloud-storage.renewal-desc.ios-item3') }}</li>
        </ul>

        <ul v-else style="list-style-type: disc; padding-left: 0.4267rem">
          <li>{{ $t('cloud-storage.renewal-desc.android-item1') }}</li>
          <li>{{ $t('cloud-storage.renewal-desc.android-item2') }}</li>
          <li>{{ $t('cloud-storage.renewal-desc.android-item3') }}</li>
        </ul>
      </div>
    </div>

    <!-- <div class="service-link">
      <span @click="handleToIframe('cloud-storage/argument')">云服务协议</span> |
      <span @click="handleToIframe('cloud-storage/auto-renew-argument')">自动续费协议</span>
    </div> -->
  </div>
</template>

<script setup lang="ts">
  import OfflinePlayIcon from '@/assets/icons/icon_offline_play.png';
  import SecureStorageIcon from '@/assets/icons/icon_secure_storage.png';
  import SpeedPlayIcon from '@/assets/icons/icon_speed_play.png';
  import VideoEncipherIcon from '@/assets/icons/icon_video_encipher.png';
  import { useAppEnvStore, useMethodChannelStore } from '@/stores';
  import { storeToRefs } from 'pinia';

  const { postMessage } = useMethodChannelStore();
  const { isOverseaEnv, baseInfo } = storeToRefs(useAppEnvStore());

  function handleShowMoreInfoPage() {
    postMessage({
      method: 'appRouter',
      data: {
        page: 'OpenWeb',
        params: { url: '#/cloud-storage/introduce' },
      },
    });
  }

  // function handleToIframe(path: string) {
  //   router.push(path);
  // }
</script>

<style scoped lang="less">
  .cloud-storage-introduce {
    .top-introduce-card {
      width: 100%;
      // height: 156px;
      background-color: #fff;
      border-radius: 13px;
      margin: 13px 0;
      padding: 20px;

      display: flex;
      flex-direction: column;

      box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);

      .top-introduce-card-header {
        display: flex;
        justify-content: space-between;
        .top-introduce-card-header__title {
          font-size: 15px;
          font-weight: bold;
        }

        .top-introduce-card-header__more {
          font-size: 12px;
          color: #808080;
          display: flex;
          align-items: center;
          text-decoration: underline;
        }
      }

      .top-introduce-card-grid-area {
        flex: auto;
        display: flex;
        padding-top: 12px;

        .top-introduce-card-grid-item {
          flex: 1;

          display: flex;
          flex-direction: column;
          align-items: center;
          // justify-content: center;
          text-align: center;

          color: #808080;
          font-size: 12px;
        }
      }
    }

    .sub-desc-area {
      padding: 0 13px 26px 13px;
      .bottom-sub-title {
        font-size: 12px;
        color: #000;
      }

      .bottom-sub-desc {
        font-size: 12px;
        color: #808080;
      }
    }

    .service-link {
      padding: 20px 0 40px 0;
      color: #2c70ff;
      text-align: center;
      span {
        font-size: 12px;
      }
    }
  }
</style>
