<template>
  <div class="pilot-lamp-status-introduction van-safe-area-bottom">
    <div class="inner-box">
      <van-cell-group
        inset
        v-for="(groupItem, groupIndex) of renderGroup"
        :key="groupIndex"
        :name="groupIndex"
      >
        <template #title>
          <div class="cell-group__title-wrapper">
            <div class="title-wrapper__left">{{ groupItem.title }}</div>
            <div class="title-wrapper__right" v-if="groupItem.positionInfo">
              <van-icon name="guide-o" @click="showDialog(groupItem.positionInfo!)" />
            </div>
          </div>
        </template>
        <van-collapse v-model="activeKeys">
          <van-collapse-item
            v-for="(option, index) of groupItem.options"
            :key="groupIndex + '-' + index"
            :name="groupIndex + '-' + index"
          >
            <template #title>
              <div class="cell-title__wrapper">
                <CircleDot :colors="colors" v-for="(colors, index) of option.colors" :key="index" />
                <div class="cell-title-content">
                  {{ option.label }}
                </div>
              </div>
            </template>
            {{ option.desc }}
          </van-collapse-item>
        </van-collapse>
      </van-cell-group>
    </div>
    <van-popup v-model:show="showBottom" class="popup-wrapper" round position="bottom">
      <div class="popup-inner-box">
        <div class="inner-box__title">{{ $t('gsmdata.ll-position-title') }}</div>
        <img
          class="inner-box__cover"
          v-show="positionInfo?.cover"
          :src="positionInfo?.cover"
          alt=""
        />
        <div class="inner-box__desc">{{ positionInfo?.desc }}</div>
        <van-button type="primary" round block @click="showBottom = false">{{
          $t('traffic.know')
        }}</van-button>
      </div>
    </van-popup>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue';
  import CircleDot from './components/CircleDot.vue';
  import { useDevicePilotLamp } from './useDevicePilotLamp';
  import type { PositionIntroduction } from './common';

  const activeKeys = ref([]);
  const { renderGroup } = useDevicePilotLamp();
  const showBottom = ref(false);
  const positionInfo = ref<PositionIntroduction>();

  function showDialog(info: PositionIntroduction) {
    positionInfo.value = info;
    showBottom.value = true;
  }
</script>

<style scoped lang="less">
  .pilot-lamp-status-introduction {
    background-color: #f8f8f8;

    .cell-group__title-wrapper {
      display: flex;
      align-items: center;
      padding: 0 8px;

      .title-wrapper__left {
        flex: 1;
        overflow: hidden;
        margin-right: 6px;
      }
    }

    .inner-box {
      height: 100%;
      width: 100%;
      padding-bottom: 32px;
      overflow-y: auto;
      overflow-x: hidden;
      background-color: #f8f8f8;
    }

    .cell-title__wrapper {
      display: flex;
      align-items: center;

      & > div {
        flex-shrink: 0;
      }

      .cell-title-content {
        flex: 1;
        overflow: hidden;
        line-height: normal;
      }
    }
  }

  .popup-wrapper {
    background-color: transparent;
    padding: 13px;
  }

  .popup-inner-box {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 24px 16px;
    background-color: #fff;
    border-radius: 8px;
    // min-height: 412px;

    .inner-box__title {
      font-weight: bold;
      font-size: 14px;
      color: #232323;
      font-style: normal;
      text-transform: none;
    }

    .inner-box__cover {
      height: 186px;
      object-fit: contain;
      margin: 12px 0;
    }

    .inner-box__desc {
      font-weight: 400;
      font-size: 13px;
      color: #232323;
      margin: 22px 0 38px;
    }
  }
</style>
