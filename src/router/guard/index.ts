/*
 * @Author: zq
 * @Date: 2022-10-24 17:40:31
 * @Last Modified by: sdpzhong
 * @Last Modified time: 2025-03-26 11:37:39
 * @Desc： 路由守卫配置文件
 */

import type { Router } from 'vue-router';
import createHttpGuard from './httpCancelGuard';
import createTestParamsGuard from './testParamsGuard';
import { createBgCoverGuard } from './webviewCoverGuard';

// 挂载路由守卫函数
export function setupRouterGuard(router: Router) {
  createHttpGuard(router);
  createBgCoverGuard(router);
  if (import.meta.env.VITE_URL_TEST) {
    createTestParamsGuard(router);
  }
  // createTitleFixGuard(router);
}
