<template>
  <div class="package-card__outer">
    <div class="package-card-tag">
      <div v-if="package.recommend" class="package-card-tag__hot package-card-tag__item">
        <img
          src="/src/assets/images/cloud-storage/icon_hot.png"
          class="hot-icon"
          alt=""
          srcset=""
        />
        Hot
      </div>
      <!-- <div class="package-card-tag__item row-text__ellipsis" v-if="package.recommend">
        {{ $t('cloud-storage.recommend') }}
      </div> -->
      <div class="package-card-tag__item row-text__ellipsis" v-if="package.badge">
        {{ package.badge }}
      </div>
    </div>
    <div
      class="package-card package-card__border-noconvert"
      :class="{
        'highlight-item': isActive,
      }"
    >
      <div class="package__floor-1">
        <div class="package__name">{{ package.displayName ?? '_' }}</div>
        <div class="package__price highlight-text">
          <span class="price-unit-symbol">{{ package?.currency === 'CNY' ? '¥' : '$' }}</span>
          <span class="package-price">{{
            parseFloat(((package.price ?? 0) / 100).toFixed(2))
          }}</span>
        </div>
      </div>
      <div class="package__floor-2">
        <div class="package__specification-info">
          <div class="package__types" v-if="package.combinedType === CombinedType.combined">
            <div class="package-tag" v-if="hasCsPackage">{{ $t('cloud-storage.record') }}</div>
            <div class="package-tag" v-if="has4GPackage">{{ $t('cloud-storage.4g') }}</div>
          </div>
          <div class="package__types" v-else>
            <div class="package-tag"
              >{{ $t('cloud-storage.storage-tag', { count: package.lifecycle }) }}
            </div>
            <div class="package-tag" v-if="package.months === 0 && package.days !== 0">
              {{ $t('cloud-storage.service-duration-day', { count: package.days }) }}
            </div>
            <div class="package-tag" v-else
              >{{ $t('cloud-storage.service-duration', { count: package.months }) }}
            </div>
            <div v-if="[1, 2, 3].includes(package.recordType)" class="package-tag">{{
              package.recordType === 1
                ? $t('cloud-storage.event-record-type')
                : $t('cloud-storage.all-time-record-type')
            }}</div>
          </div>
          <!-- <div class="package__duration-type"
        >/{{ computedPackageServiceTimeDisplayName(package) }}</div
      > -->
        </div>
        <div
          class="original-price"
          v-if="package.originalPrice && package.price !== package.originalPrice"
          >{{ package?.currency === 'CNY' ? '¥' : '$'
          }}{{ parseFloat(((package.originalPrice ?? 0) / 100).toFixed(2)) }}</div
        >
      </div>
      <!-- 组合套餐子项展示 -->
      <div
        class="package__floor-3-outer"
        v-if="package.combinedType === CombinedType.combined"
        :class="{
          collapsed: isActive,
        }"
      >
        <div class="package__floor-3-inner">
          <div class="package__floor-3">
            <div
              class="group-package-card"
              v-for="item of package.combinedSubList ?? []"
              :key="item.packageId"
            >
              <img src="/src/assets/images/4g.png" v-if="item.skuType === skuType.data" alt="" />
              <img src="/src/assets/images/yun.png" v-else alt="" />
              <div class="right-section">
                <div class="right-section__floor-1">
                  <div class="right-section__pkg-name row-text__ellipsis">{{
                    item.displayName ?? '_'
                  }}</div>
                  <div class="right-section__price"
                    >{{ item?.currency === 'CNY' ? '¥' : '$'
                    }}{{ parseFloat(((item.originalPrice ?? 0) / 100).toFixed(2)) }}</div
                  >
                </div>
                <div class="package-spec">
                  <van-space wrap :size="['0.1067rem', '0.1067rem']">
                    <div class="group-package-tag" v-if="item.months === 0 && item.days !== 0">
                      {{ $t('cloud-storage.service-duration-day', { count: item.days }) }}
                    </div>
                    <div class="group-package-tag" v-else
                      >{{ $t('cloud-storage.service-duration', { count: item.months }) }}
                    </div>
                    <template v-if="item.skuType === skuType.cs">
                      <div class="group-package-tag"
                        >{{ $t('cloud-storage.storage-tag', { count: item.lifecycle }) }}
                      </div>
                      <div v-if="[1, 2, 3].includes(item.recordType)" class="group-package-tag">{{
                        item.recordType === 1
                          ? $t('cloud-storage.event-record-type')
                          : $t('cloud-storage.all-time-record-type')
                      }}</div>
                    </template>
                    <template v-if="item.skuType === skuType.data">
                      <div class="group-package-tag">{{
                        item.dataType === TrafficType.limited
                          ? computeTrafficDataSizeDisplayName((item.dataTotal ?? 0) * 1024)
                          : $t('traffic.unlimted')
                      }}</div>
                    </template>
                  </van-space>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { skuType, TrafficType } from '@/views/cloud-storage/order/common';
  import { CombinedType } from '../types/cloud-storage';
  import { computed } from 'vue';
  import { computeTrafficDataSizeDisplayName } from '@/utils/formatter';

  // import { useI18n } from 'vue-i18n';

  const props = defineProps({
    package: {
      type: Object as PropType<CloudStoragePackageInfo>,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: false,
    },
  });

  const hasCsPackage = computed(
    () => !!props.package.combinedSubList?.find((e) => e.skuType === skuType.cs),
  );

  const has4GPackage = computed(
    () => !!props.package.combinedSubList?.find((e) => e.skuType === skuType.data),
  );

  // const { t } = useI18n();

  // 计算套餐服务时长规格
  // function computedPackageServiceTimeDisplayName(packageInfo: CloudStoragePackageItem) {
  //   const months = packageInfo?.months ?? 0;
  //   const days = packageInfo?.days ?? 0;

  //   if (months != 0) {
  //     if (months === 12) {
  //       return t('cloud-storage.unit-year');
  //     } else if (months === 6) {
  //       return t('cloud-storage.unit-half-year');
  //     } else if (months === 3) {
  //       return t('cloud-storage.unit-quarter');
  //     } else if (months === 1) {
  //       return t('cloud-storage.unit-month');
  //     } else {
  //       return t('cloud-storage.duration-months', [months]);
  //     }
  //   } else {
  //     if (days === 1) {
  //       return t('cloud-storage.unit-day');
  //     }
  //     return days != 0 ? t('cloud-storage.pkg-validity-days', [days]) : '';
  //   }
  // }
