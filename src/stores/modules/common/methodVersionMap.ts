/*
 * @Author: sdpzhong
 * @Date: 2025-03-14 10:16:54
 * @Last Modified by: sdpzhong
 * @Last Modified time: 2025-03-14 16:40:55
 * @desc：app 原生行为调用版本号
 */

import type { MethodNames } from '@/stores';
import { isAndroid, isIOS } from '@/utils/env';
import { compareVersions } from '@/utils/version';

export interface AppActionVersion {
  android?: string;
  ios?: string;
  isIngore?: boolean;
}

export const appVersionMap: Indexable<AppActionVersion> = {
  setScreenStatus: {
    android: '2.14.0',
  },
};

export function checkAppVersion(methodName: MethodNames, version: string): boolean {
  const appVersion = appVersionMap[methodName];
  if (!appVersion) {
    return false;
  }
  if (appVersion.isIngore) {
    return true;
  }
  // 判断当前环境
  if (isIOS()) {
    if (appVersion.ios) {
      console.log(`【${methodName}】 ios版本号：${version}，所需最低版本号：${appVersion.ios}`);
      return compareVersions(version, appVersion.ios) >= 0;
    }
    return true;
  }

  if (isAndroid() && appVersion.android) {
    if (appVersion.android) {
      console.log(
        `【${methodName}】 android版本号：${version}，所需最低版本号：${appVersion.android}`,
      );
      return compareVersions(version, appVersion.android) >= 0;
    }

    return true;
  }

  return false;
}
