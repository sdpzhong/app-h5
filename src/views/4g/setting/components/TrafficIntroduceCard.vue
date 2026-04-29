<template>
  <div class="traffic-introduce">
    <div class="traffic-introduce__header">
      <div class="header-title">{{ $t('traffic.esim-service') }}</div>
      <!-- <div class="link-to-introduce" @click="$router.push('/gsmdata/introduce')">{{
        $t('traffic.service-record')
      }}</div> -->
    </div>
    <div class="traffic-introduce__grids">
      <div class="traffic-introduce__grid-item">
        <img src="/src/assets/images/cloud-storage/4g-grid-1.png" alt="" />
        <span class="grid-item__desc"> {{ $t('traffic.4g-setting-grid-1') }} </span>
      </div>
      <div class="traffic-introduce__grid-item">
        <img src="/src/assets/images/cloud-storage/4g-grid-2.png" alt="" />
        <span class="grid-item__desc"> {{ $t('traffic.speed-pay') }} </span>
      </div>
      <div class="traffic-introduce__grid-item">
        <img src="/src/assets/images/cloud-storage/4g-grid-3.png" alt="" />
        <span class="grid-item__desc"> {{ $t('traffic.4g-setting-grid-3') }} </span>
      </div>
      <div class="traffic-introduce__grid-item">
        <img src="/src/assets/images/cloud-storage/4g-grid-4.png" alt="" />
        <span class="grid-item__desc"> {{ $t('traffic.4g-setting-grid-4') }} </span>
      </div>
    </div>
    <div class="introduce-btn" @click="$router.push('/gsmdata/introduce')">{{
      $t('cloud-storage.more-qy')
    }}</div>
  </div>
  <div class="traffic-introduce__banner">
    <div class="banner__title">{{ $t('traffic.banner-title') }}</div>
    <div class="banner__subtitle">{{ $t('traffic.banner-subtitle') }}</div>
    <div class="banner__pay-btn" @click="$emit('openCloudStroagePage')">{{
      $t('traffic.to-active')
    }}</div>
  </div>
</template>

<script setup lang="ts">
  defineEmits(['openCloudStroagePage']);
</script>

<style scoped lang="less">
  .traffic-introduce {
    background-color: #fff;
    padding: 13px;
    border-radius: 8px;
    margin-bottom: 8px;
    .traffic-introduce__header {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .header-title {
        font-weight: 500;
        font-size: 14px;
        color: #232323;
        line-height: 17px;
      }

      .link-to-introduce {
        font-weight: 400;
        font-size: 12px;
        color: #232323;
        line-height: 14px;
        text-align: right;
      }
    }

    .traffic-introduce__grids {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      margin-bottom: 6px;
      .traffic-introduce__grid-item {
        flex: 0 0 50%;
        box-sizing: border-box;
        margin-top: 10px;
        display: flex;
        // justify-content: center;
        align-items: center;

        > img {
          width: 48px;
          height: 48px;
          object-fit: contain;
          flex-shrink: 0;
          margin-right: 10px;
        }

        .grid-item__desc {
          font-weight: 400;
          width: 80px;
          font-size: 12px;
          color: #232323;
          line-height: 14px;
          text-align: left;
        }

        &:nth-child(odd) {
          justify-content: flex-end;
        }

        &:only-child(even) {
          justify-content: start;
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

  .traffic-introduce__banner {
    padding: 13px;
    background: linear-gradient(90deg, #368cff 0%, #45c7ff 100%);
    background-image: url('/src/assets/images/cloud-storage/4g-setting-banner.png');
    background-repeat: no-repeat;
    background-size: cover;
    background-position: right center;
    border-radius: 10px;
    overflow: hidden;
    flex-shrink: 0;

    .banner__title {
      max-width: 200px;
      font-family: DingTalk JinBuTi;
      font-size: 13px;
      color: #2c3a5b;
      line-height: 16px;
      margin-bottom: 3px;
    }
    .banner__subtitle {
      max-width: 180px;
      font-family: DingTalk JinBuTi;
      font-size: 9px;
      color: #2c3a5b;
      line-height: 11px;
      margin-bottom: 13px;
    }
    .banner__pay-btn {
      height: 20px;
      width: fit-content;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0 15px;
      font-size: 12px;
      color: #ffffff;
      line-height: 14px;
      border-radius: 10px;
      background: linear-gradient(to right, #6bd2ff, #1f76f8);
      transition: 0.36s opacity;

      &:active {
        opacity: 0.6;
      }
    }
  }
</style>
