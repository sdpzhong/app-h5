/*
 * @Author: zq
 * @Date: 2022-10-25 15:41:47
 * @Last Modified by: sdpzhong
 * @Last Modified time: 2024-02-26 19:18:48
 */
import { CacheKeysEnum } from '@/constants/enums/cacheKeysEnum';
import { createLocalStorage } from '@/utils/cache';
import type { AppState } from '@/stores/modules/app';

const appCacheStorage = createLocalStorage({});

export const getAppSettingCache = (): Nullable<AppState> =>
  appCacheStorage.get(CacheKeysEnum.APP_SETTING) || null;

export const setAppSettingCache = (appSetting: AppState) =>
  appCacheStorage.set(CacheKeysEnum.APP_SETTING, appSetting);

export const removeAppSettingCache = () => appCacheStorage.remove(CacheKeysEnum.APP_SETTING);
