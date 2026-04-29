/*
 * @Author: sdpzhong
 * @Date: 2024-04-15 17:55:59
 * @Last Modified by: sdpzhong
 * @Last Modified time: 2024-04-15 18:00:08
 */

import { CacheKeysEnum } from '@/constants/enums/cacheKeysEnum';
import { createLocalStorage } from '@/utils/cache';
import type { AppEnvInfoState } from '@/stores/modules/env';

const appEnvCacheStorage = createLocalStorage({});

export const getAppEnvCache = (): Nullable<AppEnvInfoState> =>
  appEnvCacheStorage.get(CacheKeysEnum.APP_ENV) || null;

export const setAppEnvCache = (appSetting: AppEnvInfoState) =>
  appEnvCacheStorage.set(CacheKeysEnum.APP_ENV, appSetting);

export const removeAppEnvCache = () => appEnvCacheStorage.remove(CacheKeysEnum.APP_SETTING);
