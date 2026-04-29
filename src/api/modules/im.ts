/*
 * @Author: sdpzhong
 * @Date: 2024-11-22 16:51:18
 * @Last Modified by: sdpzhong
 * @Last Modified time: 2024-11-22 17:12:52
 */

import type { ErrorMessageMode } from '#/axios';
import { http } from '../config';

enum Api {
  IM_LOGIN = '/ucenter/app/v1/im/client/login',
}

/**
 * @description: 获取im账号登录信息
 */
export function imLogin(data = {}, mode: ErrorMessageMode = 'notify') {
  return http.post<OpenImLoginInfo>(
    {
      url: Api.IM_LOGIN,
      data,
    },
    {
      errorMessageMode: mode,
    },
  );
}
