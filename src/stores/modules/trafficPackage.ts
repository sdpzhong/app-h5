/*
 * @Author: sdpzhong
 * @Date: 2024-08-27 17:58:44
 * @Last Modified by: sdpzhong
 * @Last Modified time: 2024-09-19 10:24:18
 */

import {
  getTrafficPackageList,
  getTrafficPackageServiceInfo,
  getUserDeviceList,
} from '@/api/modules/iot-device';
import useLoading from '@/hooks/loading';
import { NetTypeEnum } from '@/views/4g/types/4g-page';
import { defineStore } from 'pinia';
// import { showDialog } from 'vant';
import { computed, ref } from 'vue';
// import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';

export const useTrafficPackageStore = defineStore('app-traffic-package', () => {
  const route = useRoute();
  const router = useRouter();
  // const { t } = useI18n();

  const deviceList = ref<UserDeviceInfo[]>([]);
  const selectDeviceSN = ref<string>();
  const selectDevice = computed(() => deviceList.value.find((e) => e.sn === selectDeviceSN.value));
  const packageList = ref<TrafficPackageInfo[]>([]);
  const selectPackageId = ref<number>();
  const selectPackage = computed(() =>
    packageList.value.find((e) => e.packageId === selectPackageId.value),
  );
  const packageStatusInfoMap = ref<{ [x: string]: TrafficPackageServiceStatusInfo }>({});
  const packageStatusInfo = computed(() => packageStatusInfoMap.value[selectDeviceSN.value ?? '']);

  // 是否支持切换设备
  const isAllowChangeDevice = ref(false);

  // 请求获取流量套餐列表
  const { loading: requestPackageLoading, setLoading: setRequestPackageLoading } = useLoading();
  async function requestTrafficPackageList(sn: string) {
    setRequestPackageLoading(true);
    try {
      const res = await getTrafficPackageList({
        sn,
      });
      console.log('requestTrafficPackageList： ', res);

      packageList.value = res;
      if (packageList.value.length) {
        selectPackageId.value = packageList.value[0].packageId;
      }
    } catch (error) {
      console.log('requestTrafficPackageList error: ', error);
    } finally {
      setRequestPackageLoading(false);
    }
  }
  // requestTrafficPackageList();

  // 获取设备信息
  const { loading: requestDevcieLoading, setLoading: setaRequestDeviceLoading } = useLoading();
  async function requestUserDeviceList() {
    setaRequestDeviceLoading(true);
    try {
      const data = await getUserDeviceList();

      deviceList.value = data.filter((e) => e.netType === NetTypeEnum.cellular);
      // 过滤出4g设备

      console.log('requestUserDeviceList: ', deviceList.value);

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

        requestTrafficPackageList(selectDeviceSN.value);

        // 请求设备服务（状态）信息
        requestDeviceTrafficPackageServiceStatusInfo(selectDeviceSN.value);
      } else {
        // 强制跳转到4g服务介绍页面
        router.replace({
          path: '/gsmdata/introduce',
        });
        // showDialog({
        //   title: t('toast.tip'),
        //   message: t('traffic.no-4g-device'),
        // });
      }
    } catch (e) {
      console.log('e', e);
    } finally {
      setaRequestDeviceLoading(false);
    }
  }

  requestUserDeviceList();

  /**
   *
   * @param sn 设备SN
   * @param updateForce 是否强制更新（默认false）
   * @returns
   */
  async function requestDeviceTrafficPackageServiceStatusInfo(sn: string, updateForce = false) {
    if (!updateForce && packageStatusInfoMap.value[sn]) {
      return;
    }
    try {
      const res = await getTrafficPackageServiceInfo({
        sn,
      });
      console.log('requestDeviceTrafficPackageServiceStatusInfo: ', res);
      packageStatusInfoMap.value[sn] = res;
    } catch (error) {
      console.log('requestDeviceTrafficPackageServiceStatusInfo fail:', error);
    }
  }

  return {
    deviceList,
    packageList,
    requestPackageLoading,
    selectPackageId,
    selectPackage,
    selectDevice,
    selectDeviceSN,
    requestDevcieLoading,
    requestDeviceTrafficPackageServiceStatusInfo,
    packageStatusInfo,
    isAllowChangeDevice,
    requestTrafficPackageList,
  };
});
