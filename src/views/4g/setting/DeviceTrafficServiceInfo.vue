<template>
  <div class="gsmdata-service-info">
    <div class="service-info-card-header">
      <div class="card-header__label">{{ $t('traffic.current-package') }}</div>
      <div class="card-header__link" @click="toTrafficIntroducePage"
        >{{ $t('traffic.all-record') }}<img src="/src/assets/images/right-arrow.png" alt=""
      /></div>
    </div>

    <van-skeleton :row="4" :loading="requestDeviceInfoLoading">
      <template v-if="serviceStatusList.length">
        <template v-for="(item, index) of serviceStatusList" :key="item.orderId">
          <div
            class="base-card default-card"
            :class="{
              'expired-card': index === 0 && item.queueState === PackageServiceState.expired,
            }"
          >
            <div class="package-info-card__left">
              <div class="package-info-card__title row-text__ellipsis">{{
                item.packageName ?? '_'
              }}</div>
              <div class="package-info-card__exp-time">
                {{
                  $t('cloud-storage.validity-time', [
                    dayjs(item.startTime).format('YYYY-MM-DD'),
                    dayjs(item.endTime).format('YYYY-MM-DD'),
                  ])
                }}
              </div>
              <div
                class="package-info-card__left-remaining"
                v-if="item.queueState === PackageServiceState.effected"
              >
                <div class="package-info-card__remaining-time">
                  {{
                    item.endTime - Date.now() >= 0
                      ? $t('cloud-storage.pkg-validity-duration')
                      : $t('cloud-storage.pkg-expried')
                  }}<span class="package-info-card__remaining-time-highlight"
                    >{{
                      $t('cloud-storage.pkg-validity-days', [
                        Math.floor(Math.abs(Date.now() - item.endTime) / (24 * 3600 * 1000)),
                      ])
                    }}
                  </span>
                </div>
              </div>
            </div>
            <div class="package-info-card__right">
              <div class="package-info-card__state-desc">{{
                currentLocale === 'zh-CN'
                  ? CloudStorageStateTextMap[item.queueState]
                  : CloudStorageStateEnMap[item.queueState]
              }}</div>
            </div>
          </div>
        </template>
      </template>
      <template v-else>
        <div class="no-pkg">{{ $t('cloud-storage.no-pkg') }}</div></template
      >
    </van-skeleton>

    <van-back-top :offset="150" />
  </div>
</template>

<script setup lang="ts">
  import useLocale from '@/hooks/useLocale';
  import {
    CloudStorageStateEnMap,
    CloudStorageStateTextMap,
    PackageServiceState,
  } from '@/views/cloud-storage/setting/common';
  import { useRouter } from 'vue-router';
  import dayjs from 'dayjs';
  import { storeToRefs } from 'pinia';
  import { useTrafficSetting } from '@/stores/modules/trafficSetting';
  import { computed } from 'vue';

  const { currentLocale } = useLocale();

  const router = useRouter();

  const { serviceInfo, sn, requestDeviceInfoLoading } = storeToRefs(useTrafficSetting());

  const serviceStatusList = computed(() => serviceInfo.value?.list ?? []);

  function toTrafficIntroducePage() {
    router.push({
      path: '/gsmdata/record',
      query: {
        sn: sn.value,
      },
    });
  }
</script>

<style scoped lang="less">
  .gsmdata-service-info {
    display: flex;
    flex-direction: column;
    margin: 6px 0;
    .service-info-card-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 13px;
      color: #232323;
      .card-header__label {
        font-weight: bold;
        font-size: 12px;
        text-align: left;
        font-style: normal;
      }

      .card-header__link {
        display: flex;
        align-items: center;
        font-weight: 400;
        font-size: 11px;
        text-align: left;
        font-style: normal;

        > img {
          object-fit: contain;
          width: 12px;
          height: 12px;
          margin-left: 3px;
          vertical-align: middle;
        }
      }
    }
  }

  .device-traffic-service-info {
    padding: 19px;
    background: linear-gradient(180deg, #1b1b1b 0%, #545557 35%, #545557 65%, #1b1b1b 100%);
    border-radius: 10px;
    margin-bottom: 29px;

    .package-info {
      display: flex;
      align-items: center;
      margin-bottom: 6px;

      .left-section {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: start;

        .package-name {
          font-weight: 500;
          font-size: 14px;
          color: #ffffff;
          line-height: 17px;
          text-align: left;
          font-style: normal;
          text-transform: none;
          margin-bottom: 2px;
        }

        .package-service-duration {
          font-weight: 400;
          font-size: 11px;
          color: #ffffff;
          line-height: 12px;
          font-style: normal;
          text-transform: none;
          opacity: 0.5;
        }
      }

      .right-section {
        font-weight: 400;
        font-size: 11px;
        color: #ffffff;
        line-height: 12px;
        text-align: right;
        font-style: normal;
      }
    }

    .service-left-time {
      font-weight: 400;
      font-size: 12px;
      color: #ffffff;
      line-height: 14px;
      text-align: left;
      font-style: normal;
      text-transform: none;

      .service-left-time__highlight {
        color: #87b7ff;
      }
    }
  }

  .no-pkg {
    padding: 16px 0;
    text-align: center;
    font-size: 12px;
    color: #8f8f8f;
  }

  .base-card {
    display: flex;
    width: 100%;
    margin-bottom: 6px;
    padding: 20px 24px;
    border-radius: 15px;

    .package-info-card__left {
      flex: auto;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      .package-info-card__title {
        font-size: 14px;
        font-weight: 500;
        color: #fff;
        line-height: 16px;
      }

      .package-info-card__exp-time {
        color: #fff;
        font-size: 10px;
        // line-height: 28px;
        padding: 6px 0;
      }

      .package-info-card__left-remaining {
        flex: auto;
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        .package-info-card__remaining-time {
          color: #fff;
          font-size: 12px;
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          .package-info-card__remaining-time-highlight {
            color: #87b7ff;
          }
        }
      }
    }
    .package-info-card__right {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;

      .package-info-card__state-desc {
        font-size: 11px;
        color: #fff;
        font-weight: 500;
        text-align: center;
      }
    }
  }

  .expired-card {
    min-height: 78px;
    background: #abadb1 !important;
  }

  .default-card {
    min-height: 78px;
    background: black url('/src/assets/images/cloud_storage_card.png') repeat;
    background-size: contain;
  }
</style>
