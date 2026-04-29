/*
 * @Author: sdpzhong
 * @Date: 2025-03-18 16:27:47
 * @Last Modified by: sdpzhong
 * @Last Modified time: 2025-03-26 16:03:27
 * @Desc: 增值服务购买模块
 */

import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { SkuType } from './types/purchase';
import {
  getComboPackageList,
  getCsPackageList,
  getGsmdataPackageList,
} from '@/api/modules/purchase';
import { useRoute } from 'vue-router';
import useLoading from '@/hooks/loading';
import {
  getDeviceCloudStroageStatusInfo,
  getTrafficPackageServiceInfo,
  getUserDeviceList,
} from '@/api/modules/iot-device';
import { PackageStatus } from './types/cloudStorage';
import { useI18n } from 'vue-i18n';

export type PurchasePkgType = 'group' | 'gsmdata' | 'cs';

export interface TabbarItem {
  label: string;
  key: SkuType;
  dot: boolean;
}

export const usePurchaseStore = defineStore('app-purchase', () => {
  const route = useRoute();
  // const router = useRouter();
  const { t } = useI18n();

  const currentPackageType = ref<SkuType>(SkuType.combo);
  const tabbarList = ref<TabbarItem[]>([
    {
      label: t('purchase.combo'),
      key: SkuType.combo,
      dot: false,
    },
  ]);

  // device list
  const deviceList = ref<UserDeviceInfo[]>([]);
  const selectDeviceSN = ref<string>();
  const selectDevice = computed(() => deviceList.value.find((e) => e.sn === selectDeviceSN.value));
  const isAllowChangeDevice = computed(() => deviceList.value.length > 1);

  // package list
  const comboPackageList = ref<PurchasePackage[]>([]);
  const gsmdataPackageList = ref<PurchasePackage[]>([]);
  const cloudStoragePackageList = ref<PurchasePackage[]>([]);
  const selectPackage = ref<PurchasePackage>();

  // 套餐服务信息
  const gsmdataPackageStatusInfoMap = ref<{ [x: string]: TrafficPackageServiceStatusInfo }>({});
  const gsmPackageStatusInfo = computed(
    () => gsmdataPackageStatusInfoMap.value[selectDeviceSN.value ?? ''],
  );
  const csPackageStatusInfoMap = ref<{ [x: string]: PackageStatusInfo }>({});
  const csPackageStatusInfo = computed(
    () => csPackageStatusInfoMap.value[selectDeviceSN.value ?? ''],
  );

  // 获取设备信息 (初始化调用！！)
  const { loading: requestDevcieLoading, setLoading: setaRequestDeviceLoading } = useLoading();
  async function requestUserDeviceList() {
    setaRequestDeviceLoading(true);
    try {
      deviceList.value = await getUserDeviceList();
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
        }
        // 设置允许展示的tab
        setTabbarList((route.query['skuType'] ?? '').toString().toUpperCase());

        // 初期请求当前tab页面对应套餐列表
        requestPacakgeList(currentPackageType.value);

        // 请求设备服务（状态）信息
        requestCsPackageServiceStatusInfo(selectDeviceSN.value);
        requestGsmdataPackageServiceStatusInfo(selectDeviceSN.value);
      } else {
        console.log(t('purchase.no-device'));
      }
    } catch (e) {
      console.log('e', e);
    } finally {
      setaRequestDeviceLoading(false);
    }
  }
  requestUserDeviceList();

  function setTabbarList(targetTab?: string) {
    tabbarList.value = [
      {
        label: t('purchase.combo'),
        key: SkuType.combo,
        dot: false,
      },
    ];
    if (selectDevice.value && selectDevice.value?.skuTypes?.length) {
      if (selectDevice.value?.skuTypes.includes(SkuType.gsmdata)) {
        tabbarList.value.push({
          label: t('purchase.gsmdata'),
          key: SkuType.gsmdata,
          dot: false,
        });
      }
      if (selectDevice.value?.skuTypes.includes(SkuType.cs)) {
        tabbarList.value.push({
          label: t('purchase.cs'),
          key: SkuType.cs,
          dot: false,
        });
      }
    }

    if (targetTab && tabbarList.value.find((e) => e.key === targetTab)) {
      handleSelectPackageType(targetTab as SkuType);
    }

    if (!tabbarList.value.find((e) => e.key === currentPackageType.value)) {
      currentPackageType.value = SkuType.combo;
    }
  }

  // 切换套餐类型
  function handleSelectPackageType(type: SkuType) {
    if (type === currentPackageType.value) {
      return;
    }
    currentPackageType.value = type;
    selectPackage.value = void 0;
    requestPacakgeList(currentPackageType.value);
  }

  // 请求获取套餐列表 ========================
  function requestPacakgeList(type: SkuType, isForceUpdate = false) {
    switch (type) {
      case SkuType.combo:
        requestComboListData(isForceUpdate);
        break;

      case SkuType.cs:
        requestCsListData(isForceUpdate);
        break;

      case SkuType.gsmdata:
        requestGsmDataListData(isForceUpdate);
        break;

      default:
        break;
    }
  }

  const { loading: comboPkgLoading, setLoading: setComboPkgLoading } = useLoading();
  async function requestComboListData(isForceUpdate = false) {
    if (!isForceUpdate && comboPackageList.value.length) {
      return;
    }
    setComboPkgLoading(true);
    try {
      comboPackageList.value = await getComboPackageList({ sn: selectDeviceSN.value! });
      console.log('requestComboListData: ', comboPackageList.value);
    } catch (error) {
      console.log('requestComboListData fail: ', error);
    } finally {
      setComboPkgLoading(false);
    }
  }

  const { loading: gsmDataPkgLoading, setLoading: setGsmDataPkgLoading } = useLoading();
  async function requestGsmDataListData(isForceUpdate = false) {
    if (!isForceUpdate && gsmdataPackageList.value.length) {
      return;
    }

    setGsmDataPkgLoading(true);
    try {
      gsmdataPackageList.value = await getGsmdataPackageList({ sn: selectDeviceSN.value! });
      console.log('requestGsmDataListData: ', gsmdataPackageList.value);
    } catch (error) {
      console.log('requestGsmDataListData fail: ', error);
    } finally {
      setGsmDataPkgLoading(false);
    }
  }

  const { loading: csPkgLoading, setLoading: setCsPkgLoading } = useLoading();
  async function requestCsListData(isForceUpdate = false) {
    if (!isForceUpdate && cloudStoragePackageList.value.length) {
      return;
    }

    setCsPkgLoading(true);
    try {
      cloudStoragePackageList.value = await getCsPackageList({ sn: selectDeviceSN.value! });
      console.log('requestCsListData: ', cloudStoragePackageList.value);
    } catch (error) {
      console.log('requestCsListData fail: ', error);
    } finally {
      setCsPkgLoading(false);
    }
  }

  // ================== 请求套餐服务状态信息
  /**
   *
   * @param sn 设备SN
   * @param updateForce 是否强制更新（默认false）
   * @returns
   */
  async function requestGsmdataPackageServiceStatusInfo(sn: string, forceUpdate = false) {
    if (!forceUpdate && gsmdataPackageStatusInfoMap.value[sn]) {
      return;
    }
    try {
      const res = await getTrafficPackageServiceInfo({
        sn,
      });
      console.log('requestGsmdataPackageServiceStatusInfo: ', res);
      gsmdataPackageStatusInfoMap.value[sn] = res;
    } catch (error) {
      console.log('requestGsmdataPackageServiceStatusInfo fail:', error);
    } finally {
      updateTabbarTagStatus();
    }
  }

  async function requestCsPackageServiceStatusInfo(sn: string, forceUpdate = false) {
    if (!forceUpdate && csPackageStatusInfoMap.value[sn]) {
      return;
    }
    try {
      const res = await getDeviceCloudStroageStatusInfo({
        sn,
      });
      console.log('requestCsPackageServiceStatusInfo: ', res);
      csPackageStatusInfoMap.value[sn] = res;
    } catch (error) {
      console.log('requestCsPackageServiceStatusInfo fail:', error);
    } finally {
      updateTabbarTagStatus();
    }
  }

  // 更新tab tag
  async function updateTabbarTagStatus() {
    const csTab = tabbarList.value.find((e) => e.key === SkuType.cs);
    const gsmdataTab = tabbarList.value.find((e) => e.key === SkuType.gsmdata);
    if (csTab) {
      csTab.dot =
        csPackageStatusInfo.value?.state !== PackageStatus.ACTIVATED ||
        (csPackageStatusInfo.value?.expireTime ?? 0) - +new Date() <= 7 * 24 * 3600 * 1000;
    }
    if (gsmdataTab) {
      gsmdataTab.dot =
        gsmPackageStatusInfo.value?.state !== PackageStatus.ACTIVATED ||
        (gsmPackageStatusInfo.value?.expireTime ?? 0) - +new Date() <= 7 * 24 * 3600 * 1000;
    }
  }

  return {
    tabbarList,
    currentPackageType,
    handleSelectPackageType,
    comboPackageList,
    gsmdataPackageList,
    cloudStoragePackageList,
    requestPacakgeList,
    requestDevcieLoading,
    selectDevice,
    selectDeviceSN,
    comboPkgLoading,
    csPkgLoading,
    gsmDataPkgLoading,
    selectPackage,
    gsmPackageStatusInfo,
    csPackageStatusInfo,
    requestCsPackageServiceStatusInfo,
    requestGsmdataPackageServiceStatusInfo,
    deviceList,
    isAllowChangeDevice,
    setTabbarList,
    updateTabbarTagStatus,
  };
});
