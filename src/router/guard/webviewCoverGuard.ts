/*
 * @Author: sdpzhong
 * @Date: 2025-03-26 11:28:43
 * @Last Modified by: sdpzhong
 * @Last Modified time: 2025-03-26 15:57:26
 * @Desc: 动态变更网页背景图
 */

import { useMethodChannelStore } from '@/stores';
import type { Router } from 'vue-router';

/**
 * 动态变更网页背景图
 * @param router
 */
export function createBgCoverGuard(router: Router) {
  router.afterEach((to) => {
    const { postMessage } = useMethodChannelStore();
    if (to.meta.bgCover) {
      // navBarStyle 导航栏风格：white:白色 black:黑色 (为null或空字符串则不设置)
      // isNeedPageBg 是否需要背景图片，true取pageBgUrl显示，false时背景为白色
      // pageBgUrl 页面背景图片
      postMessage({
        method: 'setPageUI',
        data: {
          navBarStyle: '',
          isNeedPageBg: true,
          pageBgUrl: location.origin.concat(to.meta.bgCover),
        },
      });
    } else {
      postMessage({
        method: 'setPageUI',
        data: {
          navBarStyle: 'white',
          isNeedPageBg: false,
          pageBgUrl: '',
        },
      });
    }
  });
}
