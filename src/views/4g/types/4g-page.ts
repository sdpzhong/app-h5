import type { PayChannel } from '@/stores/modules/types/cloudStorage';

export interface FourGPackageInfo {
  id: number;
  title: string;
  duration: number;
  price: number;
}

export interface PaymentMethodItem {
  name: string;
  channel: PayChannel;
  icon: string;
}

export enum NetTypeEnum {
  wifi = 'wifi',
  cellular = 'cellular',
}

export enum SimStatusEnum {
  // 未激活
  unactived = 0,
  // 已激活
  actived = 1,
  // 在用，命名待修正
  inuse = 2,
  // 已回收
  recycled = 3,
}

// sim卡插入类型 0.不支持 1.贴片 2.卡槽
// export enum SimSlotTypeEnum {
//   notSupoorted = 0,
//   patches = 1,
//   slot = 2,
// }

// sim 卡类型；0.不支持 1.eSIM 2.传统SIM卡
export enum SimType {
  notSuppsorted = 0,
  esim = 1,
  sim = 2,
}

// 设备在线状态(暂时废弃，不用了哈)
export enum DeviceBaseStatus {
  unknown = -1,
  unactived = 0,
  online = 1,
  offine = 3,
  disable = 8,
}

export enum DeviceNetworkStatus {
  ESIM_RESET_WAITING = 'ESIM_RESET_WAITING',
  ESIM_RESET_SUCCESS = 'ESIM_RESET_SUCCESS',
  DEVICE_ONLINE_WAITING = 'DEVICE_ONLINE_WAITING',
  DEVICE_ONLINE = 'DEVICE_ONLINE',
  DEVICE_ONLINE_EXTERNAL = 'DEVICE_ONLINE_EXTERNAL',
  DEVICE_RESET_WAITING = 'DEVICE_RESET_WAITING',
  DEVICE_RESET_SUCCESS = 'DEVICE_RESET_SUCCESS',
  DEVICE_RESET_FAILED = 'DEVICE_RESET_FAILED',
  DEVICE_SUCCESS_FOR_BIND = 'DEVICE_SUCCESS_FOR_BIND',
}
