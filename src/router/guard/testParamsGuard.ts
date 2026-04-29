/*
 * @Author: sdpzhong
 * @Date: 2024-08-24 10:51:48
 * @Last Modified by: sdpzhong
 * @Last Modified time: 2024-08-24 11:06:18
 */

import { setCacheToken } from '@/stores/auth';
import type { Router } from 'vue-router';

export default function createTestParamsGuard(router: Router) {
  router.afterEach((to) => {
    const token = (to.query['token'] ?? '') as string;
    if (token) {
      console.log('set new token: ', token);
      setCacheToken(token);
    }
  });
}
