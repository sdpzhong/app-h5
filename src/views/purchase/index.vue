<template>
  <div class="purchase van-safe-area-bottom">
    <!-- top device info section -->
    <div class="purchase__header">
      <div class="device-info">
        <template v-if="selectDevice">
          <div class="device-info__name-wrapper">
            <span class="device-info__name row-text__ellipsis">{{
              selectDevice?.name ?? '_'
            }}</span>
            <img
              class="device-info__switch"
              src="/src/assets/images/purchase/icon-switch.png"
              alt=""
              v-if="isAllowChangeDevice"
              @click="() => (bottomSheetVisiable = true)"
            />
          </div>
          <div class="device-info__did-wrapper">
            <div class="device-info__did row-text__ellipsis"
              >DID: {{ selectDevice?.sn ?? '_' }}
            </div>
            <CopyTextButton :value="selectDevice?.sn" is-tip />
          </div>
        </template>
      </div>
    </div>
    <div class="purchase__main">
      <!-- tab bar -->
      <div class="tabbar-section">
        <img
          v-if="tabbarList.length > 3"
          class="tabbar__switch-btn"
          src="/src/assets/images/purchase/icon-left.png"
          alt=""
        />
        <div class="purchase-tabbar">
          <div
            class="purchase-tabbar__item"
            :class="{
              'purchase-tabbar__item--active': item.key === currentPackageType,
            }"
            v-for="item of tabbarList"
            :key="item.key"
            @click="purchaseStore.handleSelectPackageType(item.key)"
          >
            <div
              class="tabber-item__label row-text__ellipsis"
              :class="{
                'show-dot': item.dot,
              }"
            >
              <span> {{ item.label }} </span>
            </div>
            <div class="tabber-item__line"> </div>
          </div>
        </div>
        <img
          v-if="tabbarList.length > 3"
          class="tabbar__switch-btn"
          src="/src/assets/images/purchase/icon-right.png"
          alt=""
        />
      </div>
      <!-- tab page -->
      <div class="purchase-tabbar-content">
        <template v-if="currentPackageType === SkuType.combo">
          <GroupPackageTabPage />
        </template>
        <template v-else-if="currentPackageType === SkuType.gsmdata">
          <GsmDataPackageTabPage />
        </template>
        <template v-else-if="currentPackageType === SkuType.cs">
          <CloudStoragePackageTabePage />
        </template>
      </div>
    </div>

    <!-- bottom settlement bar -->
    <div class="purchase__footer">
      <SettlementBar />
    </div>
    <!--  设备选择弹窗 -->
    <van-popup v-model:show="bottomSheetVisiable" round closeable position="bottom">
      <DeviceSelectBottomSheet @close-bottom-sheet="closeBottomSheet" />
    </van-popup>
  </div>
</template>

<script setup lang="ts">
  import CloudStoragePackageTabePage from './tab-page/CloudStoragePackageTabePage.vue';
  import GroupPackageTabPage from './tab-page/GroupPackageTabPage.vue';
  import GsmDataPackageTabPage from './tab-page/GsmDataPackageTabPage.vue';
  import SettlementBar from './components/SettlementBar.vue';
  import { usePurchaseStore } from '@/stores';
  import { storeToRefs } from 'pinia';
  import { SkuType } from '@/stores/modules/types/purchase';
  import { ref } from 'vue';
  import DeviceSelectBottomSheet from './components/DeviceSelectBottomSheet.vue';

  const purchaseStore = usePurchaseStore();
  const { tabbarList, currentPackageType, isAllowChangeDevice, selectDevice } =
    storeToRefs(purchaseStore);

  const bottomSheetVisiable = ref(false);

  function closeBottomSheet() {
    bottomSheetVisiable.value = false;
  }
</script>

<style scoped lang="less">
  .purchase {
    display: flex;
    flex-direction: column;
    // background-image: url('/src/assets/images/purchase/purchase-bg.png');
    // background-repeat: no-repeat;
    // background-size: contain;
    // background-position: center -50px;
    // background-position: top;

    .purchase__header {
      .device-info {
        height: 115px;
        padding: 19px;
        display: flex;
        flex-direction: column;
        justify-content: center;

        .device-info__name-wrapper {
          display: flex;
          align-items: center;
          margin-bottom: 4px;
          max-width: 180px;
          width: fit-content;

          .device-info__name {
            flex: 1;
            font-size: 14px;
            color: #404c79;
            font-weight: 400;
          }

          .device-info__switch {
            display: block;
            width: 19px;
            height: 19px;
            object-fit: contain;
            margin-left: 10px;
            transition: 0.266s opacity;

            &:active {
              opacity: 0.6;
            }
          }
        }

        .device-info__did-wrapper {
          display: flex;
          align-items: center;
          max-width: 180px;
          width: fit-content;

          .device-info__did {
            flex: 1;
            font-size: 11px;
            color: #404c79;
            font-weight: 400;
            margin-right: 4px;
          }
        }
      }
    }

    .purchase__main {
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow: hidden;

      .tabbar-section {
        display: flex;
        align-items: center;
        padding: 15px 19px;

        .tabbar__switch-btn {
          display: block;
          height: 10px;
          width: 10px;
          object-fit: contain;
          transition: 0.266s opacity;

          &:active {
            opacity: 0.6;
          }
        }

        .purchase-tabbar {
          flex: 1;
          display: flex;
          align-items: center;

          .purchase-tabbar__item {
            flex-basis: 33.33%;
            flex-grow: 1;
            display: flex;
            flex-direction: column;
            align-items: center;
            flex-shrink: 0;
            overflow: hidden;
            padding: 0 6px;

            .tabber-item__label {
              width: 100%;
              color: #404c79;
              font-size: 14px;
              opacity: 0.6;
              font-weight: 400;
              text-align: center;
              transition: 0.25s opacity;

              > span {
                position: relative;
              }

              &.show-dot > span::before {
                content: '';
                position: absolute;
                top: 0px;
                right: -10px;
                width: 6px;
                height: 6px;
                border-radius: 3px;
                background-color: #ff2c2c;
              }

              .tabber-item__dot {
                position: absolute;
                top: 4px;
                right: 4px;
                width: 6px;
                height: 6px;
                border-radius: 3px;
                background-color: #ff2c2c;
              }
            }

            .tabber-item__line {
              width: 0;
              height: 2px;
              background-color: #404c79;
              border-radius: 1px;
              margin-top: 4px;
              transition: 0.25s width;
            }

            &--active {
              .tabber-item__label {
                opacity: 1;
              }

              .tabber-item__line {
                width: 16px;
              }
            }

            .show-dot {
              & > span::before {
                visibility: visible !;
              }
            }
          }
        }
      }

      .purchase-tabbar-content {
        flex: 1;
        overflow-x: hidden;
        overflow-y: auto;
        // padding: 19px;
        background: #f9f9f9;
        border-radius: 22px 22px 0px 0px;
      }
    }
  }
</style>
