/*
 * @Author: sdpzhong
 * @Date: 2025-03-20 11:24:59
 * @Last Modified by: sdpzhong
 * @Last Modified time: 2025-03-25 10:24:42
 */

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
