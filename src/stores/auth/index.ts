/*
 * @Author: zq
 * @Date: 2022-10-24 16:54:20
 * @Last Modified by: sdpzhong
 * @Last Modified time: 2024-02-26 17:56:53
 */

import { CacheKeysEnum } from '@/constants/enums/cacheKeysEnum';
import { createLocalStorage } from '@/utils/cache';

const tokenCacheStorage = createLocalStorage({});

export const getCacheToken = () => tokenCacheStorage.get(CacheKeysEnum.TOKEN_KEY);

export const setCacheToken = (token: string) =>
  tokenCacheStorage.set(CacheKeysEnum.TOKEN_KEY, token);

export const removeCacheToken = () => tokenCacheStorage.remove(CacheKeysEnum.TOKEN_KEY);

export const hasCacheToken = () => !!getCacheToken();
