import type { PayChannel } from '@/stores/modules/types/cloudStorage';

export interface PaymentMethodItem {
  name: string;
  channel: PayChannel;
  icon: string;
}

export enum PaymentActionStatus {
  // 未知状态
  unknown = -1,
  // 支付成功
  success = 0,
  // 支付失败
  fail = 1,
  // 支付取消
  cancel = 2,
  // 处理中
  processing = 3,
}

export enum CombinedType {
  //  默认
  default = 0,
  // 组合
  combined = 1,
}
