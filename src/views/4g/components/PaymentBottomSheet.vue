<template>
  <div class="van-safe-area-bottom">
    <div class="payment-bottom-sheet">
      <div class="payment-price">
        <div class="payment-price__title">{{ $t('traffic.amount-paid') }}</div>
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
            class="payment-method"
            :class="{ 'payment-method__active': currentPayChannel === item.channel }"
            v-for="(item, index) of paymentMethods"
            :key="index"
            @click="handleSelect(item)"
          >
            <img class="payment-method__icon" :src="item.icon" alt="" />
            <div class="payment-method__label row-text__ellipsis">{{ item.name }}</div>
            <div class="payment-method__check">
              <van-checkbox
                checked-color="#6fbea3"
                :model-value="currentPayChannel === item.channel"
                icon-size="0.48rem"
            /></div>
          </div>
        </van-space>
      </div>
      <div
        class="pay-btn"
        :disabled="loading"
        v-show="currentPayChannel != PayChannel.PAYPAL"
        @click="handleSubmit"
        >{{ $t('cloud-storage.pay-btn') }}</div
      >
      <div
        id="paypal-buttons"
        :style="{ display: currentPayChannel == PayChannel.PAYPAL ? 'block' : 'none' }"
      ></div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { PayChannel } from '@/stores/modules/types/cloudStorage';
  import { nextTick, onMounted, ref } from 'vue';
  import type { PaymentMethodItem } from '../types/4g-page';
  import wechatPayIcon from '@/assets/images/cloud-storage/pay-action/wechat-pay.png';
  import zfbPayIcon from '@/assets/images/cloud-storage/pay-action/zfb-pay.png';
  import googlePayIcon from '@/assets/images/cloud-storage/pay-action/google-pay.png';
  import applePayIcon from '@/assets/images/cloud-storage/pay-action/apple-pay.png';
  // import paypalIcon from '@/assets/images/cloud-storage/pay-action/paypal-pay.png';
  import useLoading from '@/hooks/loading';
  import { delayFunction } from '@/utils/delay';
  import { showFailToast, showLoadingToast, showSuccessToast, showToast } from 'vant';
  import { loadScript } from '@paypal/paypal-js';
  import { captureOrder, placeCloudStorageOrder } from '@/api/modules/iot-device';
  import { useI18n } from 'vue-i18n';
  import { useAppEnvStore, useMethodChannelStore, useTrafficPackageStore } from '@/stores';
  import { storeToRefs } from 'pinia';
  import { ApiKeys } from '@/constants/modules/apiKeys';
  // import { useRouter } from 'vue-router';

  const emit = defineEmits<{
    (event: 'closePaymentBottomSheet', cb: Function): void;
  }>();

  const { t } = useI18n();

  // const router = useRouter();

  const { postMessage } = useMethodChannelStore();

  const { isOverseaEnv, baseInfo } = storeToRefs(useAppEnvStore());

  const { selectPackage, selectDeviceSN, selectPackageId } = storeToRefs(useTrafficPackageStore());

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
          ];
          break;
        case 'android':
          paymentMethods.value = [
            {
              name: 'GooglePay',
              channel: PayChannel.GOOGLE,
              icon: googlePayIcon,
            },
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
      constructPaypalButton();
    });
  });

  const constructPaypalButton = async () => {
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
                  packageId: selectPackageId.value!,
                  sn: selectDeviceSN.value!,
                });
                return orderInfo.data;
              },
              // 付款
              onApprove: async (data, actions) => {
                console.log('onApprove: ', data, actions);

                // 上传订单号，同步订单状态
                captureOrder({
                  orderId: orderInfo.orderId,
                  transactionId: data.orderID,
                });

                showToast(t('traffic.approve-success'));

                // 关闭弹窗
                emit('closePaymentBottomSheet', () => {
                  showSuccessToast({
                    message: t('traffic.approve-success'),
                    duration: 2000,
                  });

                  // 跳转云服务设置页面查看云服务信息
                  // router.push({
                  //   path: '/cloud-storage/order',
                  //   query: {
                  //     sn: selectDeviceSN.value,
                  //   },
                  // });

                  postMessage({
                    method: 'appRouter',
                    data: {
                      page: 'OpenWeb',
                      params: { url: `#/gsmdata/setting?sn=${selectDeviceSN.value}` },
                    },
                  });
                });
              },
              // 取消支付
              onCancel(res) {
                showToast(t('traffic.approve-cancel'));
                console.log('取消: ', res);
              },
              onError(err) {
                showToast(t('traffic.approve-fail'));
                console.log('fail: ', err);
              },
            })
            .render('#paypal-buttons')
            .catch((error) => {
              console.error('failed to render the PayPal Buttons', error);
            });
        }
      })
      .catch((error) => {
        showFailToast(t('traffic.paypal-load-fail'));
        // sdk 加载失败
        console.error('failed to load the PayPal JS SDK script', error);
      });
  };
</script>

<style scoped lang="less">
  .payment-bottom-sheet {
    // height: 375px;
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

      .payment-method {
        display: flex;
        align-items: center;
        padding: 10px;
        border: 2px solid rgba(35, 35, 35, 0.1);
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
          background-color: rgba(111, 190, 162, 0.1);
        }
      }

      .payment-method__active {
        border-color: #6fbea3;
      }
    }

    .pay-btn {
      height: 45px;
      display: flex;
      justify-content: center;
      align-items: center;
      background: linear-gradient(to right, rgba(110, 196, 167, 1), rgba(135, 207, 185, 1));
      font-weight: 400;
      font-size: 13px;
      color: #ffffff;
      line-height: 16px;
      overflow: hidden;
      border-radius: 5px;
      transition: background-color 0.36s;

      &:active {
        background: linear-gradient(to right, rgb(95, 167, 143), rgb(117, 179, 160));
      }

      .price {
        margin-left: 4px;
        display: flex;
        align-items: baseline;
        .price__pre {
          margin-right: 2px;
          font-size: 11px;
        }
      }
    }
  }

  #paypal-buttons {
    border-radius: 5px;
  }
</style>
