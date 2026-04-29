/*
 * @Author: sdpzhong
 * @Date: 2024-04-03 15:21:07
 * @Last Modified by: sdpzhong
 * @Last Modified time: 2025-03-24 17:49:38
 */

export enum PayChannel {
  FREE = 'FREE',
  CODE = 'CODE',
  WECHAT = 'WECHAT',
  ALIPAY = 'ALIPAY',
  APPLE = 'APPLE',
  PAYPAL = 'PAYPAL',
  GOOGLE = 'GOOGLE',
}

export enum PackageRecordType {
  // 全时
  ALL_DAY = 1,
  // 事件
  EVENT = 2,
  // 低功耗
  LOW_POWER = 3,
}

export enum PackageStatus {
  // 未开通
  NONACTIVATED = 0,
  // 已开通
  ACTIVATED = 1,
  // 已过期
  EXPIRED = 2,
}

export enum PowerManageFeature {
  // 常电
  NORMAL = 'normal',
  // 低功耗
  LPC = 'lpc',
}

export enum NetTypeEnum {
  wifi = 'wifi',
  cellular = 'cellular',
}

// 套餐类型(0：常规，1：自动续费，2: 活动，3：赠送)
export enum PackageType {
  regular = 0,
  autoRenew = 1,
  activity = 2,
  giveAway = 3,
}
