/*
 * @Author: zq
 * @Date: 2022-10-22 11:25:32
 * @Last Modified by: sdpzhong
 * @Last Modified time: 2024-04-19 10:06:16
 * @desc: 请求实例配置文件
 */
import type { AxiosTransform, CreateAxiosOptions } from './axiosConfig';
import { VAxios } from './axiosConfig';
import { merge, clone } from 'lodash-es';
import { ContentTypeEnum, RequestEnum, ResultEnum } from '@/constants/enums/httpEnum';
import type { AxiosResponse } from 'axios';
import type { ErrorMessageMode, RequestOptions, Result } from '#/axios';
import { showNotify, showDialog, showToast } from 'vant';
import { isString } from '@/utils/is';
import { formatRequestDate, joinTimestamp, setObjToUrlParams } from './helper';
import { checkStatus } from './checkStatus';
import { useUserStore } from '@/stores/modules/user';
import { getAppEnvCache } from '@/stores/cache/appEnvCache';
import { isDevMode } from '@/utils/env';
import { useI18n } from '@/hooks/useI18nWithOut';
import { CacheKeysEnum } from '@/constants/enums/cacheKeysEnum';

// import nprogress from '@/utils/nprogress';

// 数据处理中间件 & 拦截器
const transform: AxiosTransform = {
  /**
   * @description: 处理请求数据。如果数据不是预期格式，可直接抛出错误
   */
  transformRequestHook: (res: AxiosResponse<Result>, options: RequestOptions) => {
    const { t } = useI18n();
    const { isTransformResponse, isReturnNativeResponse } = options;
    // 是否返回原生响应头 比如：需要获取响应头时使用该属性
    if (isReturnNativeResponse) {
      // 处理文件导出失败的json数据（blob转json）
      if (res.data.type === 'application/json') {
        const responseBlob = res.data as any;
        return new Promise((_resolve, reject) => {
          const reader = new FileReader(); //创建一个FileReader实例
          reader.readAsText(responseBlob, 'utf-8'); //读取文件,结果用字符串形式表示
          reader.onload = function () {
            //读取完成后,**获取reader.result**
            const result = JSON.parse(reader.result as string);
            reject(result);
          };
        });
      }
      return res;
    }
    // 不进行任何处理，直接返回
    // 用于页面代码可能需要直接获取code，data，message这些信息时开启
    if (!isTransformResponse) {
      return res.data;
    }
    // 错误的时候返回
    const { data } = res;

    if (!data) {
      // return '[HTTP] Request has no return value';
      // '请求出错，请稍后重试'
      throw new Error(t('http.request-error'));
    }
    //  这里 code，result，message为 后台统一的字段，需要在 types.ts内修改为项目自己的接口返回格式
    const { errcode, errmsg, data: result } = data as Result;

    // 这里逻辑可以根据项目进行修改
    // const hasSuccess = data && Reflect.has(data, 'code') && code === ResultEnum.SUCCESS;
    if (errcode === 0) {
      return result;
    }

    // 在此处根据自己项目的实际情况对不同的code执行不同的操作
    // 如果不希望中断当前请求，请return数据，否则直接抛出异常即可
    let timeoutMsg = '';
    switch (errcode) {
      case ResultEnum.TIMEOUT:
        timeoutMsg = '登录超时，请重新登录';
        // 。。。 后续返回登录操作
        break;
      default:
        if (errmsg) {
          timeoutMsg = errmsg;
        }
    }

    // dialog 弹窗提示，notify 顶部横栏提示， toast 轻提示
    if (options.errorMessageMode === 'dialog') {
      showDialog({ title: t('toast.tip'), message: timeoutMsg });
    } else if (options.errorMessageMode === 'notify') {
      showNotify({ type: 'danger', message: timeoutMsg });
    } else if (options.errorMessageMode === 'toast') {
      showToast({ type: 'text', message: timeoutMsg });
    }

    throw new Error(timeoutMsg || t('http.request-error'));
  },

  // 请求之前处理config
  beforeRequestHook: (config, options) => {
    const { apiUrl, joinPrefix, joinParamsToUrl, formatDate, joinTime = true, urlPrefix } = options;

    if (joinPrefix) {
      config.url = `${urlPrefix}${config.url}`;
    }

    if (apiUrl && isString(apiUrl)) {
      config.url = `${apiUrl}${config.url}`;
    }
    const params = config.params || {};
    const data = config.data || false;
    formatDate && data && !isString(data) && formatRequestDate(data);
    if (config.method?.toUpperCase() === RequestEnum.GET) {
      if (!isString(params)) {
        // 给 get 请求加上时间戳参数，避免从缓存中拿数据。
        config.params = Object.assign(params || {}, joinTimestamp(joinTime, false));
      } else {
        // 兼容restful风格
        config.url = config.url + params + `${joinTimestamp(joinTime, true)}`;
        config.params = undefined;
      }
    } else {
      if (!isString(params)) {
        formatDate && formatRequestDate(params);
        if (
          (Reflect.has(config, 'data') && config.data && Object.keys(config.data).length > 0) ||
          config.headers?.['Content-Type'] === ContentTypeEnum.FORM_DATA
        ) {
          config.data = data;
          config.params = params;
        } else {
          // 非GET请求如果没有提供data，则将params视为data
          config.data = params;
          config.params = undefined;
        }
        if (joinParamsToUrl) {
          config.url = setObjToUrlParams(
            config.url as string,
            Object.assign({}, config.params, config.data),
          );
        }
      } else {
        // 兼容restful风格
        config.url = config.url + params;
        config.params = undefined;
      }
    }
    return config;
  },

  /**
   * @description: 请求拦截器处理
   */
  requestInterceptors: (config, options) => {
    // 进度指示器
    // nprogress.done();
    // nprogress.start();

    // 请求之前处理config
    const userStore = useUserStore();
    // 绑定 token
    const token = userStore.getToken;
    if (token && (config as Recordable)?.requestOptions?.withToken !== false) {
      // jwt token
      (config as Recordable).headers.Authorization = options.authenticationScheme
        ? `${options.authenticationScheme} ${token}`
        : token;
    }

    const locale = localStorage.getItem(CacheKeysEnum.APP_LOCALE);
    if (locale) {
      // 追加国际化标识
      (config as Recordable).headers.Locale = locale;
    }

    const countryCode = localStorage.getItem(CacheKeysEnum.APP_COUNTRY_CODE);
    if (countryCode) {
      // 追加国家或区域标识
      (config as Recordable).headers['Country-Code'] = countryCode;
    }

    return config;
  },

  /**
   * @description: 响应拦截器处理
   */
  responseInterceptors: (res: AxiosResponse<any>) => {
    // 进度指示器
    // nprogress.done();

    return res;
  },

  /**
   * @description: 响应错误处理
   */
  responseInterceptorsCatch: (_axiosInstance: AxiosResponse, error: any) => {
    const { t } = useI18n();
    const { response, code, message, config } = error || {};
    const errorMessageMode: ErrorMessageMode = config?.requestOptions?.errorMessageMode || 'none';
    const msg: string = response?.data?.error?.message ?? '';
    const err: string = error?.toString?.() ?? '';
    let errMessage = '';

    try {
      if (code === 'ECONNABORTED' && message.indexOf('timeout') !== -1) {
        errMessage = t('http.request-time-out');
      }
      if (err?.includes('Network Error')) {
        errMessage = t('http.network-error');
      }

      if (errMessage) {
        if (errorMessageMode === 'dialog') {
          showDialog({ title: t('toast.tip'), message: errMessage });
        } else if (errorMessageMode === 'notify') {
          showNotify({ type: 'danger', message: errMessage });
        } else if (errorMessageMode === 'toast') {
          showToast({ message: errMessage });
        }
        return Promise.reject(error);
      }
    } catch (error) {
      throw new Error(error as unknown as string);
    }

    checkStatus(error?.response?.status, msg, errorMessageMode);

    return Promise.reject(error);
  },
};

