/*
 * @Author: sdpzhong
 * @Date: 2024-08-24 10:51:37
 * @Last Modified by: sdpzhong
 * @Last Modified time: 2024-08-24 10:52:05
 */

import { getAppEnvConfig } from '@/utils/env';
import type { Router } from 'vue-router';

/**
 * 修改页面标题
 * @param router
 */
export function createTitleFixGuard(router: Router) {
  const { VITE_GLOB_APP_TITLE } = getAppEnvConfig();
  router.afterEach((to) => {
    document.title = to.meta.title ?? VITE_GLOB_APP_TITLE;
  });
}
