/*
 * @Author: sdpzhong
 * @Date: 2024-03-12 14:51:37
 * @Last Modified by: sdpzhong
 * @Last Modified time: 2025-03-26 13:53:54
 * @desc: 用于和移动端交互通道
 * https://www.tapd.cn/47505024/markdown_wikis/show/?qy_private_corpid=#1147505024001000304
 */

import mitt from 'mitt';
import { defineStore } from 'pinia';
import { useAppEnvStore } from './env';
import { checkAppVersion } from './common/methodVersionMap';

export const METHOD_CHANNEL_NAME = 'sendMsg';

export type MethodNames =
  | 'getDeviceCover'
  | 'getToken'
  | 'setDeviceSetting'
  | 'getDeviceSetting'
  | 'appRouter'
  | 'startPay'
  | 'OpenWeb'
  | 'getAPPInfo'
  | 'saveImage'
  | 'startNetworkCheck'
  | 'appAction'
  | 'setScreenStatus'
  | 'setPageUI';

export type AppActionType = 'shutOff' | 'goBack' | 'paste';

export interface AppAction {
  action: AppActionType;
  value: string;
}

export interface IMethodChannelMessage<T = any> {
  method: MethodNames;
  data: T;
}

export type WindowProperty = Window & typeof globalThis & Indexable;

export type MittEvents = {
  acceptMessage: IMethodChannelMessage;
};

export type IMethodChannelCallBack<T = any> = (message: IMethodChannelMessage<T>) => void;

export const useMethodChannelStore = defineStore('app-method-channel', () => {
  const appEnvStore = useAppEnvStore();

  const windowInstance: WindowProperty = window;

  const mitter = mitt<MittEvents>();

  // 发送
  function postMessage<T = any>(message: IMethodChannelMessage<T>) {
    const messageRaw = JSON.stringify(message);
    if (windowInstance.webkit) {
      console.log(`postMessage: ${messageRaw}`);
      windowInstance.webkit.messageHandlers?.[METHOD_CHANNEL_NAME]?.postMessage(messageRaw);
    } else {
      console.warn('==== window.webkit 未注册 ====');
    }

    if (windowInstance.android) {
      console.log(`postMessage: ${messageRaw}`);
      windowInstance.android[METHOD_CHANNEL_NAME]?.(messageRaw);
    } else {
      console.warn('==== window.android 未注册 ====');
    }
  }

  // 接收
  windowInstance[METHOD_CHANNEL_NAME] = function (message: IMethodChannelMessage) {
    console.log('acceptMessage: ', message);
    mitter.emit('acceptMessage', message);
  };

  // 发送消息，同时版本检查
  function postMessageAndCheckVersion<T = any>(message: IMethodChannelMessage<T>) {
    // 判断版本
    if (appEnvStore.baseInfo && appEnvStore.baseInfo.appVer) {
      if (checkAppVersion(message.method, appEnvStore.baseInfo.appVer)) {
        postMessage(message);
      } else {
        console.log(`版本不支持 Method:  ${message.method}`);
      }
    } else {
      console.log(`版本信息不存在，${message.method} 无法调用`);
    }
  }

  function acceptMessage<T = any>(callback: IMethodChannelCallBack<T>) {
    return mitter.on('acceptMessage', function (params) {
      // params.data = JSON.parse(params.data);
      callback(params);
    });
  }

  return {
    postMessage,
    postMessageAndCheckVersion,
    mitter,
    acceptMessage,
  };
});
