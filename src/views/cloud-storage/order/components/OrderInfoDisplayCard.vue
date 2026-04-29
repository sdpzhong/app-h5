<template>
  <div class="order-display-card">
    <div class="order-display-card__header">
      <div class="order-card__title">{{ cardHeaderTitle }}</div>
      <div
        class="service-status"
        :class="{
          error: orderInfo.tradeStatus === OrderStatusConstantClass.FAILEDP,
          warning: orderInfo.tradeStatus === OrderStatusConstantClass.NOTPAY,
        }"
        >{{ orderStatus.desc }}</div
      >
    </div>
    <div class="package-info-section__wrapper">
      <div class="package-info-section">
        <div
          class="group-package-card"
          v-for="item of orderInfo.packageInfo.combinedSubList"
          :key="item.packageId"
        >
          <img src="/src/assets/images/4g.png" v-if="item.skuType === skuType.data" alt="" />
          <img src="/src/assets/images/yun.png" v-else alt="" />
          <div class="right-section">
            <div class="right-section__floor-1">
              <div class="right-section__pkg-name row-text__ellipsis">{{
                item.displayName ?? '_'
              }}</div>
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
      <van-divider v-if="orderInfo.packageInfo?.combinedSubList?.length" />
      <div class="order-display-card-body">
        <OrderDisplayComponent
          :label="$t('cloud-storage.create-time')"
          :value="orderInfo.createdAt"
        />
        <OrderDisplayComponent
          :label="$t('cloud-storage.order-id')"
          :value="orderInfo.orderId"
          allow-copy
        />
        <OrderDisplayComponent :label="$t('cloud-storage.sn')" :value="orderInfo.sn" allow-copy />

        <!-- 待支付条提示组件 -->
        <!-- <div class="pending-payment-order-tip">
          <v-icon icon="akar-icons:clock" style="font-size: 0.32rem; margin-right: 0.1067rem" />
          订单即将关闭，建议尽快支付
        </div> -->

        <div
          class="order-more-info"
          :class="{
            collapsed: isCollapsed,
          }"
        >
          <div class="order-more-info__body">
            <OrderDisplayComponent
              :label="$t('cloud-storage.total-price')"
              :value="`${orderInfo?.payerCurrency === 'CNY' ? '¥' : '$'}${(
                orderInfo.price / 100
              ).toFixed(2)}`"
            />
            <!-- `-¥${(orderInfo.discountPrice / 100).toFixed(2)}` -->
            <OrderDisplayComponent :label="$t('cloud-storage.discount-info')">
              <template #value>
                <div class="discount-info">
                  <div
                    class="discount-info-item"
                    v-for="(discountInfo, index) of orderInfo.promotions"
                    :key="index"
                  >
                    <span
                      >-{{ orderInfo?.payerCurrency === 'CNY' ? '¥' : '$'
                      }}{{ (discountInfo.amount / 100).toFixed(2) }}</span
                    >
                    <span v-if="discountInfo.name"
                      >&nbsp;({{
                        (currentLocale === 'zh-CN'
                          ? orderDiscountTypeZhDisplayName[discountInfo.type!]
                          : orderDiscountTypeEnDisplayName[discountInfo.type!]) ??
                        discountInfo.type
                      }})</span
                    >
                  </div></div
                >
              </template>
            </OrderDisplayComponent>
            <OrderDisplayComponent
              :label="$t('cloud-storage.pay-time')"
              :value="orderInfo.payTime"
            />
            <OrderDisplayComponent
              :label="$t('cloud-storage.device-name')"
              :value="orderInfo.deviceName"
            />
          </div>
        </div>
      </div>

      <div class="order-display-card-footer">
        <div class="more-info_btn" v-show="!isCollapsed" @click="handleCollapse"
          >{{ $t('cloud-storage.read-more') }} <van-icon name="arrow-down"
        /></div>

        <div class="price-display-area row-text__ellipsis">
          {{
            orderInfo.tradeStatus === OrderStatusConstantClass.CANCEL
              ? $t('cloud-storage.order-need-price')
              : $t('cloud-storage.order-price')
          }}&nbsp;
          <!-- <span class="price-display-area__price-symbol">¥</span> -->
          <span class="price-display-area__price"
            >{{ orderInfo?.payerCurrency === 'CNY' ? '¥' : '$'
            }}{{ (orderInfo.payerTotal / 100).toFixed(2) }}</span
          >
        </div>
      </div>

      <div class="collapse-action-bar" v-show="isCollapsed" @click="handleCollapse">
        {{ $t('cloud-storage.card-collapse') }} <van-icon name="arrow-up"
      /></div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed, ref } from 'vue';
  import OrderDisplayComponent from './OrderDisplayComponent.vue';
  import {
    OrderStatusConstantClass,
    orderStatusEnDisplayNameMap,
    orderStatusZhDisplayNameMap,
    orderDiscountTypeZhDisplayName,
    orderDiscountTypeEnDisplayName,
    skuType,
    TrafficType,
  } from '../common';
  import useLocale from '@/hooks/useLocale';
  import { CombinedType } from '@/views/cloud-storage-new/types/cloud-storage';
  import { useI18n } from 'vue-i18n';

  const props = defineProps({
    orderInfo: {
      type: Object as PropType<OrderInfoItem>,
      required: true,
    },
  });

  const { currentLocale } = useLocale();
  const { t } = useI18n();

  const orderStatus = computed(() => {
    // 匹配对应状态
    const desc: string =
      (currentLocale.value === 'zh-CN'
        ? orderStatusZhDisplayNameMap[props.orderInfo.tradeStatus]
        : orderStatusEnDisplayNameMap[props.orderInfo.tradeStatus]) ??
      props.orderInfo.tradeStatus ??
      '';

    const splitIndex = desc.indexOf('(');

    const subStatus = splitIndex === -1 ? '' : desc.substring(splitIndex, desc.length);
    const status = splitIndex === -1 ? desc : desc.substring(splitIndex, 0);
    return { status, subStatus, desc };
  });

  const isCollapsed = ref<boolean>(false);

  function handleCollapse() {
    isCollapsed.value = !isCollapsed.value;
  }

  /**
   * 流量单位转换
   * @param size KB
   */
  function computeTrafficDataSizeDisplayName(size: number) {
    if (size < 1024) {
      return size + 'B';
    } else if (size < 1024 * 1024) {
      return (size / 1024).toFixed(0) + 'KB';
    } else if (size < 1024 * 1024 * 1024) {
      return (size / (1024 * 1024)).toFixed(0) + 'MB';
    } else if (size < 1024 * 1024 * 1024 * 1024) {
      return (size / (1024 * 1024 * 1024)).toFixed(0) + 'GB';
    } else {
      return (size / (1024 * 1024 * 1024 * 1024)).toFixed(0) + 'TB';
    }
  }

  const cardHeaderTitle = computed(() => {
    if (props.orderInfo?.packageInfo?.combinedType === CombinedType.combined) {
      return t('cloud-storage.order-pkg.default');
    } else {
      if (props.orderInfo?.packageInfo.skuType === skuType.cs) {
        return t('cloud-storage.order-pkg.cs');
      }
      if (props.orderInfo?.packageInfo.skuType === skuType.data) {
        return t('cloud-storage.order-pkg.data');
      }
      return t('cloud-storage.order-pkg.default');
    }
  });
</script>

<style scoped lang="less">
  .order-display-card {
    display: flex;
    flex-direction: column;
    background-color: #fff;
    border-radius: 8px;
    overflow: hidden;

    .order-display-card__header {
      height: 40px;
      background: linear-gradient(90deg, #d6e8ff 0%, #ffffff 100%);
      display: flex;
      align-items: center;
      padding: 0 10px;

      > div {
        flex-shrink: 0;
      }

      .order-card__title {
        font-weight: bold;
        font-size: 14px;
        color: #232323;
      }

      .service-status {
        flex: 1;
        text-align: right;
        font-weight: 400;
        font-size: 13px;
        color: #247cff;

        &.error {
          color: #ff3b30 !important;
        }

        &.warning {
          color: #ff9500 !important;
        }
      }
    }

    .package-info-section__wrapper {
      padding: 13px;
    }

    .package-info-section {
      display: flex;
      flex-direction: column;
      .group-package-card {
        display: flex;
        align-items: center;
        border-radius: 10px;

        &:not(&:last-child) {
          margin-bottom: 10px;
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
            margin-bottom: 2px;

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
        display: flex;
        align-items: center;
        padding: 0 5px;
        height: 16px;
        border-radius: 8px;
        font-size: 8px;
        color: #247cff;
        background-color: #e8f3ff;
      }
    }

    .order-display-card-header {
      display: flex;
      align-items: start;
      // height: 38px;
      min-height: 38px;

      .order-display-card-header__img {
        height: 38px;
        width: 64px;
        object-fit: contain;
      }

      .order-display-card-header__package-info {
        flex: auto;
        margin: 0 6px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        overflow: hidden;

        .package-title {
          font-weight: 500;
          font-size: 14px;
          color: #232323;
          line-height: 22px;
        }

        .package-tag {
          height: 16px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          padding: 0 8px;
          font-size: 9px;
          line-height: 10px;
          vertical-align: top;
          color: #247cff;
          background-color: #e8f3ff;
        }
      }

      .order-status {
        flex-shrink: 0;
        display: flex;
        flex-direction: column;
        text-align: right;
        // color: #8f8f8f;
        // color: #247cff;
        justify-content: center;

        .order-status-main {
          font-weight: 400;
          font-size: 14px;
          line-height: 22px;
        }

        .order-sub-status {
          font-weight: 400;
          font-size: 12px;
          // color: #247cff;
          line-height: 14px;
        }
      }
    }

    .order-display-card-body {
      padding: 0 0 13px 0;

      .pending-payment-order-tip {
        padding: 4px 6px;
        background-color: #fef0e7;
        color: #f66909;
        font-size: 10px;
        border-radius: 4px;
        margin: 10px 0;
        display: flex;
        align-items: center;
      }
    }

    .order-display-card-footer {
      display: flex;

      .more-info_btn {
        flex: 1;
        font-weight: 400;
        font-size: 12px;
        color: #8f8f8f;
        line-height: 14px;
        cursor: pointer;
      }

      .price-display-area {
        flex: 1;
        display: flex;
        justify-content: flex-end;
        align-items: baseline;
        flex-shrink: 0;
        font-weight: 400;
        font-size: 12px;
        color: #232323;
        line-height: 12px;

        // .price-display-area__price-symbol {
        //   font-size: 11px;
        //   line-height: 11px;
        //   color: #247cff;
        // }
        .price-display-area__price {
          font-weight: 400;
          font-size: 14px;
          line-height: 14px;
        }
      }
    }

    .order-more-info {
      // height: 0;
      // transition: all 0.5s ease;
      // clip-path: inset(0 0 100% 0);

      display: grid;
      grid-template-rows: 0fr;
      transition: 250ms all ease;
      overflow: hidden;

      &.collapsed {
        // height: auto;
        // clip-path: inset(0);

        grid-template-rows: 1fr;
      }

      .order-more-info__body {
        overflow: hidden;
      }

      .discount-info {
        width: 100%;
        display: flex;
        flex-direction: column;
        // align-items: end;

        .discount-info-item {
          text-align: right;

          &:not(&:last-child) {
            margin-bottom: 4px;
          }
        }
      }
    }

    .collapse-action-bar {
      padding-top: 4px;
      font-weight: 400;
      font-size: 12px;
      line-height: 14px;
      color: #8f8f8f;
      text-align: center;
      cursor: pointer;
    }

    // &:not(&:last-child) {
    //   margin-bottom: 13px;
    // }
  }
</style>
