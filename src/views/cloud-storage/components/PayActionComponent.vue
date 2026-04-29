<template>
  <div class="pay-action-bar" v-if="props.packageInfo?.price && selectDeviceSN">
    <div
      class="agument-check"
      :class="{
        'shake-animation-action': isShowToastAnimation,
      }"
    >
      <van-checkbox
        class="agument-check__check-box"
        v-model="argumentChecked"
        icon-size="0.4267rem"
      />
      <div class="service-link">
        <span style="color: #808080">{{ $t('cloud-storage.arguments-check') }}&nbsp;</span>
        <span
          @click="toArgumentPage"
          :style="{
            fontStyle: locale === 'en-US' ? 'italic' : 'normal',
          }"
          >{{ $t('cloud-storage.argument') }}
        </span>
        <template v-if="isOverseaEnv"
          >&nbsp;|&nbsp;<span
            @click="toRenenalArgumentPage"
            :style="{
              fontStyle: locale === 'en-US' ? 'italic' : 'normal',
            }"
            >{{ $t('cloud-storage.renewal-argument') }}</span
          >&nbsp;|&nbsp;<span
            @click="toUserServiceArgumentPage"
            :style="{
              fontStyle: locale === 'en-US' ? 'italic' : 'normal',
            }"
            >{{ $t('cloud-storage.user-agreement') }}</span
          >&nbsp;|&nbsp;<span
            @click="toPrivacyPolicyArgumentPage"
            :style="{
              fontStyle: locale === 'en-US' ? 'italic' : 'normal',
            }"
            >{{ $t('cloud-storage.privacy-policy') }}</span
          ></template
        >
      </div>
    </div>

    <div class="pay-action-bar__content">
      <div class="pay-action-bar__price row-text__ellipsis">
        ¥
        <span class="pay-action-bar__price-integer">{{ priceDisplayInfo.intValue }}</span
        ><span>.{{ priceDisplayInfo.decimalValue }}</span>
      </div>

      <div class="pay-action-bar__btns">
        <template v-if="!isOverseaEnv">
          <van-space>
            <van-button
              icon="wechat-pay"
              round
              type="success"
              @click="handleSubmit(PayChannel.WECHAT)"
              >{{ $t('cloud-storage.wechat') }}</van-button
            >
            <van-button
              icon="alipay"
              round
              type="primary"
              @click="handleSubmit(PayChannel.ALIPAY)"
              >{{ $t('cloud-storage.alipay') }}</van-button
            >
          </van-space>
        </template>

        <template v-else>
          <van-button round type="primary" @click="handleOverseaPayAction">{{
            $t('cloud-storage.pay-now')
          }}</van-button>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { placeCloudStorageOrder } from '@/api/modules/iot-device';
  import { useAppEnvStore, useCloudStorageStore, useMethodChannelStore } from '@/stores';
  import { storeToRefs } from 'pinia';
  import { showLoadingToast, showToast } from 'vant';
  import { computed, onUnmounted, ref } from 'vue';
  import { useRouter } from 'vue-router';
  import { PayChannel } from '@/stores/modules/types/cloudStorage';
  import { delayFunction } from '@/utils/delay';
  import { useI18n } from 'vue-i18n';
  import { OtherWebUrls } from '@/router';

  // interface StartPayFunctionResponse {
  //   payChannel: string;
  //   orderId: number;
  //   packageID: number;
  //   payInfo: string;
  //   //0.支付成功 1.支付失败 2.支付取消 3.处理中
  //   status: number;
  // }

  // const OrderStatusMap = {
  //   0: '支付成功',
  //   1: '支付失败',
  //   2: '支付取消',
  //   3: '处理中',
  // };

  const props = defineProps({
    packageInfo: {
      type: Object as PropType<CloudStoragePackageInfo>,
    },
    renewal: {
      type: Boolean,
      default: false,
    },
  });

  const router = useRouter();

  const { t, locale } = useI18n();

  const { acceptMessage, postMessage } = useMethodChannelStore();

  const { selectDeviceSN } = storeToRefs(useCloudStorageStore());

  const { isOverseaEnv, baseInfo } = storeToRefs(useAppEnvStore());

  const priceDisplayInfo = computed(() => {
    const price = (props.packageInfo?.price ?? 0) / 100;
    const strArr = price.toFixed(2).split('.');
    return {
      intValue: strArr[0],
      decimalValue: strArr[1],
    };
  });

  const argumentChecked = ref<boolean>(false);
  const animationTimer = ref<any>();
  const isShowToastAnimation = ref<boolean>(false);

  function toArgumentPage() {
    // 判断语言环境
    const url = locale.value === 'zh-CN' ? OtherWebUrls.argumentForCn : OtherWebUrls.argumentForEn;

    handleToIframe(url);
  }

  function toRenenalArgumentPage() {
    const url =
      locale.value === 'zh-CN'
        ? OtherWebUrls.autoRenewArgumentForCn
        : OtherWebUrls.autoRenewArgumentForEn;

    handleToIframe(url);
  }

  function toUserServiceArgumentPage() {
    const url =
      locale.value === 'zh-CN'
        ? OtherWebUrls.userServiceArgumentForCn
        : OtherWebUrls.userServiceArgumentForEn;

    handleToIframe(url);
  }
  function toPrivacyPolicyArgumentPage() {
    const url =
      locale.value === 'zh-CN'
        ? OtherWebUrls.privacyPolicyArgumentForCn
        : OtherWebUrls.privacyPolicyArgumentForEn;

    handleToIframe(url);
  }

  function handleToIframe(url: string) {
    console.log(url);
    postMessage({
      method: 'appRouter',
      data: { page: 'OpenWeb', params: { url } },
    });
  }

  async function handleSubmit(payChannel: PayChannel) {
    if (argumentChecked.value) {
      if (!props.packageInfo) {
        showToast(t('cloud-storage.select-pkg-tip'));
      }

      if (!selectDeviceSN.value) {
        showToast(t('cloud-storage.select-device-tip'));
      }

      const toast = showLoadingToast({
        message: t('cloud-storage.order-creating'),
      });

      try {
        const res = await placeCloudStorageOrder({
          packageId: props.packageInfo!.id!,
          sn: selectDeviceSN.value!,
          payChannel: payChannel,
          renewal: ~~props.renewal,
        });

        console.log('handleSubmit: ', res);

        await delayFunction(1000);

        const { orderId, data, packageType } = res;

        // 将下单信息传递给app
        postMessage({
          method: 'startPay',
          data: {
            payChannel: payChannel,
            orderId,
            packageType,
            packageID: props.packageInfo!.id!,
            payInfo: data,
          },
        });

        toast.close();
      } catch (error) {
        console.log('error: ', error);
      }
    } else {
      isShowToastAnimation.value = true;
      clearTimeout(animationTimer.value);
      animationTimer.value = setTimeout(() => {
        isShowToastAnimation.value = false;
      }, 600);
    }
  }

  function handleOverseaPayAction() {
    // 判断当前平台
    switch (baseInfo.value?.platform) {
      case 'ios':
        handleSubmit(PayChannel.APPLE);
        break;
      case 'android':
        handleSubmit(PayChannel.GOOGLE);
        break;

      default:
        break;
    }
  }

  onUnmounted(() => {
    clearTimeout(animationTimer.value);
    animationTimer.value = null;
  });

  acceptMessage(function (message) {
    console.log('cloud-storage page !!acceptMessage:', message);
    switch (message.method) {
      case 'startPay':
        // changeLoading.value = false;

        // if (message.data['status']) {
        //   const res = message.data['message'] as StartPayFunctionResponse;
        //   console.log('startPay msg: ', res);
        //   showSuccessToast({
        //     message: OrderStatusMap[res.status],
        //   });
        // } else {
        //   showFailToast({
        //     message: '支付失败，请重试',
        //   });
        // }

        // 直接跳转至订单页面
        router.push({
          path: '/cloud-storage/order',
          query: {
            sn: selectDeviceSN.value,
          },
        });

        break;

      default:
        break;
    }
  });

  // 11.调用APP支付SDK：
  // 	method：startPay
  // 	data: { payChannel:“xxx”,orderId:“xxxx”,packageID:“xxxx”,payInfo:“xxxx”}
  // js回调：
  // 	data: {“status”:0,“message”:“xxxx”}
  // 参数说明：
  // 	payChannel支付渠道：APPLE:苹果  WECHAT:微信 ALIPAY:支付宝
  // 	orderId  订单ID
  // 	packageID 套餐ID
  // 	payInfo 支付套装串
  // 	status 支付状态 ：0.支付成功 1.支付失败 2.支付取消 3.处理中