function createAxios(config: CreateAxiosOptions = {}) {
  let baseUrl: string;
  if (isDevMode()) {
    baseUrl = getAppEnvCache()?.baseUrl ?? import.meta.env.VITE_GLOB_API_URL;
  } else {
    baseUrl = import.meta.env.VITE_GLOB_API_URL;
  }

  return new VAxios(
    merge(
      {
        // See https://developer.mozilla.org/en-US/docs/Web/HTTP/Authentication#authentication_schemes
        // authentication schemes，e.g: Bearer
        authenticationScheme: 'Bearer',
        timeout: 20 * 1000,
        // 基础接口地址
        // baseURL: globSetting.apiUrl,
        headers: { 'Content-Type': ContentTypeEnum.JSON },
        // 如果是form-data格式
        // headers: { 'Content-Type': ContentTypeEnum.FORM_URLENCODED },
        // 数据处理方式
        transform: clone(transform),
        // 配置项，下面的选项都可以在独立的接口请求中覆盖
        requestOptions: {
          // 默认将prefix 添加到url
          joinPrefix: true,
          // 是否返回原生响应头 比如：需要获取响应头时使用该属性
          isReturnNativeResponse: false,
          // 需要对返回数据进行处理
          isTransformResponse: true,
          // post请求的时候添加参数到url
          joinParamsToUrl: false,
          // 格式化提交参数时间
          formatDate: true,
          // 消息提示类型
          errorMessageMode: 'notify',
          // 接口地址
          apiUrl: baseUrl,
          // 接口拼接地址
          urlPrefix: '',
          //  是否加入时间戳
          joinTime: true,
          // 忽略重复请求
          ignoreCancelToken: true,
          // 是否携带token
          withToken: true,
        },
      },
      config,
    ),
  );
}

// 创建请求实例，并暴露之
export const http = createAxios();
