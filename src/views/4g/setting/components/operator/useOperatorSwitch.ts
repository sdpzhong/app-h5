/*
 * @Author: sdpzhong
 * @Date: 2025-02-26 15:42:43
 * @Last Modified by: sdpzhong
 * @Last Modified time: 2025-02-26 16:24:19
 */

import { CacheKeysEnum } from '@/constants/enums/cacheKeysEnum';

export function useOperatorSwitch() {
  // 1. 记录过程结束时间。
  // 2. 每次唤醒后，清除定时器。
  // 3. 创建新的定时器，时长为结束时间和当前时间计算获得。
  // 4. 如果当前时间已经超过结束时间，直接当作超时处理。

  const processDuration = 10 * 60 * 1000; // 10分钟

  function updateProcessEndTime() {
    localStorage.setItem(
      CacheKeysEnum.OPT_SWICTH_TIME_KEY,
      (+new Date() + processDuration).toString(),
    );
  }

  return {
    updateProcessEndTime,
  };
}
