/*
 * @Author: sdpzhong
 * @Date: 2024-02-26 17:14:15
 * @Last Modified by: sdpzhong
 * @Last Modified time: 2024-07-22 16:02:01
 */

import type { ErrorMessageMode } from '#/axios';
import { http } from '../config';

enum Api {
  IOT_APP_LOGIN = '/ucenter/app/web/v1/login',
  SEND_VAILDATY_CODE = '/ucenter/open/app/web/v1/verify_code/send',
  CANCEL_ACCOUINT = '/dispatch/app/web/v1/revoked',
  GET_IOT_APP_USER_INFO = '/ucenter/app/v1/userInfo',
}

/**
 * @description: 账号登录
 */
export function iotAppUserLogin(data: IotAppUserLoginForm, mode: ErrorMessageMode = 'notify') {
  return http.post<IotAppUserLoginResponse>(
    {
      url: Api.IOT_APP_LOGIN,
      data,
    },
    {
      errorMessageMode: mode,
    },
  );
}

/**
 * @description: 发送（邮箱）验证码
 */
export function sendValidateCode(
  data: {
    username: string;
    scene: 'login' | 'ignore_password' | 'login_web';
  },
  mode: ErrorMessageMode = 'notify',
) {
  return http.post<boolean>(
    {
      url: Api.SEND_VAILDATY_CODE,
      data,
    },
    {
      errorMessageMode: mode,
    },
  );
}

/**
 * @description: 获取用户简略信息
 */
export function getIotAppUserInfo(params = {}, mode: ErrorMessageMode = 'notify') {
  return http.get<IotAppUserInfo>(
    {
      url: Api.GET_IOT_APP_USER_INFO,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
}

/**
 * @description: 账号注销（删除账号）
 */
export function cancerIotAppUserAccount(data = {}, mode: ErrorMessageMode = 'notify') {
  return http.post<boolean>(
    {
      url: Api.CANCEL_ACCOUINT,
      data,
    },
    {
      errorMessageMode: mode,
    },
  );
}
