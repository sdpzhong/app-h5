/*
 * @Author: sdpzhong
 * @Date: 2024-02-26 17:14:15
 * @Last Modified by: sdpzhong
 * @Last Modified time: 2025-02-27 15:00:03
 */

import type { ErrorMessageMode } from '#/axios';
import { http } from '../config';

enum Api {
  // CHECK_REDEEM_CODE = '/dispatch/app/web/v1/cs/code/check',
  CHECK_REDEEM_CODE = '/dispatch/app/web/v1/device/cs/code',
  ACTIVATE_REDEEM_CODE = '/dispatch/app/web/v1/device/code/activate',
  GET_USER_DEVICE_LIST = '/dispatch/app/web/v1/device/list',
  GET_ALL_DEVICE_CLOUD_STORAGE_STATUS = '/dispatch/app/web/v1/cs/code/devices',
  GET_ONE_DEVIEC_CLOUD_STORAGE_STATUS = '/dispatch/app/web/v1/service/status',
  GET_ALL_CLOUD_STORAGE_PACKAGE_LIST = '/dispatch/app/web/v1/cs/package/list',
  PlACE_CLOUD_STORAGE_PACKAGE_ORDER = '/dispatch/app/web/v1/order/prepay',
  GET_USER_ALL_ORDERS = '/dispatch/app/web/v1/device/order/page',
  GET_SIMPLE_DEVICE_INFO = '/dispatch/app/web/v1/device/query',
  GET_DEVICE_CLOUD_STORAGE_STATUS = '/dispatch/app/web/v1/device/cs/status',
  // CREATE_ORDER = '/dispatch/app/v1/device/cs/order',
  CAPTRE_ORDER = '/dispatch/app/web/v1/pay/notification',
  GET_TRAFFIC_PACKAGES = '/dispatch/app/web/v1/gsm/package/list',
  GET_TRAFFIC_PACKAGES_SERVICE_STATUS = '/dispatch/app/web/v1/device/gsm/status',
  GET_DEVICE_TRAFFIC_RECORD_PAGE = '/dispatch/app/web/v1/device/gsm/record',
  GET_ALL_DEVICE_TRAFFIC_SERVICE_STATUS = '/dispatch/app/web/v1/device/all/gsm/status',
  GET_ALL_CLOUD_STORAGE_PACKAGE_LIST_NEW = '/dispatch/app/web/v1.1/cs/package/list',
  GET_DEVICE_ALL_CS_RECORD = '/dispatch/app/web/v1/device/cs/record',
  GET_ALL_DEVICE_CS_SERVICE_INFO_LIST = '/dispatch/app/web/v1/device/all/cs/status',
  ESIM_ACTIVE = '/dispatch/app/web/v1.1/esim/activate',
  GET_ESIM_SETTING_STATUS = '/dispatch/app/v1/esim/status',
  GET_DEVICE_BASE_STATUS = '/dispatch/app/v1/device/status',
  GET_DEVICE_NET_WORK_STATUS = '/dispatch/app/web/v1.1/device/checkNetworkStatus',
  RESET_ESIM_NEATWORK = '/dispatch/app/web/v1/esim/reset',
  GET_ESIM_OPT_LIST = '/dispatch/app/web/v1/esim/operators',
}

/**
 * @description: 校验&获取兑换码信息
 */
