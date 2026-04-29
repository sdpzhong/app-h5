/*
 * @Author: sdpzhong
 * @Date: 2024-04-02 15:37:41
 * @Last Modified by: sdpzhong
 * @Last Modified time: 2024-11-19 11:06:56
 */

import {
  getCloudStroagePackageList,
  getDeviceCloudStroageStatusInfo,
  getUserDeviceList,
} from '@/api/modules/iot-device';
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';
import { PackageRecordType } from './types/cloudStorage';

export const useCloudStorageStore = defineStore('app-cloud-storage', () => {
  const route = useRoute();

  const deviceList = ref<UserDeviceInfo[]>([]);
  const packageList = ref<CloudStoragePackageItem[]>([]);
  const recommendList = ref<CloudStoragePackageInfo[]>([]);
  const serviceTimeList = ref<ServiceTimeItem[]>([]);
  const lifecycleList = ref<CloudStorageLifecycleItem[]>([]);
  const recordTypeList = ref<RecordTypeItem[]>([]);
  const isPlacing = ref<boolean>(false);

  const packageListLoading = ref(true);
  const deviceListLoading = ref(true);
  const selectDeviceSN = ref<string>();
  const selectPackageId = ref<number>();

  const packageStatusInfo = computed(() => packageStatusInfoMap.value[selectDeviceSN.value ?? '']);
  const packageStatusInfoMap = ref<{ [x: string]: PackageStatusInfo }>({});

  // 是否支持切换设备
  const isAllowChangeDevice = ref(false);

  const selectDevice = computed(() => deviceList.value.find((e) => e.sn === selectDeviceSN.value));

  // 事件录制套餐列表
  const eventRecordPackageList = computed(() =>
    recommendList.value.filter((e) => e.recordType === PackageRecordType.EVENT),
  );

  // 全天录制套餐列表
  const allTimeRecordPackageList = computed(() =>
    recommendList.value.filter((e) => e.recordType === PackageRecordType.ALL_DAY),
  );

  // 低功耗云存套餐
  const lowPowerPackageList = computed(() =>
    recommendList.value.filter((e) => e.recordType == PackageRecordType.LOW_POWER),
  );

  async function requestUserDeviceList() {
    deviceListLoading.value = true;

    try {
      const data = await getUserDeviceList();

      deviceList.value = data;

      console.log('requestUserDeviceList: ', data);

      if (deviceList.value.length) {
        const eleIndex = deviceList.value.findIndex((e) => route.query['sn'] === e.sn);
        if (eleIndex != -1) {
          selectDeviceSN.value = route.query['sn'] as string;

          // 将当前元素设置为第一位
          if (deviceList.value.length > 1) {
            const temp = deviceList.value[0];
            deviceList.value[0] = deviceList.value[eleIndex];
            deviceList.value[eleIndex] = temp;
          }
        } else {
          selectDeviceSN.value = deviceList.value[0].sn;
          isAllowChangeDevice.value = true;
        }
        requestPackageInfo(selectDeviceSN.value);

        // 请求设备云存服务（状态）信息
        requestDeviceCloudStorageStatusInfo(selectDeviceSN.value);
      }
    } catch (e) {
      console.log('e', e);
    } finally {
      deviceListLoading.value = false;
    }
  }

  requestUserDeviceList();

  async function requestPackageInfo(sn: string) {
    try {
      packageListLoading.value = true;

      recommendList.value = [];

      // const data = await getAllCloudStoragePackageInfo({ sn });
      // const { packages, serviceTimes, lifecycles, recommends, recordTypes } = data;
      // packageList.value = packages;
      // recommendList.value = recommends;
      // serviceTimeList.value = serviceTimes;
      // lifecycleList.value = lifecycles;
      // recordTypeList.value = recordTypes;

      const data = await getCloudStroagePackageList({ sn });

      recommendList.value = data;

      recommendList.value.sort((a, b) => b.sortIndex - a.sortIndex);

      console.log('requestPackageInfo:', data);
      if (recommendList.value.length) {
        // 判断设备网络类型（一般设备展示事件和全天、低功耗4g设备展示4g云存套餐）
        // if (selectDevice.value?.powerManageFeature === PowerManageFeature.LPC) {
        //   selectPackageId.value = lowPowerPackageList.value[0]?.packageId;
        // } else {
        //   selectPackageId.value =
        //     eventRecordPackageList.value[0]?.packageId ??
        //     allTimeRecordPackageList.value[0]?.packageId;
        // }
        selectPackageId.value = recommendList.value[0].packageId;
      } else {
        selectPackageId.value = undefined;
      }
    } catch (error) {
      console.log('requestPackageInfo fail: ', error);
    } finally {
      packageListLoading.value = false;
    }
  }

  async function placeOrder() {}

  /**
   *
   * @param sn 设备SN
   * @param updateForce 是否强制更新（默认false）
   * @returns
   */
  async function requestDeviceCloudStorageStatusInfo(sn: string, updateForce = false) {
    if (!updateForce && packageStatusInfoMap.value[sn]) {
      return;
    }
    try {
      const res = await getDeviceCloudStroageStatusInfo({
        sn,
      });
      console.log('requestDeviceCloudStorageStatusInfo: ', res);
      packageStatusInfoMap.value[sn] = res;
    } catch (error) {
      console.log('requestDeviceCloudStorageStatusInfo fail:', error);
    }
  }

  return {
    deviceList,
    packageList,
    requestUserDeviceList,
    deviceListLoading,
    packageListLoading,
    selectDevice,
    selectDeviceSN,
    selectPackageId,
    eventRecordPackageList,
    allTimeRecordPackageList,
    recommendList,
    lifecycleList,
    recordTypeList,
    serviceTimeList,
    placeOrder,
    isPlacing,
    packageStatusInfo,
    isAllowChangeDevice,
    requestDeviceCloudStorageStatusInfo,
    lowPowerPackageList,
    requestPackageInfo,
  };
});
