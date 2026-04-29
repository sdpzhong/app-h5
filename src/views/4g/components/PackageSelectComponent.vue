<template>
  <div class="cloud-storage__main">
    <div class="cloud-storage-package-area">
      <div class="loading-box" v-if="requestPackageLoading">
        <van-loading size="0.64rem" vertical>{{ $t('toast.loading') }}</van-loading>
      </div>
      <template v-else>
        <!-- <div class="package-card__outer" v-for="item of packageList" :key="item.packageId">
          <div class="package-card-tag">
            <div v-if="item.recommend" class="package-card-tag__hot package-card-tag__item">
              <img
                src="/src/assets/images/cloud-storage/icon_hot.png"
                class="hot-icon"
                alt=""
                srcset=""
              />
              Hot
            </div>
            <div class="package-card-tag__item row-text__ellipsis" v-if="item.badge">
              {{ item.badge }}
            </div>
          </div>
          <div
            class="package-display-card package-display-card__border-noconvert"
            :class="{
              'package-display-card__border-active-noconvert': selectPackageId === item.packageId,
            }"
            @click="handleSelectPackage(item.packageId)"
          >
            <div class="package-info__title">{{ item.displayName ?? '_' }}</div>
            <div class="package-info__specification">
              <span
                class="original-price"
                v-if="item?.originalPrice && item?.originalPrice !== item?.price"
                >{{ item?.currency === 'CNY' ? '¥' : '$'
                }}{{ parseFloat(((item?.originalPrice ?? 0) / 100).toFixed(2)) }}</span
              >
              <span class="package-price"
                >{{ item?.currency === 'CNY' ? '¥' : '$' }}&nbsp;{{
                  parseFloat(((item?.price ?? 0) / 100).toFixed(2))
                }}</span
              >
              <span class="package-info__duration"
                >/ {{ computedPackageServiceTimeDisplayName(item) }}</span
              >
            </div>
          </div>
        </div> -->
        <template v-for="item of packageList" :key="item.packageId">
          <PackageCard
            :is-active="item.packageId === selectPackageId"
            :package="item"
            @click="handleSelectPackage(item.packageId)"
          />
        </template>
        <div
          class="sub-desc-area"
          v-if="selectPackage?.type === PackageType.autoRenew && packageList.length"
        >
          <div class="bottom-sub-title"> {{ $t('cloud-storage.renewal-title') }} </div>
          <div class="bottom-sub-desc">
            <ul
              v-if="baseInfo?.platform === 'ios'"
              style="list-style-type: disc; padding-left: 0.4267rem"
            >
              <li>{{ $t('cloud-storage.renewal-desc.ios-item1') }}</li>
              <li>{{ $t('cloud-storage.renewal-desc.ios-item2') }}</li>
              <li>{{ $t('cloud-storage.renewal-desc.ios-item3') }}</li>
            </ul>

            <ul v-else style="list-style-type: disc; padding-left: 0.4267rem">
              <li>{{ $t('cloud-storage.renewal-desc.android-item1') }}</li>
              <li>{{ $t('cloud-storage.renewal-desc.android-item2') }}</li>
              <li>{{ $t('cloud-storage.renewal-desc.android-item3') }}</li>
            </ul>
          </div>
        </div>
      </template>
    </div>
    <div class="payment-operate-bar" v-if="selectPackageId !== undefined && selectDeviceSN">
      <!--  协议确认框 -->
      <div
        class="agument-check"
        :class="{
          'shake-animation-action': isShowToastAnimation,
        }"
      >
        <van-checkbox
          v-model="argumentChecked"
          checked-color="#6fbea3"
          class="agument-check__check-box"
          icon-size="0.3467rem"
        />
        <div class="service-link">
          <span style="color: #808080" @click="() => (argumentChecked = !argumentChecked)"
            >{{ $t('cloud-storage.arguments-check') }}&nbsp;</span
          >
          <span
            @click="toESimServiceArgumentPage"
            :style="{
              fontStyle: locale === 'en-US' ? 'italic' : 'normal',
            }"
            >{{ $t('cloud-storage.esim-argument') }}
          </span>
          <template v-if="selectPackage?.type === PackageType.autoRenew"
            >&nbsp;|&nbsp;<span
              @click="toRenenalArgumentPage"
              :style="{
                fontStyle: locale === 'en-US' ? 'italic' : 'normal',
              }"
              >{{ $t('cloud-storage.renewal-argument') }}</span
            >
            <!-- &nbsp;|&nbsp;<span
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
            > -->
          </template>
        </div>
      </div>
      <!-- pay button -->
      <div class="pay-btn" @click="handleShowPaymentBottomSheet">
        {{
          selectPackage?.type !== PackageType.giveAway
            ? $t('cloud-storage.pay-btn')
            : $t('cloud-storage.get-free')
        }}
        <div class="price" v-if="selectPackage?.type !== PackageType.giveAway">
          <span class="price__pre">{{ selectPackage?.currency === 'CNY' ? '¥' : '$' }}</span>
          <CountUp
            :end-val="parseFloat(((selectPackage?.price ?? 0) / 100).toFixed(2))"
            :duration="0.5"
            :decimal-places="2" /></div
      ></div>
    </div>
  </div>

  <van-popup v-model:show="paymentBottomSheetVisiable" round closeable position="bottom">
    <PaymentBottomSheet @close-payment-bottom-sheet="closePaymentBottomSheet" />
  </van-popup>
