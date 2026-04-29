import { activateRedeemCode, checkRedeemCode, getUserDeviceList } from '@/api/modules/iot-device';
import { defineStore } from 'pinia';

export interface RedeemStoreState {
  redeemPackageInfo: RedeemCodeInfo | null;
  deviceList: Array<UserDeviceInfo>;
  redeemCode?: string;
  deviceCloudStroageStatusList: Array<DeviceClouStorageStatusInfo>;
  deviceCoverMap: {
    [x: string]: string;
  };
  packageServiceMap: {
    [x: string]: RedeemCodePackageInfo;
  };
}

export const useRedeemStore = defineStore({
  id: 'app-redeem',
  state: (): RedeemStoreState => ({
    redeemPackageInfo: null,
    deviceList: [],
    redeemCode: undefined,
    deviceCloudStroageStatusList: [],
    deviceCoverMap: {},
    packageServiceMap: {},
  }),
  getters: {},
  actions: {
    // 获取兑换码信息
    async requestRedeemCodeInfo(redeemCode: string) {
      const res = await checkRedeemCode(
        {
          activationCode: redeemCode,
        },
        'dialog',
      );

      console.log('requestRedeemCodeInfo:', res);

      this.$patch({
        redeemPackageInfo: res,
        redeemCode,
      });
    },

    // 获取用户设备列表
    async requestUserDeviceList() {
      const deviceList = await getUserDeviceList();

      console.log('requestUserDeviceList: ', deviceList);

      this.deviceList = deviceList;
    },

    // 兑换套餐
    async redeemCloudPackage(deviceSn: string) {
      const res = await activateRedeemCode({
        activationCode: this.redeemPackageInfo?.activationCode,
        sn: deviceSn,
        packageId: this.redeemPackageInfo?.packageId,
      });

      console.log('redeemCloudPackage: ', res);
    },

    async getDevicePackageStatus(redeemCode: string, sn: string) {
      if (this.packageServiceMap[sn]) {
        return;
      }
      try {
        const res = await checkRedeemCode({ activationCode: redeemCode, sn });
        this.packageServiceMap[sn] = res.packageInfo;
      } catch (error) {
        console.log('getDeviceCsStatus fail: ', sn, error);
      }
    },
    // 存储设备封面
    setDeviceCoverData(newValue: object) {
      this.deviceCoverMap = { ...newValue, ...this.deviceCoverMap };
    },

    // 重置兑换信息
    resetRedeemCodeInfo() {
      this.$patch({
        redeemPackageInfo: null,
        deviceList: [],
        redeemCode: undefined,
        deviceCloudStroageStatusList: [],
        packageServiceMap: {},
      });
    },
  },
});
