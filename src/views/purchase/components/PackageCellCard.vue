<template>
  <div class="pkg-cell-card">
    <div class="package-card-tag">
      <div class="package-card-tag__hot package-card-tag__item" v-if="info.recommend">
        <img
          src="/src/assets/images/cloud-storage/icon_hot.png"
          class="hot-icon"
          alt=""
          srcset=""
        />
        Hot
      </div>
      <!-- <div class="package-card-tag__item row-text__ellipsis"> 推荐 </div> -->
      <div class="package-card-tag__item row-text__ellipsis" v-if="info.badge">
        {{ info.badge }}
      </div>
    </div>
    <div
      class="pkg-cell-card__wrapper card--border-noconvert"
      :class="{
        'pkg-cell-card__wrapper--highlight': isActive,
      }"
    >
      <div class="main-cell">
        <div class="pkg-name row-text__ellipsis">{{ info.displayName ?? '_' }}</div>
        <div class="pkg-price">
          <span class="pkg-price__symbol">{{ info?.currency === 'CNY' ? '¥' : '$' }}</span>
          {{ parseFloat(((info.price ?? 0) / 100).toFixed(2)) }}
        </div>
      </div>
      <div class="sub-cell">
        <div class="tag-section">
          <div class="package__types">
            <template v-if="info.skuType === SkuType.gsmdata">
              <div class="package-tag" v-if="info.months === 0 && info.days !== 0">
                {{ $t('cloud-storage.service-duration-day', { count: info.days }) }}
              </div>
              <div class="package-tag" v-else
                >{{ $t('cloud-storage.service-duration', { count: info.months }) }}
              </div>
              <div class="package-tag">{{
                info.dataType === TrafficType.limited
                  ? computeTrafficDataSizeDisplayName((info.dataTotal ?? 0) * 1024)
                  : $t('traffic.unlimted')
              }}</div>
            </template>
            <template v-if="info.skuType === SkuType.cs">
              <div class="package-tag"
                >{{ $t('cloud-storage.storage-tag', { count: info.lifecycle }) }}
              </div>
              <div class="package-tag" v-if="info.months === 0 && info.days !== 0">
                {{ $t('cloud-storage.service-duration-day', { count: info.days }) }}
              </div>
              <div class="package-tag" v-else
                >{{ $t('cloud-storage.service-duration', { count: info.months }) }}
              </div>
              <div v-if="[1, 2, 3].includes(info.recordType)" class="package-tag">{{
                info.recordType === 1
                  ? $t('cloud-storage.event-record-type')
                  : $t('cloud-storage.all-time-record-type')
              }}</div>
            </template>
          </div>
        </div>
        <div class="pkg-old-price" v-if="info.originalPrice && info.price !== info.originalPrice">
          {{ info?.currency === 'CNY' ? '¥' : '$' }}
          {{ parseFloat(((info.originalPrice ?? 0) / 100).toFixed(2)) }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { SkuType, TrafficType } from '@/stores/modules/types/purchase';
  import { computeTrafficDataSizeDisplayName } from '@/utils/formatter';

  defineProps({
    info: {
      type: Object as PropType<PurchasePackage>,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: false,
    },
  });
</script>

<style scoped lang="less">
  @import '../common.less';
  @primary-color: #232323;
  @active-color: #247cff;

  .pkg-cell-card {
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
        background: linear-gradient(270deg, #5178ff 0%, #37dbff 100%);

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

    .pkg-cell-card__wrapper {
      display: flex;
      flex-direction: column;
      border-radius: 10px;
      overflow: hidden;
      transition: 0.36s all;
      position: relative;
      padding: 19px;

      .main-cell {
        display: flex;
        align-items: center;

        .pkg-name {
          flex: 1;
          font-weight: 500;
          font-size: 17px;
          color: #232323;
        }

        .pkg-price {
          color: @primary-color;
          font-weight: 500;
          font-size: 19px;
          color: #232323;
          display: flex;
          align-items: baseline;
          &__symbol {
            font-weight: 500;
            font-size: 15px !important;
            margin-right: 4px;
          }
        }
      }

      .sub-cell {
        display: flex;
        align-items: center;
        margin-top: 4px;
        font-weight: 400;
        font-size: 12px;
        color: #8f8f8f;

        .tag-section {
          flex: 1;
          .package__types {
            flex: 1;
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            .package-tag {
              margin-top: 4px;
              &:not(&:last-child) {
                padding-right: 6px;
                margin-right: 6px;
                border-right: 1px solid #8f8f8f;
              }
            }
          }
        }

        .pkg-old-price {
          text-decoration: line-through;
          flex-shrink: 0;
        }
      }

      &--highlight {
        border-color: @active-color !important;
        background: linear-gradient(
          90deg,
          rgba(234, 240, 255, 0.21) 0%,
          rgba(143, 219, 255, 0.14) 100%
        );

        .pkg-price {
          color: @active-color !important;
        }
      }
    }

    .card--border-noconvert {
      border: 2px solid rgba(35, 35, 35, 0.05);
    }
  }
</style>