</script>

<style scoped lang="less">
  .package-card__outer {
    position: relative;
    height: fit-content;
    width: 100%;
    border-radius: 10px;
    overflow: hidden;

    .package-card-tag {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 20px;
      display: flex;
      justify-content: flex-end;

      .package-card-tag__item {
        font-size: 11px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #fff;
        font-weight: bold;
        padding: 0 10px;
        background-color: #247cff;

        &:not(&:last-child) {
          margin-right: 4px;
          border-radius: 0 0 10px 10px;
        }

        &:last-child {
          border-radius: 0 0 0 10px;
        }
      }

      .package-card-tag__hot {
        background: linear-gradient(90deg, #faa43f 0%, #f13c3c 100%);
      }

      .hot-icon {
        display: block;
        width: 15px;
        height: 15px;
        object-fit: contain;
        margin-right: 2px;
      }
    }
  }

  .package-card {
    display: flex;
    flex-direction: column;
    padding: 20px;
    border-radius: 10px;
    overflow: hidden;
    transition: 0.36s all;
    position: relative;

    .package__floor-1 {
      display: flex;
      align-items: center;
      .package__name {
        flex: 1;
        font-weight: bold;
        font-size: 17px;
        color: #232323;
        text-wrap: wrap;
        word-break: break-all;
        margin-right: 4px;
      }

      .package__price {
        height: fit-content;
        display: flex;
        justify-content: center;
        align-items: baseline;
        color: #232323;
        font-size: 19px;

        .package-price {
          font-weight: bold;
        }

        .price-unit-symbol {
          font-size: 15px;
          font-weight: bold;
        }

        & > span:not(& > span:last-child) {
          margin-right: 2px;
        }
      }
    }

    .package__floor-2 {
      display: flex;
      align-items: baseline;
      justify-content: space-between;
      color: #8f8f8f;
      font-size: 12px;
      // line-height: 14px;
      .original-price {
        flex-shrink: 0;
        text-decoration: line-through;
      }

      .package__specification-info {
        display: flex;
        flex: 1;
        //   align-items: center;
        align-items: start;
        font-weight: 400;
        margin-right: 4px;

        .package__types {
          flex: 1;
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          .package-tag {
            margin-top: 4px;
            &:not(&:last-child) {
              padding-right: 4px;
              margin-right: 4px;
              border-right: 1px solid #8f8f8f;
            }
          }
        }
      }
    }

    .package__floor-3-outer {
      display: grid;
      grid-template-rows: 0fr;
      // transition: 250ms all ease;
      overflow: hidden;
      &.collapsed {
        // height: auto;
        // clip-path: inset(0);

        grid-template-rows: 1fr;
      }

      .package__floor-3-inner {
        overflow: hidden;
      }

      .package__floor-3 {
        margin-top: 18px;
        display: flex;
        flex-direction: column;

        .group-package-card {
          display: flex;
          align-items: center;
          padding: 20px 13px;
          background: rgba(35, 35, 35, 0.03);
          border-radius: 10px;

          &:not(&:last-child) {
            margin-bottom: 6px;
          }

          > img {
            width: 35px;
            height: 35px;
            display: block;
            object-fit: contain;
            flex-shrink: 0;
            margin-right: 8px;
          }

          .right-section {
            flex: 1;
            flex-shrink: 0;
            overflow: hidden;
            display: flex;
            flex-direction: column;

            .right-section__floor-1 {
              display: flex;
              align-items: center;
              margin-bottom: 4px;

              .right-section__pkg-name {
                flex: 1;
                font-weight: 500;
                font-size: 14px;
                color: #232323;
                text-align: left;
                font-style: normal;
                text-transform: none;
              }

              .right-section__price {
                font-weight: 400;
                font-size: 12px;
                color: #8f8f8f;
                text-align: right;
                font-style: normal;
                text-transform: none;
                flex-shrink: 0;
              }
            }
          }
        }

        .group-package-tag {
          border-radius: 3px;
          display: flex;
          align-items: center;
          padding: 0 5px;
          font-size: 11px;
          color: #247cff;
          background-color: #e8f3ff;
        }
      }
    }
  }

  .package-card__border-noconvert {
    border: 2px solid rgba(35, 35, 35, 0.05);
  }

  .highlight-item {
    border-color: #247cff;

    .highlight-text {
      color: #247cff !important;
    }
  }
</style>
