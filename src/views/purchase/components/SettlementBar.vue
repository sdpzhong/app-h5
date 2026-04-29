<template>
  <div class="settlement-bar" v-if="selectPackage">
    <!-- 优惠倒计时组件 (todo：后续有需求可以加上)-->
    <!-- <ExpireTimeCountDown :exp-time="'2025-03-20 18:44'" /> -->

    <!-- bottom section -->
    <div class="bottom-wrapper">
      <div
        class="agument-check"
        :class="{
          'shake-animation-action': isShowToastAnimation,
        }"
      >
        <van-checkbox
          v-model="argumentChecked"
          class="agument-check__check-box"
          icon-size="0.3467rem"
        />
        <div class="service-link">
          <span style="color: #808080" @click="() => (argumentChecked = !argumentChecked)">{{
            $t('cloud-storage.arguments-check')
          }}</span>
          <span
            class="service-link__item"
            :style="{
              fontStyle: locale === 'en-US' ? 'italic' : 'normal',
            }"
            v-if="selectPackage.skuType === SkuType.cs || selectPackage.skuType === SkuType.combo"
            @click="toArgumentPage"
            >{{ $t('cloud-storage.argument') }}
          </span>
          <span
            class="service-link__item"
            v-if="
              selectPackage.skuType === SkuType.gsmdata || selectPackage.skuType === SkuType.combo
            "
            @click="toESimServiceArgumentPage"
            :style="{
              fontStyle: locale === 'en-US' ? 'italic' : 'normal',
            }"
            >{{ $t('cloud-storage.esim-argument') }}
          </span>
          <span
            v-if="selectPackage?.type === PackageType.autoRenew"
            class="service-link__item"
            @click="toRenenalArgumentPage"
            :style="{
              fontStyle: locale === 'en-US' ? 'italic' : 'normal',
            }"
            >{{ $t('cloud-storage.renewal-argument') }}</span
          >
        </div>
      </div>
      <van-button type="primary" block class="pay-btn" @click="handleShowPaymentBottomSheet">
        {{
          selectPackage?.type !== PackageType.giveAway
            ? $t('cloud-storage.pay-btn')
            : $t('cloud-storage.get-free')
        }}
        <div class="price" v-if="selectPackage?.type !== PackageType.giveAway">
          <span class="price__pre">{{ selectPackage.currency === 'CNY' ? '¥' : '$' }}</span>
          <CountUp
            :end-val="parseFloat(((selectPackage?.price ?? 0) / 100).toFixed(2))"
            :duration="0.5"
            :decimal-places="2" /></div
      ></van-button>
    </div>

    <van-popup v-model:show="paymentBottomSheetVisiable" round closeable position="bottom">
      <PaymentBottomSheet
        v-if="paymentBottomSheetVisiable"
        @close-payment-bottom-sheet="closePaymentBottomSheet"
      />
    </van-popup>
  </div>
</template>

