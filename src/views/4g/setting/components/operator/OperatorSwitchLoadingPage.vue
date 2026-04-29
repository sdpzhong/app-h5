<template>
  <div class="network-setting-page van-safe-area-bottom">
    <div class="page-wrapper">
      <div class="loading-box">
        <img src="/src/assets/images/4g/icon-sd.png" alt="" />
        <div class="half-circel rotate-animation"></div>
      </div>
      <div class="network-switch-loading-text">
        <template v-if="processList.length">
          <div class="process-item" v-for="(item, key) of processList" :key="key">
            {{ item.stateDescription }}</div
          >
        </template>
        <div class="process-item" v-else>
          {{ processDesc ?? $t('gsmdata.operator-switch.loading') }}</div
        >
      </div>
    </div>
    <TrafficOperatorSelectBottomSheet
      ref="operatorSelectRef"
      @on-select="onOperatorSelect"
      :group-list="operatorList"
      :current-item="currentOperator?.operatorId"
    />
  </div>
</template>

<script setup lang="ts">
  import activeEsim, { getDeviceNetworkStatus } from '@/api/modules/iot-device';
  import useLoading from '@/hooks/loading';
  import { delayFunction } from '@/utils/delay';
  import { onBeforeUnmount, onMounted, type Ref, ref } from 'vue';
  import { useRouter } from 'vue-router';
  import TrafficOperatorSelectBottomSheet from '../TrafficOperatorSelectBottomSheet.vue';
  import { useMethodChannelStore, useTrafficSetting } from '@/stores';
  import { storeToRefs } from 'pinia';
  import { useEventListener } from '@vant/use';
  import { CacheKeysEnum } from '@/constants/enums/cacheKeysEnum';

  const router = useRouter();
  const currentRouteName = router.currentRoute.value.name;

  let timer: ReturnType<typeof setTimeout>;

  const operatorSelectRef = ref() as Ref<InstanceType<typeof TrafficOperatorSelectBottomSheet>>;

  const { postMessageAndCheckVersion } = useMethodChannelStore();

  const { sn, currentOperator, operatorList } = storeToRefs(useTrafficSetting());

  onMounted(() => {
    setTimeout(() => {
      requestDeviceOnlineStatus();
    }, 3000);
    startTimeoutInterval();
    closeScreenKeepLightStatus();
  });

  onBeforeUnmount(() => {
    removeIntervals();
  });

  function removeIntervals() {
    clearTimeout(timer);
  }

  useEventListener('visibilitychange', (e) => {
    console.log('visibilitychange', e, 'document.visibilityState: ', document.visibilityState);
    if (document.visibilityState === 'visible') {
      // 重新唤醒，重置计时器
      startTimeoutInterval();
    }
  });

  function startTimeoutInterval() {
    const endTime = Number(
      localStorage.getItem(CacheKeysEnum.OPT_SWICTH_TIME_KEY) ?? new Date().getTime(),
    );
    const duration = endTime - +new Date();
    console.log('exp Duration: ', duration);
    if (duration <= 0) {
      // 超时
      afterTimeout();
      return;
    }
    clearInterval(timer);
    timer = setTimeout(() => {
      // showDialog({
      //   title: t('gsmdata.operator-switch.timeout'),
      //   message: t('gsmdata.operator-switch.timeout-retry'),
      // }).then(() => {
      //   const sn = router.currentRoute.value.query['sn'] as string;
      //   router.replace({
      //     path: '/gsmdata/setting',
      //     query: {
      //       sn,
      //     },
      //   });
      // });
      afterTimeout();
    }, duration);
  }

  function afterTimeout() {
    const sn = router.currentRoute.value.query['sn'] as string;
    closeScreenKeepLightStatus();
    router.replace({
      path: '/gsmdata/operator-switch/timeout',
      query: {
        sn,
      },
    });
  }

  const { loading, setLoading } = useLoading();
  const processDesc = ref<string>();
  const processList = ref<RunningProcessListItem[]>([]);
  async function requestDeviceOnlineStatus() {
    if (loading.value) {
      return;
    }
    setLoading(true);
    const sn = router.currentRoute.value.query['sn'] as string;
    try {
      const { hasCompleted, needChooseOperator, runningProcessList } = await getDeviceNetworkStatus(
        { sn },
      );
      processList.value = runningProcessList;
      // 非当前页面，退出流程
      if (router.currentRoute.value.name !== currentRouteName) {
        return;
      }
      if (hasCompleted) {
        // success
        removeIntervals();

        closeScreenKeepLightStatus();

        await delayFunction(3000);
        setLoading(false);
        router.replace({
          path: '/gsmdata/operator-switch/result',
          query: {
            ...router.currentRoute.value.query,
          },
        });
        return;
      }
      // 是否显示运营商选择窗口
      if (needChooseOperator) {
        operatorSelectRef.value.showPopup = true;
      }
      await delayFunction(5000);
      console.log('retry requestDeviceOnlineStatus:', hasCompleted);
      setLoading(false);
      requestDeviceOnlineStatus();
    } catch (e) {
      console.log('requestDeviceOnlineStatus fail: ', e);
      setLoading(false);
      requestDeviceOnlineStatus();
    }
  }

  async function onOperatorSelect(id: string) {
    try {
      await activeEsim({ sn: sn.value, operatorId: id });
    } catch (error) {
      console.log('active eism fail: ', error);
    } finally {
      setLoading(false);
    }
  }

  // 关闭屏幕常亮
  function closeScreenKeepLightStatus() {
    postMessageAndCheckVersion({
      method: 'setScreenStatus',
      //  status ：0取消屏幕常亮 1保持屏幕常亮
      data: { status: 0 },
    });
  }
</script>

<style scoped lang="less">
  .network-setting-page {
    width: 100%;
    height: 100%;
    overflow-x: hidden;
    overflow-y: auto;
    display: flex;
    flex-direction: column;

    .page-wrapper {
      height: 100%;
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 0 26px 42px 26px;

      .loading-box {
        width: 112px;
        height: 112px;
        position: relative;
        background-color: #e8eaf0;
        border-radius: 50%;
        overflow: hidden;
        margin-top: 140px;
        margin-bottom: 13px;

        > img {
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          position: absolute;
          display: block;
          width: 64px;
          height: 64px;
          object-fit: contain;
          z-index: 100;
        }

        .half-circel {
          width: 50%;
          height: 100%;
          background: linear-gradient(to bottom, #2c81ff, #aae4ff);
        }

        .rotate-animation {
          animation-name: rotate-loading;
          animation-duration: 2s;
          //   animation-fill-mode: forwards;
          animation-iteration-count: infinite;
          animation-timing-function: linear;
          transform-origin: 100% 50%;
        }
      }

      .network-switch-loading-text {
        padding: 0 20px;
        display: flex;
        flex-direction: column;
        .process-item {
          color: #8f8f8f;
          font-size: 12px;
          text-align: center;
          margin-bottom: 2px;
        }
      }
    }
  }

  // 左右震动动画
  @keyframes rotate-loading {
    0% {
      transform: rotate(0);
    }

    100% {
      transform: rotate(360deg);
    }
  }
</style>
