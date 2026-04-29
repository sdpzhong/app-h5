<template>
  <div class="cell-card--sm service-rights">
    <div class="service-rights__header">
      <div class="service-rights__header__title"> {{ $t('purchase.service-rights') }} </div>
      <div class="service-rights__header__more" @click="$router.push('/cloud-storage/introduce')">
        {{ $t('purchase.more') }}
        <img src="/src/assets/images/purchase/icon-right-arrow.png" alt="" />
      </div>
    </div>
    <div class="service-rights__grid">
      <div class="service-rights__grid-item">
        <img src="/src/assets/images/purchase/icon-safe.png" alt="" class="service-rights__img" />
        <div class="service-rights__name row-text__ellipsis">{{
          $t('cloud-storage.safe-save')
        }}</div>
      </div>
      <div class="service-rights__grid-item">
        <img
          src="/src/assets/images/purchase/icon-offline.png"
          alt=""
          class="service-rights__img"
        />
        <div class="service-rights__name row-text__ellipsis">{{
          $t('cloud-storage.offline-watch')
        }}</div>
      </div>
      <div class="service-rights__grid-item">
        <img
          src="/src/assets/images/purchase/icon-record-cipher.png"
          alt=""
          class="service-rights__img"
        />
        <div class="service-rights__name row-text__ellipsis">{{
          $t('cloud-storage.video-encrpy')
        }}</div>
      </div>
      <div class="service-rights__grid-item">
        <img src="/src/assets/images/purchase/icon-speed.png" alt="" class="service-rights__img" />
        <div class="service-rights__name row-text__ellipsis">{{
          $t('cloud-storage.speed-play')
        }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped lang="less">
  @import '../../common.less';
  .service-rights {
    display: flex;
    flex-direction: column;
    &__header {
      display: flex;
      align-items: center;

      &__title {
        flex: 1;
        font-weight: 400;
        font-size: 13px;
        color: #404c79;
      }

      &__more {
        display: flex;
        align-items: center;
        font-weight: 400;
        font-size: 11px;
        color: #404c79;
        > img {
          display: block;
          object-fit: contain;
          width: 19px;
          height: 19px;
        }

        &:active {
          opacity: 0.6;
        }
      }
    }

    &__grid {
      display: flex;
      align-items: center;
      padding-top: 15px;
    }

    &__grid-item {
      flex-basis: 25%;
      flex-grow: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      overflow: hidden;

      > img {
        display: block;
        height: 38px;
        width: 38px;
        object-fit: contain;
        margin-bottom: 6px;
      }
    }

    &__name {
      text-align: center;
      width: 100%;
      font-weight: 400;
      font-size: 11px;
      color: #404c79;
    }
  }
</style>
