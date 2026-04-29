<template>
  <div class="package-selecter">
    <div class="package-type-tabs">
      <div @click="tabChange(2)" :class="selectPackageType === 2 ? 'actleft' : 'left'">{{
        $t('cloud-storage.event-record')
      }}</div>
      <div @click="tabChange(1)" :class="selectPackageType === 1 ? 'actright' : 'right'">{{
        $t('cloud-storage.all-time-record')
      }}</div>
    </div>
    <div class="package-display">
      <div class="package-select-list__loading" v-if="packageListLoading">
        <van-loading size="24px" vertical>{{ $t('cloud-storage.loading') }}</van-loading>
      </div>
      <div class="package-select-area" v-else ref="packageSelectListBoxRef">
        <div class="package-select-list">
          <div
            class="package-select-list-item-container"
            v-for="item of displayPackageList"
            :key="item.id"
            @click="selectPackageId = item.id"
          >
            <div
              class="package-select-list-item-container__badge row-text__ellipsis"
              :style="{
                maxWidth: displayPackageList.length < 3 ? '2.7467rem' : '2.6667rem',
              }"
              v-if="item.badge"
              >{{ item.badge }}</div
            >
            <div
              class="package-select-list-item"
              :class="{
                'package-select-list-item__active': selectPackageId === item.id,
              }"
              :style="{
                maxWidth: displayPackageList.length < 3 ? '2.7467rem' : '2.6667rem',
              }"
            >
              <div class="package-select-list-item__main">
                <div class="package-select-list-item__name row-text__ellipsis">
                  {{ item.displayName || $t('cloud-storage.other-package') }}
                </div>

                <div class="package-price-display">
                  <div class="package-select-list-item__price row-text__ellipsis">
                    {{ item.price / 100 }}
                    <span
                      class="package-select-list-item__original-price"
                      :hidden="item.originalPrice == item.price"
                    >
                      {{ item.originalPrice / 100 }}
                    </span>
                  </div>
                </div>

                <!-- <div class="package-select-list-item__service-day row-text__ellipsis">
                  循环存储{{ item.lifecycle }}天
                </div> -->
                <div class="package-select-list-item__service-day row-text__ellipsis">
                  {{ item.name }}
                </div>
              </div>
              <div class="package-select-list-item__footer">
                <div class="row-text__ellipsis" :hidden="item.originalPrice == item.price">{{
                  $t('cloud-storage.discount-price', [(item.originalPrice - item.price) / 100])
                }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="package-favorable-row">
      <div class="package-favorable-row__left">
        <van-icon name="coupon-o" color="#FF6203" size="0.48rem" />
        &nbsp;{{ $t('cloud-storage.discount') }}
      </div>

      <div class="package-favorable-row__right"> {{ $t('cloud-storage.no-discount') }} </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { useCloudStorageStore } from '@/stores';
  import { storeToRefs } from 'pinia';
  import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue';
  import { useRoute } from 'vue-router';

  const route = useRoute();

  const { recommendList, selectPackageId, packageListLoading } = storeToRefs(
    useCloudStorageStore(),
  );

  const selectPackageType = ref(2);

  const packageSelectListBoxRef = ref<HTMLDivElement>();

  const displayPackageList = computed(() => {
    const arr = recommendList.value.filter((e) => e.recordType == selectPackageType.value);
    return arr;
  });

  async function tabChange(index: number, pkgId?: number) {
    selectPackageType.value = index;

    if (displayPackageList.value.length) {
      selectPackageId.value = pkgId ?? displayPackageList.value[0].id;
      await nextTick();
      packageSelectListBoxRef.value?.scrollTo(0, 0);
    }
  }

  const stopHandle = watch(
    () => recommendList.value,
    () => {
      console.log('recommendList: ', recommendList.value.length);
      if (recommendList.value.length) {
        const pkgId = route.query['pkgId'] ?? '';

        if (pkgId) {
          const itemIndex = recommendList.value.findIndex((e) => e.id + '' === pkgId);

          console.log('itemIndex: ', itemIndex, pkgId);
          if (itemIndex != -1) {
            const pkgInfo = recommendList.value[itemIndex];
            recommendList.value.splice(itemIndex, 1);
            recommendList.value.unshift(pkgInfo);

            tabChange(pkgInfo.recordType);
          }
        }

        stopHandle();
      }
    },
    {
      flush: 'post',
    },
  );

  onBeforeUnmount(() => {
    stopHandle();
  });
</script>

<style scoped lang="less">
  .package-selecter {
    width: 100%;
    // height: 270px;
    background-color: #fff;
    border-radius: 13px;
    margin: 13px 0;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);

    display: flex;
    flex-direction: column;

    .package-type-tabs {
      display: flex;
      justify-content: space-between;
      border-radius: 20px;
      background-color: #e1e1e1;

      div {
        transition: color 0.5s;
        font-size: 15px;
        font-weight: 500;
      }

      .actleft,
      .right {
        text-align: center;
        width: 50%;
        background-color: white;
        border-radius: 10px 10px 0 0;
        padding: 10px;
      }
      .actleft {
        z-index: +1;
        position: relative;
      }
      .actleft::after {
        content: '';
        animation: opacityAct 0.5s forwards;
        position: absolute;
        right: -20px;
        bottom: 0px;
        width: 20px;
        height: 20px;
        background-color: #e1e1e1;
        border-radius: 50%;
        box-shadow: white -10px 10px 0px 0px;
      }
      .right {
        border-radius: 10px 10px 0 10px;
        background-color: #e1e1e1;
        color: #000;
        overflow: hidden;
      }

      .left,
      .actright {
        text-align: center;
        width: 50%;
        background-color: white;
        border-radius: 10px 10px 0 0;
        padding: 10px;
      }
      .actright {
        z-index: +1;
        position: relative;
      }
      .actright::after {
        content: '';
        position: absolute;
        left: -20px;
        bottom: 0px;
        width: 20px;
        height: 20px;
        background-color: #e1e1e1;
        border-radius: 50%;
        box-shadow: white 10px 10px 0px 0px;
      }
      .left {
        border-radius: 10px 10px 10px 0px;
        color: #000;
        background-color: #e1e1e1;
        overflow: hidden;
      }
    }

    .package-display {
      flex: auto;

      .package-select-area {
        // height: 120px;
        margin: 10px;
        display: flex;
        align-items: center;
        overflow: auto;
        overflow-y: hidden;

        .package-select-list {
          display: flex;
          align-items: center;
          flex-wrap: nowrap;
          flex-shrink: 0;

          .package-select-list-item-container {
            margin-top: 8px;
            position: relative;

            .package-select-list-item-container__badge {
              position: absolute;
              height: 16px;
              max-width: 103px;
              line-height: 16px;
              top: -8px;
              font-size: 10px;
              color: white;
              padding: 0 8px;
              border-radius: 8px 8px 8px 0;
              background-color: #ff6203;
              z-index: 1;
            }

            .package-select-list-item {
              margin-right: 10px;
              padding: 4px;
              width: 103px;
              height: 116px;
              background-color: #e1e1e1;
              border-radius: 8px;
              display: flex;
              flex-direction: column;

              .package-select-list-item__main {
                box-sizing: border-box;
                height: 90px;
                border-radius: 10px;
                display: flex;
                flex-direction: column;
                align-items: center;

                .package-select-list-item__name {
                  width: 100%;
                  font-size: 12px;
                  font-weight: 900;
                  text-align: center;
                  padding-top: 12px;
                }

                .package-price-display {
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  flex: auto;
                  .package-select-list-item__price {
                    width: 100%;
                    // flex: auto;
                    text-align: center;
                    font-size: 19px;
                    line-height: 19px;
                    color: #000;
                    position: relative;
                    display: flex;
                    align-items: baseline;
                    justify-content: center;
                    font-weight: 500;

                    .package-select-list-item__original-price {
                      color: #656565;
                      text-decoration: line-through;
                      font-size: 12px;
                      line-height: 12px;
                      margin-left: 4px;
                      font-weight: 400;
                    }

                    &::before {
                      content: '¥';
                      position: relative;
                      font-size: 12px;
                      margin-right: 2px;
                    }
                  }
                }

                .package-select-list-item__service-day {
                  width: 100%;
                  color: #010101;
                  font-size: 10px;
                  text-align: center;
                  box-sizing: border-box;
                  padding-bottom: 6px;
                }
              }

              .package-select-list-item__footer {
                flex: auto;
                font-size: 12px;
                display: flex;
                align-items: center;
                justify-content: center;
                visibility: hidden;
              }
            }

            .package-select-list-item__active {
              background-color: #2c70ff;

              .package-select-list-item__main {
                background-color: #dae5ff;
              }

              .package-select-list-item__footer {
                color: #fff;
                visibility: visible;
              }
            }
          }
        }

        &:last-child {
          margin-right: 0;
        }
      }

      .package-select-list__loading {
        height: 140px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #fff;
      }
    }

    .more-package-row {
      margin: 10px;
      font-size: 12px;
      display: flex;
      justify-content: space-between;
      align-items: center;

      .more-package-row__desc {
        flex: auto;
        color: #808080;
      }

      .more-package-link-btn {
        color: #ff6203;
        text-decoration: underline;
        padding-left: 10px;
        user-select: none;
        cursor: pointer;
      }
    }

    .package-favorable-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin: 0 10px;
      padding: 10px 0;
      border-top: 1px dashed #808080;
      font-size: 12px;

      .package-favorable-row__left {
        display: flex;
        align-items: center;
        font-size: 12px;
        line-height: 12px;
      }

      .package-favorable-row__right {
        color: #808080;
      }
    }
  }

  .more-package-bottom-sheet {
    overflow: visible;
    &::before {
      content: attr(data-title);
      position: absolute;
      top: -30px;
      width: 80px;
      height: 60px;
      margin-left: 13px;
      line-height: 75px;
      z-index: 100;
      color: #2c70ff;
      font-size: 12px;
      font-weight: bold;
      text-align: center;
      // background-color: red;
      background: transparent url('/src/assets/icons/icon_cloud.png') no-repeat;
      background-size: contain;
      background-position: center center;
    }
  }
</style>