export function checkRedeemCode(
  params: {
    activationCode: string;
    sn?: string;
  },
  mode: ErrorMessageMode = 'notify',
) {
  return http.get<RedeemCodeInfo>(
    {
      url: Api.CHECK_REDEEM_CODE,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
}

/**
 * @description: 激活兑换码
 */
export function activateRedeemCode(
  data: {
    activationCode?: string;
    sn: string;
    packageId?: number;
  },
  mode: ErrorMessageMode = 'notify',
) {
  return http.post<RedeemCodeInfo>(
    {
      url: Api.ACTIVATE_REDEEM_CODE,
      data,
    },
    {
      errorMessageMode: mode,
    },
  );
}

/**
 * @description: 获取用户设备列表
 */
export function getUserDeviceList(params = {}, mode: ErrorMessageMode = 'notify') {
  return http.get<UserDeviceInfo[]>(
    {
      url: Api.GET_USER_DEVICE_LIST,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
}

/**
 * @description: 获取用户全部设备的云存储状态
 */
export function getUserAllDeviceCloudStorageStatusList(
  params: {
    activationCode: string;
  },
  mode: ErrorMessageMode = 'notify',
) {
  return http.get<DeviceClouStorageStatusInfo[]>(
    {
      url: Api.GET_ALL_DEVICE_CLOUD_STORAGE_STATUS,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
}

/**
 * @description: 获取单台设备的全部云存储状态列表
 */
export function getDeviceCloudStorageInfoBySn(
  params: {
    sn: string;
  },
  mode: ErrorMessageMode = 'notify',
) {
  return http.get<DeviceCloudStorageInfo[]>(
    {
      url: Api.GET_ONE_DEVIEC_CLOUD_STORAGE_STATUS,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
}

/**
 * @description: 获取全部的套餐信息
 */
export function getAllCloudStoragePackageInfo(
  params: {
    sn: string;
  },
  mode: ErrorMessageMode = 'notify',
) {
  return http.get<CloudStorageResponse>(
    {
      url: Api.GET_ALL_CLOUD_STORAGE_PACKAGE_LIST,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
}

/**
 * @description: 套餐下单接口
 */
export function placeCloudStorageOrder(data: PlaceOrderRequest, mode: ErrorMessageMode = 'notify') {
  return http.post<PlaceOrderResponse>(
    {
      url: Api.PlACE_CLOUD_STORAGE_PACKAGE_ORDER,
      data,
    },
    {
      errorMessageMode: mode,
    },
  );
}

/**
 * @description:获取订单列表
 */
export function getUserAllOrders(params: IGetOrderListRequest, mode: ErrorMessageMode = 'notify') {
  return http.get<IGetOrderListReponse>(
    {
      url: Api.GET_USER_ALL_ORDERS,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
}

/**
 * @description:获取设备简略信息（配网）
 */
export function getSimpleDeviceInfo(
  params: {
    sn: string;
  },
  mode: ErrorMessageMode = 'notify',
) {
  return http.get<SimpleDeviceInfo>(
    {
      url: Api.GET_SIMPLE_DEVICE_INFO,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
}

/**
 * @description: 获取设备云存状态信息
 */
export function getDeviceCloudStroageStatusInfo(
  params: {
    sn: string;
  },
  mode: ErrorMessageMode = 'notify',
) {
  return http.get<PackageStatusInfo>(
    {
      url: Api.GET_DEVICE_CLOUD_STORAGE_STATUS,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
}

/**
 * @description: 云存下单
 */
// export function createCloudStorageOrder(
//   data: CreateOrderInfoForm,
//   mode: ErrorMessageMode = 'notify',
// ) {
//   return http.post<CreateOrderResponse>(
//     {
//       url: Api.CREATE_ORDER,
//       data,
//     },
//     {
//       errorMessageMode: mode,
//     },
//   );
// }

/**
 * @description: 捕获订单。确认订单状态
 */
export function captureOrder(data: CaptureOrderRequest, mode: ErrorMessageMode = 'none') {
  return http.post<CaptureOrderResponse>(
    {
      url: Api.CAPTRE_ORDER,
      data,
    },
    {
      errorMessageMode: mode,
    },
  );
}

/**
 * @description: 获取流量套餐列表
 */
export function getTrafficPackageList(
  params: {
    sn: string;
  },
  mode: ErrorMessageMode = 'notify',
) {
  return http.get<TrafficPackageInfo[]>(
    {
      url: Api.GET_TRAFFIC_PACKAGES,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
}

/**
 * @description: 获取流量套餐服务信息
 */
export function getTrafficPackageServiceInfo(
  params: {
    sn: string;
  },
  mode: ErrorMessageMode = 'notify',
) {
  return http.get<TrafficPackageServiceStatusInfo>(
    {
      url: Api.GET_TRAFFIC_PACKAGES_SERVICE_STATUS,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
}

/**
 * @description: 获取单个4G设备全部流量套餐服务记录分页数据
 */
export function getDeviceAllTrafficServiceRecordPage(
  params: IGetDeviceTrafficServiceRecordRequest,
  mode: ErrorMessageMode = 'notify',
) {
  return http.get<IGetDeviceTrafficServiceRecordResponse>(
    {
      url: Api.GET_DEVICE_TRAFFIC_RECORD_PAGE,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
}

/**
 * @description: 获取全部4g设备的流量服务状态列表
 */
export function getAllGsmDeviceTrafficServiceStatus(
  params = {},
  mode: ErrorMessageMode = 'notify',
) {
  return http.get<TrafficPackageServiceStatusInfo[]>(
    {
      url: Api.GET_ALL_DEVICE_TRAFFIC_SERVICE_STATUS,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
}

/**
 * 新的获取云存储套餐列表接口
 */

export function getCloudStroagePackageList(
  params: {
    sn: string;
  },
  mode: ErrorMessageMode = 'notify',
) {
  return http.get<CloudStoragePackageInfo[]>(
    {
      url: Api.GET_ALL_CLOUD_STORAGE_PACKAGE_LIST_NEW,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
}

/**
 * 获取单个设备全部云存套餐服务记录
 */
export function getDeviceAllCloudStroageRecord(
  params: IGetDeviceCloudStorageServiceRecordRequest,
  mode: ErrorMessageMode = 'notify',
) {
  return http.get<IGetDeviceCloudStorageServiceRecordResponse>(
    {
      url: Api.GET_DEVICE_ALL_CS_RECORD,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
}

/**
 * 获取全部设备的云存状态服务信息（包含设备信息）列表
 * @param params
 * @param mode
 * @returns
 */
export function getAllDeviceCloudStorageServiceWithDeviceInfo(
  params = {},
  mode: ErrorMessageMode = 'notify',
) {
  return http.get<CloudStorageServiceStrongInfo[]>(
    {
      url: Api.GET_ALL_DEVICE_CS_SERVICE_INFO_LIST,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
}

/**
 * 获取网络运营商列表
 * @param params
 * @param mode
 * @returns
 */
export function getEsimGroups(
  params: {
    sn: string;
  },
  mode: ErrorMessageMode = 'notify',
) {
  return http.get<EsimGroup[]>(
    {
      url: Api.GET_ESIM_OPT_LIST,
      params,
    },
    { errorMessageMode: mode },
  );
}

/**
 * 激活Esim（切换完网络运营商）
 * @param data
 * @param mode
 * @returns
 */
export default function activeEsim(data: ActiveEsimRequest, mode: ErrorMessageMode = 'notify') {
  return http.post<boolean>(
    {
      url: Api.ESIM_ACTIVE,
      data,
    },
    { errorMessageMode: mode },
  );
}

/**
 * 获取Esim配置状态
 * @param params
 * @param mode
 * @returns
 */
export function getEsimSettingStatus(
  params: {
    sn: string;
  },
  mode: ErrorMessageMode = 'notify',
) {
  return http.get<boolean>(
    {
      url: Api.GET_ESIM_SETTING_STATUS,
      params: params,
    },
    { errorMessageMode: mode },
  );
}

/**
 * 获取设备基本状态 (已废弃)
 *
 * @param params
 * @param mode
 * @returns
 */
export function getDeviceBaseStatus(
  params: {
    sn: string;
  },
  mode: ErrorMessageMode = 'none',
) {
  return http.get<{
    state: number;
  }>(
    {
      url: Api.GET_DEVICE_BASE_STATUS,
      params: params,
      timeout: 1000 * 10,
    },
    { errorMessageMode: mode },
  );
}

/**
 * 获取设备网络状态
 * @param params
 * @param mode
 * @returns
 */
export function getDeviceNetworkStatus(
  params: {
    sn: string;
  },
  mode: ErrorMessageMode = 'none',
) {
  return http.get<DeviceNetworkStatusResponse>(
    {
      url: Api.GET_DEVICE_NET_WORK_STATUS,
      params: params,
      timeout: 1000 * 10,
    },
    { errorMessageMode: mode, ignoreCancelToken: false },
  );
}

/**
 * 重置esim网络
 * @param data
 * @param mode
 * @returns
 */
export function resetEsimNetwork(data: { sn: string }, mode: ErrorMessageMode = 'notify') {
  return http.post<boolean>(
    {
      url: Api.RESET_ESIM_NEATWORK,
      data,
    },
    { errorMessageMode: mode },
  );
}
