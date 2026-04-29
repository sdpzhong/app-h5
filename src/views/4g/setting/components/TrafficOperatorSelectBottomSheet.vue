<template>
  <van-popup
    v-model:show="showPopup"
    position="bottom"
    :close-on-click-overlay="false"
    class="toast-popup"
  >
    <div class="inner-box">
      <div class="toast-title">{{ $t('gsmdata.operator-switch.select-title') }}</div>
      <div class="operator-select-section">
        <div
          class="operator-option__wrapper select-border-noconvert"
          :class="{
            active: item.operatorId === selectItem,
          }"
          v-for="item of groupList"
          :key="item.operatorId"
          @click="selectItem = item.operatorId"
        >
          <div class="operator-option">
            <div class="operator-option__pic">
              <img v-if="item.operatorIconUrl" class="opt-img" :src="item.operatorIconUrl" alt="" />
              <span class="opt-name">{{ item.operatorName }}</span>
            </div>
          </div>
          <div v-if="item.lastUsed" class="opt-tag">{{ $t('gsmdata.opt-tag-lastuse') }}</div>
          <div class="opt-tag recommond" v-else-if="item.recommend">
            <img
              class="recommond-icon"
              src="/src/assets/images/cloud-storage/icon_hot.png"
              alt=""
              srcset=""
            />
            {{ $t('gsmdata.opt-tag-recommend') }}</div
          >
        </div>
      </div>
      <!-- <div class="toast-btn" @click="handleOperatorSelect">{{ '确认选择' }}</div> -->
      <van-button type="primary" block :disabled="!selectItem" @click="handleOperatorSelect">{{
        $t('gsmdata.operator-switch.confirm-select')
      }}</van-button>
    </div>
  </van-popup>
</template>

<script setup lang="ts">
  import { ref, watch } from 'vue';

  const props = defineProps({
    groupList: {
      type: Object as PropType<EsimGroup[]>,
      required: true,
    },
    currentItem: {
      type: String,
    },
  });

  const selectItem = ref<string>();
  const showPopup = ref<boolean>(false);

  function handleOperatorSelect() {
    emit('onSelect', selectItem.value!);
    showPopup.value = false;
  }

  const emit = defineEmits<{
    (event: 'onSelect', id: string): void;
  }>();

  watch(
    () => showPopup.value,
    () => {
      if (showPopup.value) {
        if (props.groupList.length) {
          selectItem.value = props.groupList[0].operatorId;
        }
      }
    },
  );

  defineExpose({
    showPopup,
  });
</script>

<style scoped lang="less">
  .toast-popup {
    background-color: transparent;
    padding: 22px 16px;

    .inner-box {
      padding: 16px;
      min-height: 300px;
      display: flex;
      flex-direction: column;
      align-items: center;
      background: linear-gradient(180deg, #edf8ff 0%, #ffffff 100%);
      border-radius: 8px;

      .toast-title {
        width: 100%;
        font-weight: bold;
        padding: 13px 0;
        font-size: 14px;
        color: #232323;
        text-align: center;
        font-style: normal;
        text-transform: none;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .operator-select-section {
        flex: 1;
        width: 100%;
        display: flex;
        flex-direction: column;
        margin-bottom: 20px;

        .select-border-noconvert {
          border: 2px solid transparent;
        }

        .operator-option__wrapper {
          position: relative;
          border-radius: 6px;

          &:not(&:last-child) {
            margin-bottom: 10px;
          }

          .opt-tag {
            position: absolute;
            top: 0;
            right: 0;
            padding: 2px 6px;
            background: linear-gradient(to right, #247cff, #60a0ff);
            color: white;
            font-size: 10px;
            font-weight: 400;
            border-radius: 0 6px 0 6px;
            display: flex;
            align-items: center;
          }

          .opt-tag.recommond {
            background: linear-gradient(to right, #f13c3c, #faa43f);
          }

          .recommond-icon {
            display: block;
            width: 15px;
            height: 15px;
            object-fit: contain;
            margin-right: 2px;
          }

          &.active {
            border-color: #247cff;
          }
        }

        .operator-option {
          width: 100%;
          height: 50px;
          border-radius: 6px;
          padding: 10px;
          display: flex;
          align-items: center;
          background-color: #fff;
          transition: border-color 250ms;

          .operator-option__pic {
            display: flex;
            align-items: center;

            .opt-name {
              flex: 1;
              margin-left: 8px;
              font-size: 12px;
              font-weight: 500;
              color: #232323;
            }
          }

          .opt-img {
            display: block;
            height: 32px;
            width: 96px;
            object-fit: contain;
          }
        }
      }

      .toast-btn {
        width: 100%;
        padding: 13px;
        font-weight: 400;
        font-size: 13px;
        color: #ffffff;
        line-height: 16px;
        text-align: left;
        font-style: normal;
        text-transform: none;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #247cff;
        border-radius: 5px;
        transition: 0.36s opacity;

        &:active {
          opacity: 0.6;
        }
      }
    }
  }
</style>
