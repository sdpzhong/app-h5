<template>
  <div class="van-safe-area-bottom">
    <div class="payment-bottom-sheet">
      <div class="payment-price">
        <div class="payment-price__title">{{ $t('cloud-storage.payment-price') }}</div>
        <div class="payment-price__amount">
          <span class="payment-price__unit">{{
            selectPackage?.currency === 'CNY' ? '¥' : '$'
          }}</span>
          {{ parseFloat(((selectPackage?.price ?? 0) / 100).toFixed(2)) }}
        </div>
      </div>
      <div class="payment-method-area">
        <van-space direction="vertical" fill size="0.2667rem">
          <div
            class="payment-method payment-method-border-noconvert"
            :class="{ 'payment-method__active': currentPayChannel === item.channel }"
            v-for="(item, index) of paymentMethods"
            :key="index"
            @click="handleSelect(item)"
          >
            <img class="payment-method__icon" :src="item.icon" alt="" />
            <div class="payment-method__label row-text__ellipsis">{{ item.name }}</div>
            <div class="payment-method__check">
              <van-checkbox :model-value="currentPayChannel === item.channel" icon-size="0.48rem"
            /></div>
          </div>
        </van-space>
      </div>
      <van-button
        type="primary"
        block
        class="pay-btn"
        :disabled="loading"
        v-show="currentPayChannel != PayChannel.PAYPAL"
        @click="handleSubmit"
        >{{ $t('cloud-storage.pay-btn') }}</van-button
      >
      <!-- <div
        id="paypal__btn"
        v-if="isOverseaEnv"
        v-show="currentPayChannel == PayChannel.PAYPAL"
      ></div> -->
      <div id="paypal__btn" v-show="currentPayChannel == PayChannel.PAYPAL"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { PayChannel } from '@/stores/modules/types/cloudStorage';
  import { nextTick, onMounted, ref } from 'vue';
  import wechatPayIcon from '@/assets/images/cloud-storage/pay-action/wechat-pay.png';
  import zfbPayIcon from '@/assets/images/cloud-storage/pay-action/zfb-pay.png';
  import googlePayIcon from '@/assets/images/cloud-storage/pay-action/google-pay.png';
  import applePayIcon from '@/assets/images/cloud-storage/pay-action/apple-pay.png';
  // import paypalIcon from '@/assets/images/cloud-storage/pay-action/paypal-pay.png';
  import { storeToRefs } from 'pinia';
  import { useAppEnvStore, useMethodChannelStore, usePurchaseStore } from '@/stores';
  import { useI18n } from 'vue-i18n';
  import { showLoadingToast, showSuccessToast, showToast } from 'vant';
  import { delayFunction } from '@/utils/delay';
  import { captureOrder, placeCloudStorageOrder } from '@/api/modules/iot-device';
  import useLoading from '@/hooks/loading';
  import { loadScript } from '@paypal/paypal-js';
  import { ApiKeys } from '@/constants/modules/apiKeys';
  import type { PaymentMethodItem } from '../common/purchase-types';
  import { SkuType } from '@/stores/modules/types/purchase';
  import { useRouter } from 'vue-router';

  const emit = defineEmits<{
    (event: 'closePaymentBottomSheet', cb: Function): void;
  }>();

  const { t } = useI18n();
  const router = useRouter();

  const { isOverseaEnv, baseInfo } = storeToRefs(useAppEnvStore());

  const { postMessage } = useMethodChannelStore();

  const purchaseStore = usePurchaseStore();
  const { selectPackage, selectDeviceSN } = storeToRefs(purchaseStore);

  const paymentMethods = ref<PaymentMethodItem[]>([]);

  const currentPayChannel = ref<PayChannel>();

  const { loading, setLoading } = useLoading();

  // 初始化支付类型
  function initPayChannelList() {
    if (isOverseaEnv.value) {
      // 海外android or ios
      switch (baseInfo.value?.platform?.toLocaleLowerCase() ?? 'ios') {
        case 'ios':
          paymentMethods.value = [
            {
              name: 'ApplePay',
              channel: PayChannel.APPLE,
              icon: applePayIcon,
            },
            // {
            //   name: 'Paypal',
            //   channel: PayChannel.PAYPAL,
            //   icon: paypalIcon,
            // },
          ];
          break;
        case 'android':
          paymentMethods.value = [
            {
              name: 'GooglePay',
              channel: PayChannel.GOOGLE,
              icon: googlePayIcon,
            },
            // {
            //   name: 'Paypal',
            //   channel: PayChannel.PAYPAL,
            //   icon: paypalIcon,
            // },
          ];
          break;

        default:
          break;
      }
    } else {
      // 国内环境
      paymentMethods.value = [
        {
          name: t('cloud-storage.wechat'),
          channel: PayChannel.WECHAT,
          icon: wechatPayIcon,
        },
        {
          name: t('cloud-storage.alipay'),
          channel: PayChannel.ALIPAY,
          icon: zfbPayIcon,
        },
        // {
        //   name: 'Paypal',
        //   channel: PayChannel.PAYPAL,
        //   icon: paypalIcon,
        // },
      ];
    }

    // 选中第一项
    if (paymentMethods.value.length) {
      currentPayChannel.value = paymentMethods.value[0].channel;
    }
  }

  initPayChannelList();

  function handleSelect(item: PaymentMethodItem) {
    currentPayChannel.value = item.channel;
  }

  async function handleSubmit() {
    const payChannel = currentPayChannel.value;

    if (!selectPackage.value?.packageId) {
      showToast(t('cloud-storage.select-pkg-tip'));
    }

    if (!selectDeviceSN.value) {
      showToast(t('cloud-storage.select-device-tip'));
    }

    const toast = showLoadingToast({
      message: t('cloud-storage.order-creating'),
    });

    setLoading(true);

    try {
      const res = await placeCloudStorageOrder({
        packageId: selectPackage.value!.packageId,
        sn: selectDeviceSN.value!,
        payChannel: payChannel!,
        // renewal: ~~(selectPackage.value?.renewal ?? 0),
      });

      console.log('handleSubmit: ', res);

      await delayFunction(1000);

      const { orderId, data, packageType } = res;

      // 将下单信息传递给app
      postMessage({
        method: 'startPay',
        data: {
          payChannel,
          orderId,
          packageType,
          packageID: selectPackage.value!.packageId,
          payInfo: data,
        },
      });
    } catch (error) {
      console.log('error: ', error);
    } finally {
      setLoading(false);
      toast.close();
      // 关闭弹窗
      emit('closePaymentBottomSheet', () => {});
    }
  }

  // palpay配置
  onMounted(async () => {
    await nextTick(() => {
      // 海外环境初始化paypal支付按钮 （暂时屏蔽，需要时可取消注释）
      // if (isOverseaEnv.value) {
      //   constructPaypalButton();
      // }
    });
  });

  // @ts-ignore
  const _constructPaypalButton = async () => {
    await loadScript({
      clientId: ApiKeys.PAYPAL_PRODUCTION_CLIENT_ID,
      currency: 'USD',
      // 使用沙箱
      environment: 'production',
      disableFunding: ['credit', 'card'], // 禁止出现的按钮
    })
      .then((paypal) => {
        if (paypal?.Buttons) {
          let orderInfo: CreateOrderResponse;
          paypal
            .Buttons({
              style: {
                color: 'blue',
                // 按钮样式自定义
                height: 45,
                disableMaxWidth: true,
              },
              // 创建支付订单
              createOrder: async (data, actions) => {
                console.log('createOrder: ', data, actions);
                orderInfo = await placeCloudStorageOrder({
                  payChannel: PayChannel.PAYPAL,
                  packageId: selectPackage.value!.packageId,
                  sn: selectDeviceSN.value!,
                });
                return orderInfo.data;
              },
              // 付款完成
              onApprove: async (data, actions) => {
                console.log('onApprove: ', data, actions);

                // 上传订单号，同步订单状态
                captureOrder({
                  orderId: orderInfo.orderId,
                  transactionId: data.orderID,
                });

                // 关闭弹窗
                emit('closePaymentBottomSheet', () => {
                  showSuccessToast({
                    message: t('traffic.approve-success'),
                    duration: 2000,
                  });
                  if (
                    selectPackage.value?.skuType === SkuType.cs ||
                    selectPackage.value?.skuType === SkuType.combo
                  ) {
                    purchaseStore.requestCsPackageServiceStatusInfo(selectDeviceSN.value!, true);
                    router.push({
                      path: '/cloud-storage/setting',
                      query: {
                        sn: selectDeviceSN.value,
                      },
                    });
                    return;
                  }

                  if (
                    selectPackage.value?.skuType === SkuType.gsmdata ||
                    selectPackage.value?.skuType === SkuType.combo
                  ) {
                    purchaseStore.requestGsmdataPackageServiceStatusInfo(
                      selectDeviceSN.value!,
                      true,
                    );
                    router.push({
                      path: '/gsmdata/setting',
                      query: {
                        sn: selectDeviceSN.value,
                      },
                    });
                    return;
                  }
                });
              },
              // 取消支付
              onCancel(res) {
                showToast(t('traffic.approve-cancel'));
                console.log('paypal cancel: ', res);
              },
              onError(err) {
                // 支付失败，请重试
                showToast(t('traffic.approve-fail'));
                console.log('paypal fail: ', err);
              },
            })
            .render('#paypal__btn')
            .catch((error) => {
              console.error('failed to render the PayPal Buttons', error);
            });
        }
      })
      .catch((error) => {
        showToast(t('traffic.paypal-load-fail'));
        // sdk 加载失败
        console.error('failed to load the PayPal JS SDK script', error);
      });
  };