</template>

<script setup lang="ts">
  import { OtherWebUrls } from '@/router';
  import { useAppEnvStore, useMethodChannelStore } from '@/stores';
  import { useTrafficPackageStore } from '@/stores/modules/trafficPackage';
  import { PaymentActionStatus } from '@/views/cloud-storage-new/types/cloud-storage';
  import { storeToRefs } from 'pinia';
  import { showConfirmDialog, showSuccessToast, showToast } from 'vant';
  import { onBeforeUnmount, ref, watch } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { useRoute } from 'vue-router';
  import PaymentBottomSheet from './PaymentBottomSheet.vue';
  import CountUp from 'vue-countup-v3';
  import PackageCard from './PackageCard.vue';
  import { PackageType, PayChannel } from '@/stores/modules/types/cloudStorage';
  import useLoading from '@/hooks/loading';
  import { placeCloudStorageOrder } from '@/api/modules/iot-device';
  import { SimType } from '../types/4g-page';

  const { locale, t } = useI18n();
  const route = useRoute();
  // const router = useRouter();

  const { baseInfo } = storeToRefs(useAppEnvStore());

  const { acceptMessage, postMessage } = useMethodChannelStore();

  const trafficPackageStore = useTrafficPackageStore();
  const {
    packageList,
    selectPackage,
    selectPackageId,
    selectDeviceSN,
    requestPackageLoading,
    packageStatusInfo,
  } = storeToRefs(trafficPackageStore);

  const argumentChecked = ref(false);
  const isShowToastAnimation = ref(false);
  const paymentBottomSheetVisiable = ref(false);
  const animationTimer = ref<any>();

  // 跳转云服务购买协议
  // function toArgumentPage() {
  //   // 判断语言环境
  //   const url = locale.value === 'zh-CN' ? OtherWebUrls.argumentForCn : OtherWebUrls.argumentForEn;
  //   handleToIframe(url);
  // }

  // 跳转物联网卡服务协议
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

  function handleToIframe(url: string) {
    console.log(url);
    postMessage({
      method: 'appRouter',
      data: { page: 'OpenWeb', params: { url } },
    });
  }

  function handleShowPaymentBottomSheet() {
    if (argumentChecked.value) {
      // 判断是否是赠送套餐
      if (selectPackage.value?.type === PackageType.giveAway) {
        if (loading.value) {
          return;
        }
        checkSimStatus(() => {
          handleGiveAwayPackage();
        });
      } else {
        checkSimStatus(() => {
          paymentBottomSheetVisiable.value = true;
        });
      }
    } else {
      isShowToastAnimation.value = true;
      clearTimeout(animationTimer.value);
      animationTimer.value = setTimeout(() => {
        isShowToastAnimation.value = false;
      }, 600);
    }
  }

  function checkSimStatus(callback: Function) {
    if (packageStatusInfo.value.simType !== SimType.esim) {
      showConfirmDialog({
        title: t('toast.tip'),
        message: t('gsmdata.giveaway-tip'),
        confirmButtonText: t('gsmdata.pay-continue'),
      })
        .then(() => {
          callback();
        })
        .catch(() => {
          // on cancel
        });
    } else {
      callback();
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
      trafficPackageStore.requestDeviceTrafficPackageServiceStatusInfo(selectDeviceSN.value!, true);
      await trafficPackageStore.requestTrafficPackageList(selectDeviceSN.value!);

      showToast(t('cloud-storage.get-success'));
      postMessage({
        method: 'appRouter',
        data: {
          page: 'OpenWeb',
          params: { url: `#/gsmdata/setting?sn=${selectDeviceSN.value}` },
        },
      });
    } catch (error) {
      console.log('handleGiveAwayPackage fail: ', error);
    } finally {
      setLoading(false);
    }
  }

  // 关闭弹窗
  function closePaymentBottomSheet() {
    paymentBottomSheetVisiable.value = false;
  }

  // 选择套餐
  function handleSelectPackage(id: number) {
    selectPackageId.value = id;
  }

  acceptMessage(function (message) {
    console.log('cloud-storage page !!acceptMessage:', message);
    switch (message.method) {
      case 'startPay':
        // 关闭弹窗
        paymentBottomSheetVisiable.value = false;

        switch (message.data['status']) {
          case PaymentActionStatus.success:
            showSuccessToast(t('cloud-storage.payment-success'));
            // 强制更新流量套餐服务状态
            trafficPackageStore.requestDeviceTrafficPackageServiceStatusInfo(
              selectDeviceSN.value!,
              true,
            );

            // 直接跳转至订单页面
            // router.push({
            //   path: '/cloud-storage/order',
            //   query: {
            //     sn: selectDeviceSN.value,
            //   },
            // });

            // postMessage({
            //   method: 'appRouter',
            //   data: {
            //     page: 'OpenWeb',
            //     params: { url: `#/cloud-storage/order?sn=${selectDeviceSN.value}` },
            //   },
            // });

            postMessage({
              method: 'appRouter',
              data: {
                page: 'OpenWeb',
                params: { url: `#/gsmdata/setting?sn=${selectDeviceSN.value}` },
              },
            });
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

  // 设置活动套餐首位展示
  const stopHandle = watch(
    () => packageList.value,
    () => {
      if (packageList.value.length) {
        const pkgId = route.query['pkgId'] ?? '';

        if (pkgId && selectPackageId.value + '' != pkgId) {
          const itemIndex = packageList.value.findIndex((e) => e.packageId + '' === pkgId);
          if (itemIndex != -1) {
            selectPackageId.value = +pkgId;
            const pkgInfo = packageList.value[itemIndex];
            packageList.value.splice(itemIndex, 1);
            packageList.value.unshift(pkgInfo);
          }
        }

        // 设置完毕后，关闭监听
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

  onBeforeUnmount(() => {
    clearTimeout(animationTimer.value);
    animationTimer.value = null;
  });
</script>

<style scoped lang="less">
  .cloud-storage__main {
    flex: 1;
    flex-shrink: 0;
    border-radius: 20px 20px 0 0;
    background-color: #fff;

    display: flex;
    flex-direction: column;
    // overflow-x: hidden;
    // overflow-y: auto;
    overflow: hidden;

    .cloud-storage-package-area {
      flex: 1;
      overflow: auto;
      padding: 20px;

      .loading-box {
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }

    .package-card__outer {
      position: relative;
      height: fit-content;
      width: 100%;
      border-radius: 10px;
      overflow: hidden;

      .package-card-tag {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 20px;
        display: flex;
        justify-content: flex-end;

        .package-card-tag__item {
          font-size: 11px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          font-weight: bold;
          padding: 0 10px;
          background-color: #50c39c;

          &:not(&:last-child) {
            margin-right: 4px;
            border-radius: 0 0 10px 10px;
          }

          &:last-child {
            border-radius: 0 0 0 10px;
          }
        }

        .package-card-tag__hot {
          background: linear-gradient(90deg, #faa43f 0%, #f13c3c 100%);
        }

        .hot-icon {
          display: block;
          width: 15px;
          height: 15px;
          object-fit: contain;
          margin-right: 2px;
        }
      }

      &:not(&:last-child) {
        margin-bottom: 10px;
      }
    }

    .package-display-card {
      flex-shrink: 0;
      display: flex;
      align-items: center;
      overflow: hidden;
      border-radius: 10px;
      padding: 26px 20px;
      cursor: pointer;
      transition: 0.36s all;
      min-height: 64px;

      position: relative;

      &:active {
        background-color: rgba(111, 190, 162, 0.1);
      }

      .package-info__title {
        flex: 1;
        font-weight: 500;
        font-size: 17px;
        color: #232323;
        overflow: hidden;
        flex-shrink: 0;
        text-wrap: wrap;
        margin-right: 4px;
      }

      .package-info__specification {
        overflow: hidden;
        flex-shrink: 0;

        display: flex;
        align-items: center;

        .original-price {
          font-weight: 400;
          font-size: 12px;
          color: #8f8f8f;
          // line-height: 14px;
          text-decoration: line-through;
        }

        .package-price {
          font-weight: 500;
          font-size: 17px;
          color: #50c39c;
        }

        .package-info__duration {
          font-weight: 400;
          font-size: 12px;
          color: #232323;
          // line-height: 14px;
          opacity: 0.5;
        }

        & > span:not(& > span:last-child) {
          margin-right: 4px;
        }
      }
    }

    .package-display-card__border-active-noconvert {
      border-color: #6fbea3 !important;
    }

    .package-display-card__border-noconvert {
      border: 2px solid rgba(35, 35, 35, 0.05);
    }

    .payment-operate-bar {
      padding: 0 26px 20px 26px;
      border-top: 0.5px solid rgba(35, 35, 35, 0.2);
      .agument-check {
        display: flex;
        padding: 10px 0;
        // font-size: 12px;
        justify-content: center;
        align-items: center;
        vertical-align: middle;

        .agument-check__check-box {
          flex-shrink: 0;
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
          color: #6cd3b0;
          cursor: pointer;
          word-wrap: break-word;
          word-break: break-all;
          font-size: 12px;
          // line-height: 14px;
          vertical-align: top;
          span {
            font-size: 12px;
          }
        }
      }
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

  .sub-desc-area {
    padding: 0 13px 26px 13px;
    .bottom-sub-title {
      font-size: 12px;
      color: #222;
    }

    .bottom-sub-desc {
      font-size: 12px;
      color: #808080;
    }
  }
</style>
