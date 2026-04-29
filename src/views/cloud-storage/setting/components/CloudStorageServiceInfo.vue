<template>
  <div class="cloud-storage-service-info">
    <div class="service-info-card-header">
      <div class="card-header__label">{{ $t('traffic.current-package') }}</div>
      <div class="card-header__link" @click="toRecordPage"
        >{{ $t('traffic.all-record') }}<img src="/src/assets/images/right-arrow.png" alt=""
      /></div>
    </div>

    <!-- cloud-storage package info display area -->
    <van-skeleton :row="6" :loading="loading">
      <template v-if="cloudStorageInfoList.length">
        <template v-for="(item, index) of cloudStorageInfoList" :key="item.startTime">
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
        <div class="no-pkg">{{ $t('cloud-storage.no-pkg') }}</div>
      </template>
    </van-skeleton>

    <!-- video quality package info display area -->
    <!-- <div class="package-info-card">
      <div class="package-info-card__left">
        <div class="package-info-card__title row-text__ellipsis">云存画质升级卡</div>
        <div class="package-info-card__exp-time row-text__ellipsis"> 有效期至： 2023-10-12 </div>
        <div class="package-info-card__left-remaining">
          <div class="package-info-card__remaining-time"
            >套餐剩余时间：<span class="package-info-card__remaining-time-highlight"
              >15天</span
            ></div
          >
        </div>
      </div>
      <div class="package-info-card__right">
        <div class="package-info-card__state-desc">权益生效中</div>
        <div class="package-info-card__refill-btn">立即续费</div>
      </div>
    </div> -->

    <van-back-top :offset="150" />
  </div>
</template>

<script setup lang="ts">
  import dayjs from 'dayjs';
  import { CloudStorageStateEnMap, CloudStorageStateTextMap, PackageServiceState } from '../common';
  import useLocale from '@/hooks/useLocale';
  import { useRouter } from 'vue-router';

  defineProps({
    loading: {
      type: Boolean,
      default: false,
    },
    cloudStorageInfoList: {
      type: Object as PropType<PackageInfoItem[]>,
      required: true,
    },
  });

  const { currentLocale } = useLocale();
  const router = useRouter();

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
  .cloud-storage-service-info {
    display: flex;
    flex-direction: column;

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
              color: #d3b984;
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

    .no-pkg {
      padding: 16px 0;
      text-align: center;
      font-size: 12px;
      color: #8f8f8f;
    }
  }
</style>
