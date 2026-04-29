<template>
  <div class="cloud-storage__main">
    <!-- <van-tabs
      v-if="activeTab !== PackageRecordType.LOW_POWER"
      class="main__tab"
      v-model:active="activeTab"
      title-active-color="#247cff"
      title-inactive-color="#8F8F8F"
      animated
    >
      <van-tab :title="$t('cloud-storage.event-record')" :name="PackageRecordType.EVENT">
        <div class="loading-box" v-if="packageListLoading">
          <van-loading size="0.64rem" vertical>{{ $t('toast.loading') }}</van-loading>
        </div>
        <div class="tab-content" v-else>
          <van-space direction="vertical" fill size="0.2667rem">
            <template v-for="item of eventRecordPackageList" :key="item.id">
              <PackageCard
                :is-active="item.id === selectPackageId"
                :package="item"
                @click="handleSelectPackage(item.id)"
              />
            </template>
          </van-space>
        </div>
      </van-tab>
      <van-tab :title="$t('cloud-storage.all-time-record')" :name="PackageRecordType.ALL_DAY">
        <div class="loading-box" v-if="packageListLoading">
          <van-loading size="0.64rem" vertical>{{ $t('toast.loading') }}</van-loading>
        </div>
        <div class="tab-content" v-else>
          <van-space direction="vertical" fill size="0.2667rem">
            <template v-for="item of allTimeRecordPackageList" :key="item.id">
              <PackageCard
                :is-active="item.id === selectPackageId"
                :package="item"
                @click.stop="handleSelectPackage(item.id)"
              />
            </template>
          </van-space>
        </div>
      </van-tab>
    </van-tabs> -->
    <div class="main__tab main__tab-gsm">
      <div class="loading-box" v-if="packageListLoading">
        <van-loading size="0.64rem" vertical>{{ $t('toast.loading') }}</van-loading>
      </div>
      <div class="tab-content" v-else>
        <van-space direction="vertical" fill size="0.2667rem">
          <template v-for="item of recommendList" :key="item.packageId">
            <PackageCard
              :is-active="item.packageId === selectPackageId"
              :package="item"
              @click="handleSelectPackage(item.id)"
            />
          </template>
          <div
            class="sub-desc-area"
            v-if="selectPackage?.type === PackageType.autoRenew && recommendList.length"
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
        </van-space>
      </div>
    </div>
    <div class="payment-operate-bar" v-if="selectPackageId !== undefined && selectDeviceSN">
      <!--  协议确认框 -->
      <div
        class="agument-check"
        :class="{
          'shake-animation-action': isShowToastAnimation,
        }"
      >
        <!-- <div class="agument-check__check-box">
          <van-checkbox v-model="argumentChecked" icon-size="0.3467rem" />
        </div> -->
        <van-checkbox
          v-model="argumentChecked"
          class="agument-check__check-box"
          icon-size="0.3467rem"
        />
        <div class="service-link">
          <span style="color: #808080" @click="() => (argumentChecked = !argumentChecked)"
            >{{ $t('cloud-storage.arguments-check') }}&nbsp;</span
          >
          <span
            @click="toArgumentPage"
            :style="{
              fontStyle: locale === 'en-US' ? 'italic' : 'normal',
            }"
            >{{ $t('cloud-storage.argument') }}
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
      <van-button type="primary" block class="pay-btn" @click="handleShowPaymentBottomSheet">
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
      ></van-button>
    </div>
  </div>

  <!-- <van-action-sheet v-model:show="show" closeable>
    <PaymentBottomSheet />
  </van-action-sheet> -->

  <van-popup v-model:show="paymentBottomSheetVisiable" round closeable position="bottom">
    <!-- remove cache v-if="paymentBottomSheetVisiable" -->
    <PaymentBottomSheet
      v-if="paymentBottomSheetVisiable"
      @close-payment-bottom-sheet="closePaymentBottomSheet"
    />
  </van-popup>
</template>