<script setup lang="ts">
  import CountUp from 'vue-countup-v3';
  // import ExpireTimeCountDown from './ExpireTimeCountDown.vue';
  import { ref } from 'vue';
  import { useMethodChannelStore, usePurchaseStore } from '@/stores';
  import { storeToRefs } from 'pinia';
  import { useI18n } from 'vue-i18n';
  import { SkuType } from '@/stores/modules/types/purchase';
  import { PackageType, PayChannel } from '@/stores/modules/types/cloudStorage';
  import { OtherWebUrls } from '@/router';
  import { PaymentActionStatus } from '../common/purchase-types';
  import { showSuccessToast, showToast } from 'vant';
  import { useRouter } from 'vue-router';
  import PaymentBottomSheet from './PaymentBottomSheet.vue';
  import useLoading from '@/hooks/loading';
  import { placeCloudStorageOrder } from '@/api/modules/iot-device';

  const { locale, t } = useI18n();
  const router = useRouter();

  const { postMessage, acceptMessage } = useMethodChannelStore();

  const purchaseStore = usePurchaseStore();
  const { selectPackage, selectDeviceSN, currentPackageType } = storeToRefs(purchaseStore);

  const argumentChecked = ref(false);
  const isShowToastAnimation = ref(false);
  const paymentBottomSheetVisiable = ref(false);
  const animationTimer = ref<any>();

  // ====================================> 协议跳转
  // 跳转云服务购买协议
  function toArgumentPage() {
    // 判断语言环境
    const url = locale.value === 'zh-CN' ? OtherWebUrls.argumentForCn : OtherWebUrls.argumentForEn;

    handleToIframe(url);
  }

  function toESimServiceArgumentPage() {
    const url =
      locale.value === 'zh-CN'
        ? OtherWebUrls.eSimServiceArgumentForCn
        : OtherWebUrls.eSimServiceArgumentForEn;
    handleToIframe(url);
  }

  // 自动续费协议
  function toRenenalArgumentPage() {
    const url =
      locale.value === 'zh-CN'
        ? OtherWebUrls.autoRenewArgumentForCn
        : OtherWebUrls.autoRenewArgumentForEn;

    handleToIframe(url);
  }

  // 用户协议
  // function toUserServiceArgumentPage() {
  //   const url =
  //     locale.value === 'zh-CN'
  //       ? OtherWebUrls.userServiceArgumentForCn
  //       : OtherWebUrls.userServiceArgumentForEn;
  //   handleToIframe(url);
  // }

  // 隐私政策
  // function toPrivacyPolicyArgumentPage() {
  //   const url =
  //     locale.value === 'zh-CN'
  //       ? OtherWebUrls.privacyPolicyArgumentForCn
  //       : OtherWebUrls.privacyPolicyArgumentForEn;
  //   handleToIframe(url);
  // }

  function handleToIframe(url: string) {
    console.log(url);
    postMessage({
      method: 'appRouter',
      data: { page: 'OpenWeb', params: { url } },
    });
  }

  // 展示支付弹窗
  function handleShowPaymentBottomSheet() {
    if (argumentChecked.value) {
      // 免费套餐
      if (selectPackage.value?.type === PackageType.giveAway) {
        if (loading.value) {
          return;
        }
        handleGiveAwayPackage();
      } else {
        // 普通套餐购买
        paymentBottomSheetVisiable.value = true;
      }
    } else {
      isShowToastAnimation.value = true;
      clearTimeout(animationTimer.value);
      animationTimer.value = setTimeout(() => {
        isShowToastAnimation.value = false;
      }, 600);
    }
  }

  // 处理免费套餐领取
  const { loading, setLoading } = useLoading();
  async function handleGiveAwayPackage() {
    setLoading(true);
    try {
      const res = await placeCloudStorageOrder({
        packageId: selectPackage.value!.packageId,
        sn: selectDeviceSN.value!,
        payChannel: PayChannel.FREE,
      });
      console.log('handleGiveAwayPackage : ', res);
      showToast(t('cloud-storage.get-success'));
      // 更新对应的套餐列表
      purchaseStore.requestPacakgeList(currentPackageType.value, true);
      afterPayment();
    } catch (error) {
      console.log('handleGiveAwayPackage fail: ', error);
    } finally {
      setLoading(false);
    }
  }

  // 关闭弹窗
  function closePaymentBottomSheet(callback: Function) {
    paymentBottomSheetVisiable.value = false;
    callback();
  }

  acceptMessage(function (message) {
    console.log('purchase page !!acceptMessage:', message);
    switch (message.method) {
      case 'startPay':
        // 关闭弹窗
        paymentBottomSheetVisiable.value = false;

        switch (message.data['status']) {
          case PaymentActionStatus.success:
            showSuccessToast(t('cloud-storage.payment-success'));
            // 强制更新云存储状态
            afterPayment();
            break;
          case PaymentActionStatus.fail:
            // showFailToast(t('cloud-storage.payment-fail'));
            break;
          case PaymentActionStatus.cancel:
            // showToast(t('cloud-storage.payment-cancel'));
            break;
          case PaymentActionStatus.processing:
            break;
          default:
            break;
        }

        break;

      default:
        break;
    }
  });

  // 更新状态 & 跳转
  function afterPayment() {
    if (selectPackage.value?.skuType === SkuType.combo) {
      purchaseStore.requestCsPackageServiceStatusInfo(selectDeviceSN.value!, true);
      purchaseStore.requestGsmdataPackageServiceStatusInfo(selectDeviceSN.value!, true);
      router.push({
        path: '/cloud-storage/setting',
        query: {
          sn: selectDeviceSN.value,
        },
      });
      return;
    }

    if (selectPackage.value?.skuType === SkuType.cs) {
      purchaseStore.requestCsPackageServiceStatusInfo(selectDeviceSN.value!, true);
      router.push({
        path: '/cloud-storage/setting',
        query: {
          sn: selectDeviceSN.value,
        },
      });
      return;
    }

    if (selectPackage.value?.skuType === SkuType.gsmdata) {
      purchaseStore.requestGsmdataPackageServiceStatusInfo(selectDeviceSN.value!, true);
      router.push({
        path: '/gsmdata/setting',
        query: {
          sn: selectDeviceSN.value,
        },
      });
      return;
    }
  }
</script>

<style scoped lang="less">
  .settlement-bar {
    .bottom-wrapper {
      border-top: 0.5px solid rgba(35, 35, 35, 0.1);
      padding: 0 19px 19px 19px;
    }

    .pay-btn {
      // font-size: 13px;
      background: linear-gradient(to right, rgba(36, 124, 255, 1), rgba(96, 160, 255, 1));
      ::v-deep(.van-button__text) {
        display: flex;
        align-items: center;
        justify-content: center;
        align-items: baseline;
        // align-items: center;
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

    .agument-check {
      display: flex;
      padding: 10px 0;
      // font-size: 12px;
      justify-content: center;
      align-items: center;
      vertical-align: middle;
      color: #8f8f8f;
      font-size: 11px;

      .agument-check__check-box {
        height: 20px;
        width: 20px;
        margin-right: 2px;
        flex-shrink: 0;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .service-link {
        height: 100%;
        // line-height: 100%;
        color: #2c70ff;
        cursor: pointer;
        word-wrap: break-word;
        word-break: break-all;
        font-size: 11px;
        // line-height: 14px;
        vertical-align: top;

        span {
          font-size: 12px;
          position: relative;
        }

        & > .service-link__item:not(.service-link__item:nth-child(2)) {
          padding: 0 2px;
          &::before {
            content: '|';
            position: absolute;
            top: 0;
            bottom: 0;
            left: 0;
          }
        }
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
