/*
 * @Author: sdpzhong
 * @Date: 2024-12-26 14:48:51
 * @Last Modified by: sdpzhong
 * @Last Modified time: 2024-12-27 15:43:34
 */

import { imLogin } from '@/api/modules/im';
import { getUserDeviceList } from '@/api/modules/iot-device';
import { IMSDK } from '@/utils/open-im';
import {
  LoginStatus,
  Platform,
  type ConversationItem,
  type MessageItem,
} from '@openim/wasm-client-sdk';
import { defineStore } from 'pinia';
import { showConfirmDialog } from 'vant';

export enum ConnectStateEnum {
  Loading,
  Success,
  Failed,
}

export interface ImServieState {
  imLoginLoading: boolean;
  imLoginInfo: OpenImLoginInfo | null;
  imServiceState: any;
  conversationList: ConversationItem[];
  deviceList: UserDeviceInfo[];
  selectDeviceSn: string;
  connectState: ConnectStateEnum;
}

export const useImService = defineStore('app-im', {
  state: (): ImServieState => ({
    imLoginLoading: false,
    imLoginInfo: null,
    imServiceState: 0,
    conversationList: [],
    deviceList: [],
    selectDeviceSn: '',
    connectState: ConnectStateEnum.Failed,
  }),
  getters: {
    customerConversation(): ConversationItem | undefined {
      return this.conversationList.find((e) => e.userID + '' === this.imLoginInfo?.customerUserId);
    },
    selectDevice(): UserDeviceInfo | undefined {
      return this.deviceList.find((e) => e.sn === this.selectDeviceSn);
    },
  },
  actions: {
    async login() {
      try {
        this.imLoginLoading = true;
        if (!this.imLoginInfo) {
          const res = await imLogin();
          this.imLoginInfo = res;
        }
        await this.afterLogin();
      } catch (e) {
        console.log('im login fail: ', e);
        this.showRetryLoginDialog();
      } finally {
        this.imLoginLoading = false;
      }
    },
    async afterLogin() {
      if (this.imLoginInfo) {
        const { data } = await IMSDK.getLoginStatus();
        if (data === LoginStatus.Logged) {
          return;
        }
        const { userId, token, apiAddress, websocketAddress } = this.imLoginInfo;
        await IMSDK.login({
          userID: userId,
          token: token,
          platformID: Platform.Web,
          apiAddr: apiAddress,
          wsAddr: websocketAddress,
        });
      }
    },
    // 获取所有会话列表
    async getAllConversationList() {
      try {
        const { data } = await IMSDK.getAllConversationList();
        this.conversationList = data;
        console.log('getAllConversationList: ', data);
      } catch (e) {
        console.log('getAllConversationList fail:', e);
      }
    },
    // 获取设备列表数据
    async getDeviceList() {
      try {
        const res = await getUserDeviceList();
        this.deviceList = res;
        if (res.length) {
          this.selectDeviceSn = this.deviceList[0].sn;
        }
      } catch (e) {
        console.log('getDeviceList fail: ', e);
      }
    },
    sendImMsg(message: MessageItem) {
      return IMSDK.sendMessage({
        recvID: this.customerConversation?.userID!,
        message: message,
        groupID: '',
      });
    },
    showRetryLoginDialog() {
      console.log('retry!');
      showConfirmDialog({
        title: '提示',
        message: '客服服务连接失败，是否重试？',
      })
        .then(() => {
          this.login();
        })
        .catch(() => {
          // on cancel
        });
    },
    logout() {
      return IMSDK.logout();
    },
  },
});