<script setup lang="ts">
  import { computed, onBeforeUnmount, ref, watch } from 'vue';
  import PackageCard from './PackageCard.vue';
  import { OtherWebUrls } from '@/router/constant';
  import { useI18n } from 'vue-i18n';
  import { storeToRefs } from 'pinia';
  import { useAppEnvStore, useCloudStorageStore, useMethodChannelStore } from '@/stores';
  import PaymentBottomSheet from './PaymentBottomSheet.vue';
  import { useRoute } from 'vue-router';
  import {
    PackageRecordType,
    PackageType,
    PayChannel,
    PowerManageFeature,
  } from '@/stores/modules/types/cloudStorage';
  import { PaymentActionStatus } from '../types/cloud-storage';
  import { showSuccessToast, showToast } from 'vant';
  import CountUp from 'vue-countup-v3';
  import useLoading from '@/hooks/loading';
  import { placeCloudStorageOrder } from '@/api/modules/iot-device';

  // const router = useRouter();
  const route = useRoute();
  const { acceptMessage, postMessage } = useMethodChannelStore();

  const paymentBottomSheetVisiable = ref(false);
  const activeTab = ref<number>(PackageRecordType.EVENT);
  const argumentChecked = ref<boolean>(false);
  const animationTimer = ref<any>();
  const isShowToastAnimation = ref<boolean>(false);

  const { locale, t } = useI18n();
  const { baseInfo } = storeToRefs(useAppEnvStore());
  const cloudStorageStore = useCloudStorageStore();
  const { recommendList, selectPackageId, selectDeviceSN, packageListLoading, selectDevice } =
    storeToRefs(cloudStorageStore);

  const selectPackage = computed(() =>
    recommendList.value.find((e) => e.id === selectPackageId.value),
  );

  // 跳转云服务购买协议
  function toArgumentPage() {
    // 判断语言环境
    const url = locale.value === 'zh-CN' ? OtherWebUrls.argumentForCn : OtherWebUrls.argumentForEn;

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
      if (selectPackage.value?.type === PackageType.giveAway) {
        if (loading.value) {
          return;
        }
        handleGiveAwayPackage();
      } else {
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
      cloudStorageStore.requestDeviceCloudStorageStatusInfo(selectDeviceSN.value!, true);
      // 领取成功后，更新套餐列表
      await cloudStorageStore.requestPackageInfo(selectDeviceSN.value!);

      showToast(t('cloud-storage.get-success'));
      postMessage({
        method: 'appRouter',
        data: {
          page: 'OpenWeb',
          params: { url: `#/cloud-storage/setting?sn=${selectDeviceSN.value}` },
        },
      });
    } catch (error) {
      console.log('handleGiveAwayPackage fail: ', error);
    } finally {
      setLoading(false);
    }
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
            // 强制更新云存储状态
            cloudStorageStore.requestDeviceCloudStorageStatusInfo(selectDeviceSN.value!, true);

            // 直接跳转至订单页面
            // router.push({
            //   path: '/cloud-storage/order',
            //   query: {
            //     sn: selectDeviceSN.value,
            //   },
            // });

            // 跳转云服务设置页面查看云服务信息
            // router.push({
            //   path: '/cloud-storage/setting',
            //   query: {
            //     sn: selectDeviceSN.value,
            //   },
            // });

            postMessage({
              method: 'appRouter',
              data: {
                page: 'OpenWeb',
                params: { url: `#/cloud-storage/setting?sn=${selectDeviceSN.value}` },
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
    () => recommendList.value,
    () => {
      if (recommendList.value.length) {
        const pkgId = route.query['pkgId'] ?? '';

        if (pkgId && selectPackageId.value + '' != pkgId) {
          const itemIndex = recommendList.value.findIndex((e) => e.id + '' === pkgId);
          if (itemIndex != -1) {
            selectPackageId.value = +pkgId;
            const pkgInfo = recommendList.value[itemIndex];
            recommendList.value.splice(itemIndex, 1);
            recommendList.value.unshift(pkgInfo);
            switch (pkgInfo.recordType) {
              case PackageRecordType.EVENT:
                activeTab.value = PackageRecordType.EVENT;
                break;

              case PackageRecordType.ALL_DAY:
                activeTab.value = PackageRecordType.ALL_DAY;
                break;

              case PackageRecordType.LOW_POWER:
                activeTab.value = PackageRecordType.LOW_POWER;
                break;

              default:
                break;
            }
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

  // 关闭弹窗
  function closePaymentBottomSheet(cb: Function) {
    paymentBottomSheetVisiable.value = false;
    cb();
  }

  watch(
    () => selectDeviceSN.value,
    () => {
      if (selectDevice.value?.powerManageFeature === PowerManageFeature.LPC) {
        activeTab.value = PackageRecordType.LOW_POWER;
      } else {
        activeTab.value = PackageRecordType.EVENT;
      }
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
    overflow: hidden;

    ::v-deep(.van-tabs__nav--line) {
      border-radius: 20px 20px 0 0;
      height: 48px;
      font-weight: 500;
      font-size: 14px;
      text-align: center;
      padding-bottom: 4px;

      .van-tabs__line {
        background-color: #247cff;
        width: 14px;
        height: 2px;
        border: 1px;
      }
    }

    .main__tab {
      flex: 1;
      overflow: scroll;
      display: flex;
      flex-direction: column;

      &.main__tab-gsm {
        .tab-content {
          padding: 20px;
        }
      }

      .tab-content {
        padding: 10px 20px;
        height: 100%;
        overflow-x: hidden;
        overflow-y: scroll;
      }

      ::v-deep(.van-tabs__content) {
        flex: 1;

        .van-tab__panel {
          height: 100%;
        }
      }

      .loading-box {
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
      }
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
    // font-size: 13px;
    // background: linear-gradient(to right, rgba(36, 124, 255, 1), rgba(96, 160, 255, 1));

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
