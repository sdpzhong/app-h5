/*
 * @Author: sdpzhong
 * @Date: 2024-11-25 15:10:53
 * @Last Modified by: sdpzhong
 * @Last Modified time: 2024-12-30 18:09:51
 */

import { getSDK } from '@openim/wasm-client-sdk';
import { onBeforeUnmount } from 'vue';

// 初始化sdk
// eslint-disable-next-line
// @ts-ignore
export const IMSDK: ReturnType<typeof getSDK> = getSDK({
  coreWasmPath: './openIM.wasm',
  sqlWasmPath: '/sql-wasm.wasm',
  debug: false, // false不打印日志
});

/**
 * im sdk 下载完成初始化监听回调
 * @param mode
 */
export function useImSdkInitCallback() {
  let timer: any = null;

  function initCallback(mode: 'caches' | 'default' = 'default', interval: number = 500) {
    return new Promise<void>((resolve, _reject) => {
      timer = setInterval(async () => {
        if (mode === 'caches' && window.caches) {
          const hasSdkCache = await caches.has('openim-wasm-cache');
          if (hasSdkCache) {
            clearInterval(timer);
            resolve();
          }
          // retry
        } else {
          IMSDK.getLoginStatus()
            .then(() => {
              clearInterval(timer);
              resolve();
            })
            .catch(() => {
              // retry
            });
        }
      }, interval);
    });
  }

  onBeforeUnmount(() => {
    clearInterval(timer);
  });

  return {
    initCallback,
  };
}
