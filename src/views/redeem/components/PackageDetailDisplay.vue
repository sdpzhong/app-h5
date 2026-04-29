<template>
  <div class="package-info-display-conatiner">
    <div class="left-area">
      <span class="package-info-title"> {{ $t('redeem-code.pkg-label') }} </span>
    </div>
    <div class="right-area">
      <div class="package-info-display" v-if="cloudStorageStatusInfo">
        <div class="package-name">
          {{ cloudStorageStatusInfo?.packageNameDisplay ?? '' }}
        </div>
        <!-- <div class="package-service-time">
          {{ serviceDayText }}
        </div> -->
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { useRedeemStore } from '@/stores';
  import { computed } from 'vue';
  // import Dayjs from 'dayjs';

  const props = defineProps({
    slectDeviceSn: {
      type: String,
    },
  });

  const redeemStore = useRedeemStore();

  const cloudStorageStatusInfo = computed(
    () => redeemStore.packageServiceMap[props.slectDeviceSn ?? ''],
  );

  // const serviceDayText = computed<string>(() => {
  //   const endTime = cloudStorageStatusInfo.value?.endTime ?? Date.now();
  //   const startTime = cloudStorageStatusInfo.value?.startTime ?? Date.now();

  //   return `${Dayjs(startTime).format('YYYY-MM-DD')} - ${Dayjs(endTime).format('YYYY-MM-DD')}`;
  // });
</script>

<style scoped lang="less">
  .package-info-display-conatiner {
    min-height: 78px;
    display: flex;
    background: linear-gradient(to left, #dfe9f1, #a3c4d7);
    border-radius: 8px;
    .left-area {
      flex-shrink: 0;
      width: 120px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-right: 1px dashed #dfe9f1;
      .package-info-title {
        font-size: 14px;
        line-height: 14px;
        color: #0b1834;
        font-weight: 500;
        text-align: center;
      }
    }

    .right-area {
      flex: auto;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      padding: 6px;

      .package-info-display {
        // overflow: hidden;
        // text-overflow: ellipsis;
        // white-space: nowrap;
        .package-name {
          font-weight: 500;
          font-size: 12px;
          color: #0b1834;
          line-height: 14px;
          margin-bottom: 4px;
          text-align: center;
        }

        .package-service-time {
          font-weight: 500;
          font-size: 12px;
          color: #247cff;
          line-height: 14px;
          font-style: normal;
        }
      }
    }
  }
</style>
