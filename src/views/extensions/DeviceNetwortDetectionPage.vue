<template>
  <div class="device-network-check">
    <div class="center-section">
      <div class="operate-section">
        <div class="loading-element" v-if="loading">
          <img
            class="rotating-element rotating-animation"
            src="/src/assets/images/pie-rotate-loading.png"
            alt=""
          />
          <img class="icon-wifi" src="/src/assets/images/icon-wifi-detect.png" alt="" />
        </div>
        <template v-else>
          <div class="test-btn" @click="handleClick">
            <span class="test-btn-text">
              {{ report ? $t('extensions.network-retest') : $t('extensions.network-test') }}
            </span>
          </div>
        </template>
      </div>
      <div class="status-display-section">
        <div class="loading-text" v-if="loading">{{
          $t('extensions.network-test-loading-tip')
        }}</div>
        <template v-else>
          <div class="ready-status-text" v-if="!report">
            {{ $t('extensions.network-test-tip') }}
          </div>
          <template v-else>
            <div class="status-info" v-if="networkDisplayInfo">
              <div
                class="status-info__title"
                :class="{
                  fail: report.statusCode === 0,
                }"
                ><img :src="networkDisplayInfo.icon" alt="" />{{ networkDisplayInfo.label }}</div
              >
              <div class="status-info__delay">{{
                $t('extensions.network-delay', [report.delay])
              }}</div>
            </div>
          </template>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import useLoading from '@/hooks/loading';
  import { type IMethodChannelMessage, useMethodChannelStore } from '@/stores';
  import { ref, computed, onBeforeUnmount } from 'vue';

  import wifi_0 from '@/assets/images/wifi-0.png';
  import wifi_1 from '@/assets/images/wifi-1.png';
  import wifi_2 from '@/assets/images/wifi-2.png';
  import wifi_3 from '@/assets/images/wifi-3.png';
  import { useI18n } from 'vue-i18n';

  interface NetworkDetectionReport {
    status: number;
    delay: number;
    message: string;
    statusCode: number;
  }

  interface NetworkStatusDisplayInfo {
    icon: string;
    label: string;
  }

  const { t } = useI18n();
  const { acceptMessage, postMessage } = useMethodChannelStore();
  const { loading, setLoading } = useLoading();
  const report = ref<NetworkDetectionReport>();
  let timer: any;

  const networkStatusDisplayInfoMap: { [key: string]: NetworkStatusDisplayInfo } = {
    '0': {
      icon: wifi_0,
      label: t('extensions.network-test-fail'),
    },
    '1': {
      icon: wifi_1,
      label: t('extensions.network-test-bad'),
    },
    '2': {
      icon: wifi_2,
      label: t('extensions.network-test-primary'),
    },
    '3': {
      icon: wifi_3,
      label: t('extensions.network-test-ok'),
    },
  };

  const networkDisplayInfo = computed(
    () => networkStatusDisplayInfoMap[report.value?.statusCode ?? ''],
  );

  // function getRandomInt(min, max) {
  //   return Math.floor(Math.random() * (max - min + 1)) + min;
  // }

  async function handleClick() {
    setLoading(true);
    postMessage({
      method: 'startNetworkCheck',
      data: {},
    });
    // 开始计时， 1分钟后重置状态；
    clearTimeout(timer);
    timer = setTimeout(() => {
      report.value = {
        status: 1,
        delay: 999,
        statusCode: 0,
        message: '',
      };
      setLoading(false);
    }, 1000 * 60);
  }

  function handleReponse(res: IMethodChannelMessage<NetworkDetectionReport>) {
    // const status = getRandomInt(0, 1);
    // const delay = getRandomInt(0, 360);

    const data = res.data;

    report.value = {
      status: data.status,
      delay: data.status ?? 999,
      statusCode: 0,
      message: data.message,
    };

    // status 支付状态 ：0.成功 1.失败
    if (report.value.status === 0) {
      // 判断网络状态
      if (report.value.delay <= 30) {
        report.value!.statusCode = 3;
      } else if (report.value.delay > 30 && report.value.delay <= 70) {
        report.value!.statusCode = 2;
      } else {
        report.value!.statusCode = 1;
      }
    } else {
      report.value!.statusCode = 0;
      report.value!.delay = 999;
    }

    setLoading(false);
  }

  onBeforeUnmount(() => {
    clearTimeout(timer);
    timer = null;
  });

  acceptMessage((e) => {
    console.log('acceptMessage: ', e);
    switch (e.method) {
      case 'startNetworkCheck':
        setLoading(false);
        clearTimeout(timer);
        handleReponse(e);
        break;

      default:
        break;
    }
  });
</script>

<style scoped lang="less">
  @keyframes rotate {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  .rotating-animation {
    animation: rotate 1.25s linear infinite;
  }

  .device-network-check {
    height: 100%;
    padding: 0 26px;
    padding-top: 125px;

    .center-section {
      display: flex;
      flex-direction: column;
      align-items: center;

      .operate-section {
        height: 160px;
        width: 160px;
        margin-bottom: 32px;

        .test-btn {
          height: 100%;
          width: 100%;
          background-image: url('/src/assets/images/network-test-btn-bg.png');
          background-repeat: no-repeat;
          background-position: center;
          background-size: contain;
          display: flex;
          align-items: center;
          justify-content: center;

          .test-btn-text {
            font-weight: 500;
            font-size: 21px;
            color: #ffffff;
            line-height: 24px;
            text-align: left;
            font-style: normal;
            text-transform: none;
          }

          transition: 0.36s opacity;

          &:active {
            opacity: 0.6;
          }
        }

        .loading-element {
          height: 100%;
          width: 100%;
          position: relative;

          .rotating-element {
            height: 160px;
            width: 160px;
            position: absolute;
            display: block;
            object-fit: contain;
          }

          .icon-wifi {
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            width: 45px;
            height: 45px;
            object-fit: contain;
            display: block;
          }
        }
      }

      .status-display-section {
        height: 100%;
        width: 100%;

        .loading-text {
          font-weight: 400;
          font-size: 13px;
          color: #8f8f8f;
          line-height: 16px;
          text-align: center;
          font-style: normal;
          text-transform: none;
        }

        .ready-status-text {
          height: 100%;
          width: 100%;
          font-weight: 400;
          font-size: 13px;
          color: #8f8f8f;
          line-height: 16px;
        }

        .status-info {
          display: flex;
          flex-direction: column;
          align-items: center;
          .status-info__title {
            color: #247cff;
            font-size: 14px;
            display: flex;
            align-items: center;
            > img {
              height: 19px;
              width: 19px;
              object-fit: contain;
              display: block;
              margin-right: 4px;
            }
            margin-bottom: 4px;

            &.fail {
              color: #ff2c2c;
            }
          }

          .status-info__delay {
            color: #8f8f8f;
            font-size: 12px;
          }
        }
      }
    }
  }
</style>
