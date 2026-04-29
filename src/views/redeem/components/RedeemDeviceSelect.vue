<template>
  <div class="redeem-device-select-comp">
    <template v-if="deviceList?.length">
      <!-- <template v-for="item of deviceList" :key="item.value">{{ item }}</template>
     -->

      <div class="device-list-area">
        <div
          class="select-item"
          v-for="deviceItem of deviceList"
          :key="deviceItem.sn"
          :class="{
            'select-item__active': activeSn == deviceItem.sn,
          }"
        >
          <div class="select-item-title"> {{ deviceItem.name }}</div>
          <div class="select-item-title"> DID: {{ deviceItem.sn }} </div>

          <div
            class="select-item-card"
            @click="() => $emit('handleClickDeviceCard', deviceItem.sn)"
          >
            <!--  :src="deviceCoverMap[deviceItem.sn]" -->
            <van-image
              :src="deviceCoverMap[deviceItem.sn] ?? 'error'"
              class="device-img"
              fit="cover"
              radius="8"
              error-icon="/src/assets/images/device_empty.png"
            >
              <template v-slot:loading>
                <van-loading type="spinner" size="20" />
              </template>
              <template v-slot:error>
                <img
                  src="/src/assets/images/device_empty.png"
                  style="object-fit: cover; height: 100%; border-radius: 8px"
                  alt="... "
                />
              </template>
            </van-image>
            <div class="border-container"> </div>
          </div>
        </div>
      </div>
    </template>

    <template v-else>
      <van-empty image-size="100" description="您暂时还未绑定任何设备" />
    </template>
  </div>
</template>

<script setup lang="ts">
  import { useRedeemStore } from '@/stores';
  import { computed } from 'vue';

  defineProps({
    activeSn: {
      type: String,
      required: true,
    },
  });

  defineEmits<{
    (event: 'handleClickDeviceCard', sn: string): void;
  }>();

  const redeemStore = useRedeemStore();

  const deviceList = computed(() => redeemStore.deviceList);

  const deviceCoverMap = computed(() => redeemStore.deviceCoverMap);
</script>

<style lang="less" scoped>
  .redeem-device-select-comp {
    .device-list-area {
      display: flex;
      flex-wrap: nowrap;
      overflow: auto;
      padding-bottom: 6px;

      .select-item {
        margin-right: 13px;
        width: 112px * (16/9);
        flex-shrink: 0;

        .select-item-title {
          width: 100%;
          color: #232323;
          font-size: 12px;
          font-weight: 500;
          line-height: 14px;
          padding-bottom: 4px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .select-item-card {
          height: 112px;
          width: 100%;
          background-color: #f1f1f1;
          border-radius: 8px;
          position: relative;

          .border-container {
            position: absolute;
            height: 100%;
            width: 100%;
            border-radius: 8px;
          }

          .device-img {
            position: absolute;
            top: 0;
            bottom: 0;
            left: 0;
            right: 0;
          }
        }
      }

      .select-item__active {
        .border-container {
          border: 3px #247cff solid;
        }
      }
    }
  }
</style>
