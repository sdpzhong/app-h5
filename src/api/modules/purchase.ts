import type { ErrorMessageMode } from '#/axios';
import { http } from '../config';

enum Api {
  COMBO_PACKAGE_LIST = '/dispatch/app/web/v1.2/combo/package/list',
  CLOUD_STORAGE_PACKAGE_LIST = '/dispatch/app/web/v1.2/cs/package/list',
  GSMDATA_PACKAGE_LIST = '/dispatch/app/web/v1.2/data/package/list',
}

/**
 * @description: 获取组合套餐列表
 */
export function getComboPackageList(
  params: {
    sn: string;
  },
  mode: ErrorMessageMode = 'notify',
) {
  return http.get<Array<PurchasePackage>>(
    {
      url: Api.COMBO_PACKAGE_LIST,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
}

/**
 * @description: 获取云存套餐列表
 */
export function getCsPackageList(
  params: {
    sn: string;
  },
  mode: ErrorMessageMode = 'notify',
) {
  return http.get<Array<PurchasePackage>>(
    {
      url: Api.CLOUD_STORAGE_PACKAGE_LIST,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
}

/**
 * @description: 获取流量套餐列表
 */
export function getGsmdataPackageList(
  params: {
    sn: string;
  },
  mode: ErrorMessageMode = 'notify',
) {
  return http.get<Array<PurchasePackage>>(
    {
      url: Api.GSMDATA_PACKAGE_LIST,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
}
