import { defineStore } from 'pinia';
import { getAppEnvCache, setAppEnvCache } from '../cache/appEnvCache';
import { isDevMode } from '@/utils/env';
import { http } from '@/api/config';
import { BaseUrls } from '@/api/config/axiosConfig';
import { useUserStore } from './user';
import { CacheKeysEnum } from '@/constants/enums/cacheKeysEnum';

/**
 language 本地语言： en_US:英语 zh_CN:简体中文
identifier 设备唯一标识
appVer APP当前版本
platform 平台： ios:苹果设备 android:安卓设备
region 区域： domestic:国内版 oversea:国际版
 */

export interface AppEnvInfoState {
  baseInfo: AppBaseInfo;
  baseUrl?: string;
  isShowEnvButton: boolean;
}

export interface AppBaseInfo {
  language?: string;
  identifier?: string;
  appVer?: string;
  platform?: 'ios' | 'android';
  region?: 'domestic' | 'oversea';
  token?: string;
  'Country-Code'?: string;
  [x: string]: any;
}

export const useAppEnvStore = defineStore('app-env', {
  state: (): AppEnvInfoState => ({
    baseInfo: {},
    isShowEnvButton: false,
    baseUrl: undefined,
  }),
  getters: {
    isOverseaEnv(): boolean {
      return this.baseUrl === BaseUrls.overseasProductionBaseUrl;
    },
  },
  actions: {
    setAppBaseInfo(info: AppBaseInfo, callback?: Function) {
      this.baseInfo = info;
      // develop 环境下读取缓存中的 url 基地址
      // src/api/config/index.ts
      if (this.baseInfo?.region === 'oversea') {
        this.changeBaseUrl(BaseUrls.overseasProductionBaseUrl);
      }

      if (this.baseInfo?.region === 'domestic') {
        this.changeBaseUrl(BaseUrls.productionBaseUrl);
      }

      if (!this.baseInfo?.region) {
        this.changeBaseUrl(import.meta.env.VITE_GLOB_API_URL);
      }

      // 同步国家或区域码
      if (this.baseInfo['Country-Code']) {
        localStorage.setItem(CacheKeysEnum.APP_COUNTRY_CODE, this.baseInfo['Country-Code']);
      }

      // 同步语言
      if (this.baseInfo?.language) {
        callback?.();
      }

      // 同步 Token
      if (this.baseInfo?.token) {
        const userStore = useUserStore();
        // 比对token，如果不一致。清除设备消息发送缓存
        if (this.baseInfo?.token !== userStore.getToken) {
          localStorage.removeItem(CacheKeysEnum.APP_SEND_DEVICE_INFO_CACHE);
        }
        userStore.setToken(this.baseInfo.token);
      }
    },
    initEnvCacheInfo() {
      const cache = getAppEnvCache();

      this.$state = { ...this.$state, ...(cache ?? {}) };

      this.baseUrl ??= import.meta.env.VITE_GLOB_API_URL;

      if (isDevMode()) {
        // 变更接口地址
        // http.getAxiosConfig().baseURL = this.baseUrl;
        http.getAxiosConfig()!.requestOptions!.apiUrl = this.baseUrl;

        if (cache === null) {
          this.isShowEnvButton = true;
        }
      }
    },
    saveEnvCache() {
      setAppEnvCache(this.$state);
    },
    changeBaseUrl(url: string) {
      this.baseUrl = url;
      if (isDevMode()) {
        http.getAxiosConfig()!.requestOptions!.apiUrl = this.baseUrl;
        this.saveEnvCache();
      }
    },
  },
});