</script>

<style scoped lang="less">
  .payment-bottom-sheet {
    padding: 35px 26px 20px;

    .payment-price {
      .payment-price__title {
        color: #8f8f8f;
        text-align: center;
        font-weight: 500;
        font-size: 14px;
      }

      .payment-price__amount {
        font-size: 28px;
        font-weight: bold;
        // text-align: center;
        padding: 2px 0 28px 0;
        display: flex;
        align-items: baseline;
        justify-content: center;

        .payment-price__unit {
          font-size: 18px;
          font-weight: bold;
          margin-right: 4px;
        }
      }
    }

    .payment-method-area {
      margin-bottom: 38px;

      .payment-method-border-noconvert {
        border: 2px solid rgba(35, 35, 35, 0.1);
      }

      .payment-method {
        display: flex;
        align-items: center;
        padding: 10px;

        border-radius: 7px;
        transition: 0.3s all;
        .payment-method__icon {
          display: block;
          width: 32px;
          height: 32px;
          object-fit: contain;
          margin-right: 6px;
        }

        .payment-method__label {
          flex: 1;
          font-weight: 500;
          font-size: 14px;
          color: #232323;
        }

        // .payment-method__check {
        // }

        &:active {
          background-color: #f2f3f5;
        }
      }

      .payment-method__active {
        border-color: #247cff;
      }
    }

    .pay-btn {
      margin-top: 38px;
      font-size: 13px;
      // background: linear-gradient(to right, rgba(36, 124, 255, 1), rgba(96, 160, 255, 1));
      .price {
        .price__pre {
          font-size: 11px;
          margin-left: 4px;
        }
      }
    }
  }

  #paypal__btn {
    border-radius: 5px;
  }
</style>
