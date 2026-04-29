/*
 * @Author: sdpzhong
 * @Date: 2024-08-24 10:53:12
 * @Last Modified by:   sdpzhong
 * @Last Modified time: 2024-08-24 10:53:12
 */

import { AxiosCanceler } from '@/api/config/axiosCancel';
import type { Router } from 'vue-router';

/**
 * The interface used to close the current page to complete the request when the route is switched
 * 切换页面时，将取消所有的正在等待的请求
 * @param router
 */
export default function createHttpGuard(router: Router) {
  const axiosCanceler = new AxiosCanceler();

  router.beforeEach(async () => {
    // Switching the route will delete the previous request
    axiosCanceler?.removeAllPending();
    return true;
  });
}
