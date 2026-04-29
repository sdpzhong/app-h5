<template>
  <div class="expire-time-countdown" v-if="countdownSeconds > 0">
    <img src="/src/assets/images/purchase/icon-red-alarm.png" alt="" />
    <span class="expire-time-countdown__text">{{ $t('purchase.discount-countdown') }}</span>
    <div class="exp-countdown">
      <div class="exp-countdown__item">{{ getTimeUnitCount('hour') }}</div>
      <div class="exp-countdown__divider">:</div>
      <div class="exp-countdown__item">{{ getTimeUnitCount('minute') }}</div>
      <div class="exp-countdown__divider">:</div>
      <div class="exp-countdown__item">{{ getTimeUnitCount('second') }}</div>
      <div class="exp-countdown__divider"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import dayjs from 'dayjs';
  import { onBeforeUnmount, ref, watch } from 'vue';

  const props = defineProps({
    expTime: {
      type: [String, Number],
    },
  });

  let countDownTimer: IntervalHandle;
  let countdownSeconds = ref(0);

  watch(
    () => props.expTime,
    () => {
      countdownSeconds.value = computedCountDownSeconds();
      // 开启计时器
      clearInterval(countDownTimer);
      if (countdownSeconds.value > 0) {
        countDownTimer = setInterval(() => {
          countdownSeconds.value--;
        }, 1000);
      }
    },
    {
      immediate: true,
    },
  );

  onBeforeUnmount(() => {
    clearInterval(countDownTimer);
  });

  function computedCountDownSeconds() {
    if (!props.expTime) {
      return 0;
    }
    const expTimeDate = dayjs(props.expTime);
    const seconds = expTimeDate.diff(+new Date(), 'seconds');
    // 过滤负数和NaN
    return seconds > 0 ? seconds : 0;
  }

  /**
   * 获取各个时间单位对应的数值
   *
   * @param type 'hour' | 'minute' | 'second' 时间单位类型
   */
  function getTimeUnitCount(type: 'hour' | 'minute' | 'second'): string {
    if (type === 'second') {
      return (countdownSeconds.value % 60).toString().padStart(2, '0');
    }
    if (type === 'minute') {
      return (Math.floor(countdownSeconds.value / 60) % 60).toString().padStart(2, '0');
    }
    if (type === 'hour') {
      return Math.floor(countdownSeconds.value / 3600)
        .toString()
        .padStart(2, '0');
    }
    return '00';
  }
</script>

<style scoped lang="less">
  .expire-time-countdown {
    height: 25px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 400;
    font-size: 11px;
    color: #ff2d55;
    background-color: rgba(255, 45, 85, 0.2);
    > img {
      display: block;
      height: 15px;
      width: 15px;
      object-fit: contain;
    }

    &__text {
      margin: 0 4px;
    }

    .exp-countdown {
      display: flex;
      align-items: baseline;

      &__item {
        width: 18px;
        height: 18px;
        border-radius: 3px;
        background-color: #ff2d55;
        color: #fff;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      &__divider {
        margin: 0 4px;
      }
    }
  }
</style>