</script>

<style scoped lang="less">
  .pay-action-bar {
    display: flex;
    flex-direction: column;
    background-color: #fff;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);

    .agument-check {
      display: flex;
      padding: 14px 26px;
      font-size: 12px;
      justify-content: center;

      .agument-check__check-box {
        flex-shrink: 0;
        margin-right: 6px;
      }

      .service-link {
        color: #2c70ff;
        // text-align: center;
        cursor: pointer;
        word-wrap: break-word;
        word-break: break-all;

        span {
          font-size: 12px;
        }
      }
    }

    .pay-action-bar__content {
      height: 80px;

      display: flex;
      align-items: center;

      .pay-action-bar__price {
        flex: auto;
        color: #ff6203;
        font-size: 18px;
        font-weight: 500;
        margin-left: 28px;

        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;

        .pay-action-bar__price-integer {
          font-size: 23px;
        }
      }

      .pay-action-bar__btns {
        flex-shrink: 0;
        margin: 0 10px;
      }
    }
  }

  // 左右震动动画
  @keyframes shake-animation {
    0% {
      transform: translateX(0);
    }

    25% {
      transform: translateX(-2px);
    }

    50% {
      transform: translateX(0);
    }

    75% {
      transform: translateX(2px);
    }

    100% {
      transform: translateX(0);
    }
  }

  .shake-animation-action {
    animation-name: shake-animation;
    animation-duration: 200ms;
    animation-iteration-count: 3;
  }
</style>
