/*
 * @Author: sdpzhong
 * @Date: 2024-12-26 19:09:05
 * @Last Modified by: sdpzhong
 * @Last Modified time: 2024-12-26 19:55:26
 * @Desc: 初始化im事件监听
 */

import { onMounted, onUnmounted } from 'vue';
import { IMSDK } from '@/utils/open-im';
import {
  CbEvents,
  type ConversationItem,
  type MessageItem,
  type WSEvent,
} from '@openim/wasm-client-sdk';
import { ConnectStateEnum, useImService } from '@/stores';

export function useGlobalEvent() {
  const imService = useImService();

  console.log('useGlobalEvent setup!');
  // 注册事件监听
  // https://docs.openim.io/zh-Hans/sdks/callback
  const setIMListener = () => {
    // 连接中
    IMSDK.on(CbEvents.OnConnecting, onConnectingHandler);
    // 连接成功
    IMSDK.on(CbEvents.OnConnectSuccess, onConnectSuccessHandler);
    // 连接失败
    IMSDK.on(CbEvents.OnConnectFailed, onConnectFailedHandler);
    // token过期
    IMSDK.on(CbEvents.OnUserTokenExpired, onUserTokenExpiredHandler);
    // 被踢下线
    IMSDK.on(CbEvents.OnKickedOffline, onKickedOfflineHandler);
    // 新消息
    IMSDK.on(CbEvents.OnRecvNewMessages, onRecvNewMessagesHandler);
    // 新会话
    IMSDK.on(CbEvents.OnNewConversation, onNewConversationHandler);
  };

  // handlers
  const onConnectingHandler = (_data: WSEvent) => {
    imService.connectState = ConnectStateEnum.Loading;
  };
  const onConnectSuccessHandler = (_data: WSEvent) => {
    imService.connectState = ConnectStateEnum.Success;
    if (!imService.conversationList.length) {
      imService.getAllConversationList();
    }
  };
  const onConnectFailedHandler = (_data: WSEvent) => {
    imService.connectState = ConnectStateEnum.Failed;
  };
  const onUserTokenExpiredHandler = (_data: WSEvent) => {};
  const onKickedOfflineHandler = (_data: WSEvent) => {};
  // 不处理聊天消息
  const onRecvNewMessagesHandler = (_data: WSEvent<MessageItem[]>) => {};
  const onNewConversationHandler = (_data: WSEvent<ConversationItem[]>) => {};

  // 移除事件监听
  const disposeIMListener = () => {
    IMSDK.off(CbEvents.OnConnecting, onConnectingHandler);
    IMSDK.off(CbEvents.OnConnectSuccess, onConnectSuccessHandler);
    IMSDK.off(CbEvents.OnConnectFailed, onConnectFailedHandler);
    IMSDK.off(CbEvents.OnUserTokenExpired, onUserTokenExpiredHandler);
    IMSDK.off(CbEvents.OnKickedOffline, onKickedOfflineHandler);
    IMSDK.off(CbEvents.OnRecvNewMessages, onRecvNewMessagesHandler);
    IMSDK.off(CbEvents.OnNewConversation, onNewConversationHandler);
  };

  onMounted(() => {
    setIMListener();
  });

  onUnmounted(() => {
    disposeIMListener();
  });
}
