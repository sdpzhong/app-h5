/*
 * @Author: sdpzhong
 * @Date: 2024-09-18 14:03:47
 * @Last Modified by: sdpzhong
 * @Last Modified time: 2025-02-21 10:20:19
 */

import {
  getEsimGroups,
  getSimpleDeviceInfo,
  getTrafficPackageServiceInfo,
} from '@/api/modules/iot-device';
import { defineStore } from 'pinia';
import { computed, ref, watchEffect, type Ref } from 'vue';
import { useRoute } from 'vue-router';
import { NetTypeEnum } from './types/cloudStorage';
import useLoading from '@/hooks/loading';
import { useEventListener } from '@vant/use';

export const useTrafficSetting = defineStore('app-traffic-setting', () => {
  const route = useRoute();
  const sn = ref(route.query['sn'] ?? '') as unknown as Ref<string>;
  const simpleDeviceInfo = ref<SimpleDeviceInfo>();
  const { loading: requestDeviceInfoLoading, setLoading: setRequestDeviceInfoLoading } =
    useLoading();

  const isCellularDevice = computed(() => simpleDeviceInfo.value?.netType === NetTypeEnum.cellular);

  async function requestDeviceInfo() {
    try {
      setRequestDeviceInfoLoading(true);
      simpleDeviceInfo.value = await getSimpleDeviceInfo({
        sn: sn.value,
      });
      console.log('requestDeviceInfo: ', simpleDeviceInfo.value);
    } catch (error) {
      console.log('requestDeviceInfo fail:', error);
    } finally {
      setRequestDeviceInfoLoading(false);
    }
  }

  requestDeviceInfo();

  const serviceInfo = ref<TrafficPackageServiceStatusInfo>();

  // 获取流量服务状态信息
  async function requestDeviceTrafficServiceInfo() {
    try {
      const res = await getTrafficPackageServiceInfo({
        sn: sn.value,
      });
      serviceInfo.value = res;
      console.log('requestDeviceTrafficServiceInfo: ', res);
    } catch (error) {
      console.log('requestDeviceTrafficServiceInfo fail: ', error);
    }
  }

  requestDeviceTrafficServiceInfo();

  const operatorList = ref<EsimGroup[]>([]);
  const currentOperator = computed(() =>
    operatorList.value.find((e) => e.operatorId === simpleDeviceInfo.value?.esimGroupId),
  );
  async function requestEsimGroups() {
    try {
      const res = await getEsimGroups({
        sn: sn.value,
      });
      console.log('requestEsimGroups: ', res);
      operatorList.value = res;
    } catch (error) {
      console.log('request esim group fail: ', error);
    }
  }
  requestEsimGroups();

  watchEffect(() => {
    // 当前元素置顶
    const targetIndex = operatorList.value.findIndex(
      (e) => e.operatorId === simpleDeviceInfo.value?.esimGroupId,
    );
    if (targetIndex !== -1) {
      operatorList.value.unshift(operatorList.value.splice(targetIndex, 1)[0]);
    }
  });

  // 页面切换到前台时重新请求设备流量服务信息(返回服务设置页面后更新)
  useEventListener('visibilitychange', (_e) => {
    if (document.visibilityState === 'visible') {
      requestDeviceTrafficServiceInfo();
    }
  });

  return {
    isCellularDevice,
    simpleDeviceInfo,
    sn,
    serviceInfo,
    requestDeviceInfoLoading,
    setRequestDeviceInfoLoading,
    requestDeviceInfo,
    currentOperator,
    operatorList,
  };
});
