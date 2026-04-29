<template>
  <div class="device-selecter" id="device-selecter__box">
    <div
      class="device-item"
      :class="{
        'device-item__active': item.sn == selectDeviceSN,
      }"
      v-for="item of deviceList"
      :key="item.sn"
      @click="() => handleClickDeviceItem(item)"
    >
      <div class="device-item-name">{{ item.name ?? '_' }}</div>

      <div class="device-item-sn"> DID: {{ item.sn ?? '_' }} </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { useCloudStorageStore } from '@/stores';
  import { storeToRefs } from 'pinia';

  const { deviceList, selectDeviceSN } = storeToRefs(useCloudStorageStore());

  function handleClickDeviceItem(item: UserDeviceInfo) {
    selectDeviceSN.value = item.sn;
    // 查询云存信息
  }
</script>

<style lang="less" scoped>
  .device-selecter {
    display: flex;
    flex-wrap: nowrap;
    overflow: auto;
    height: 68px;
    margin-top: 13px;
    .device-item {
      display: flex;
      align-items: start;
      flex-direction: column;
      justify-content: center;
      flex-shrink: 0;

      position: relative;

      margin-right: 13px;
      width: 168px;
      height: 68px;
      padding: 10px;
      color: #fff;
      border-radius: 13px;
      background: linear-gradient(45deg, #1c1c1c, #a4a4a4);
      box-shadow: 0 0 6px rgba(0, 0, 0, 0.2);

      .device-item-name {
        font-size: 15px;
        width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .device-item-sn {
        font-size: 12px;
        width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      &:last-child {
        margin-right: 0;
      }
    }

    .device-item__active {
      &::before {
        content: '';
        position: absolute;
        border: 3px #fff solid;
        border-radius: 13px;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
      }
    }
  }
</style>
