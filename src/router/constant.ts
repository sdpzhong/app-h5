/*
 * @Author: zq
 * @Date: 2022-10-24 18:06:11
 * @Last Modified by: sdpzhong
 * @Last Modified time: 2024-12-26 19:54:54
 * @desc: 路由常量
 */

import { RouterView } from 'vue-router';

// 权限路由白名单
export const WHITE_LIST = ['/login', '/404', '/register'];

export const Layout = () => import('@/layout/index.vue');

export const NotFound = () => import('@/views/system/not-found/index.vue');

export const RootRouteComp = () => import('@/layout/page/index.vue');

export const ImRootRouterComp = () => import('@/layout/page/im/ImLayoutPage.vue');

export const IframeRoute = () => import('@/views/system/iframe/index.vue');

export const DefaultRouteComp = RouterView;

// 外部链接地址
export class OtherWebUrls {
  // 云服务协议（中文）
  static readonly argumentForCn = 'https://iot.yudosmart.com/about/cn/cloud-service-purchase.html';

  // 云服务协议（英文）
  static readonly argumentForEn = 'https://iot.yudosmart.com/about/en/cloud-service-purchase.html';

  // 隐私协议（中文）
  static readonly privacyPolicyArgumentForCn =
    'https://iot.yudosmart.com/about/cn/privacy-policy.html';

  // 隐私协议（英文）
  static readonly privacyPolicyArgumentForEn =
    'https://iot.yudosmart.com/about/en/privacy-policy.html';

  // 用户协议（中文）
  static readonly userServiceArgumentForCn = 'https://iot.yudosmart.com/about/cn/service.html';

  // 用户协议 （英文）
  static readonly userServiceArgumentForEn = 'https://iot.yudosmart.com/about/en/service.html';

  // 自动续费协议 （中文）
  static readonly autoRenewArgumentForCn = 'https://iot.yudosmart.com/about/cn/auto-renew.html';

  // 自动续费协议 （英文）
  static readonly autoRenewArgumentForEn = 'https://iot.jadosmart.com/about/en/auto-renew.html';

  // 物联网卡服务协议 (中文)
  static readonly eSimServiceArgumentForCn =
    'https://iot.yudosmart.com/about/cn/esim-argument.html';

  // 物联网卡服务协议 （英文）
  static readonly eSimServiceArgumentForEn =
    'https://iot.yudosmart.com/about/en/esim-argument.html';
}
