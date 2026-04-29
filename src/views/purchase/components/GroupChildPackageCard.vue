<template>
  <div class="group-child-package-card">
    <img
      src="/src/assets/images/4g.png"
      alt=""
      class="left-icon"
      v-if="info.skuType === SkuType.gsmdata"
    />
    <img src="/src/assets/images/yun.png" class="left-icon" alt="" v-else />
    <div class="main-section">
      <div class="package-name row-text__ellipsis">{{ info.displayName ?? '_' }}</div>
      <div class="package-tags">
        <van-space wrap :size="['0.1067rem', '0.1067rem']">
          <div class="group-package-tag" v-if="info.months === 0 && info.days !== 0">
            {{ $t('cloud-storage.service-duration-day', { count: info.days }) }}
          </div>
          <div class="group-package-tag" v-else
            >{{ $t('cloud-storage.service-duration', { count: info.months }) }}
          </div>
          <template v-if="info.skuType === SkuType.cs">
            <div class="group-package-tag"
              >{{ $t('cloud-storage.storage-tag', { count: info.lifecycle }) }}
            </div>
            <div v-if="[1, 2, 3].includes(info.recordType)" class="group-package-tag">{{
              info.recordType === 1
                ? $t('cloud-storage.event-record-type')
                : $t('cloud-storage.all-time-record-type')
            }}</div>
          </template>
          <template v-if="info.skuType === SkuType.gsmdata">
            <div class="group-package-tag">{{
              info.dataType === TrafficType.limited
                ? computeTrafficDataSizeDisplayName((info.dataTotal ?? 0) * 1024)
                : $t('traffic.unlimted')
            }}</div>
          </template>
        </van-space>
      </div>
    </div>
    <div class="package-price"
      >{{ info?.currency === 'CNY' ? '¥' : '$'
      }}{{ parseFloat((((info.originalPrice ?? 0) - (info.price ?? 0)) / 100).toFixed(2)) }}</div
    >
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
  });
</script>

<style scoped lang="less">
  .group-child-package-card {
    display: flex;
    align-items: center;
    min-height: 58px;
    padding: 13px;
    background: rgba(35, 149, 255, 0.03);
    border-radius: 10px 10px 10px 10px;

    .left-icon {
      display: block;
      width: 35px;
      height: 35px;
      object-fit: contain;
    }

    .main-section {
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      margin: 0 8px;

      .package-name {
        font-weight: 500;
        font-size: 12px;
        color: #232323;
        margin-bottom: 4px;
      }

      .package-tags {
        font-weight: 400;
        font-size: 9px;
        color: #247cff;
      }
    }

    .package-price {
      font-weight: 400;
      font-size: 12px;
      color: #8f8f8f;
    }
  }
</style>
