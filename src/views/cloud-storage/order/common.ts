/*
 * @Author: sdpzhong
 * @Date: 2024-04-09 15:28:35
 * @Last Modified by: sdpzhong
 * @Last Modified time: 2024-08-31 10:46:07
 */

export class OrderStatusConstantClass {
  // 待支付
  static readonly NOTPAY = 'NOTPAY';
  // 交易完成
  static readonly FINISHED = 'FINISHED';
  // 已退款
  static readonly REFUND = 'REFUND';
  // 已支付(待充值)
  static readonly SUCCESS = 'SUCCESS';
  // 已支付(充值中)
  static readonly USERPAY = 'USERPAYING';
  // 已支付(充值失败)
  static readonly FAILEDP = 'FAILEDPAYING';
  // 已取消
  static readonly CANCEL = 'CANCEL';
}

export const orderStatusZhDisplayNameMap = {
  FINISHED: '交易成功',
  REFUND: '已退款',
  SUCCESS: '已支付(待充值)',
  USERPAY: '已支付(充值中)',
  FAILEDP: '已支付(充值失败)',
  CANCEL: '已取消',
};

export const orderStatusEnDisplayNameMap = {
  FINISHED: 'Succeeded',
  REFUND: 'Refunded',
  SUCCESS: 'Paid(Pending Recharge)',
  USERPAY: 'Paid(Recharging)',
  FAILEDP: 'Paid(Recharge Failed)',
  CANCEL: 'Cancelled',
};

export const orderDiscountTypeZhDisplayName = {
  FREE: '免费领取',
  CODE: '兑换码',
  PROMOTION: '优惠券',
};

export const orderDiscountTypeEnDisplayName = {
  FREE: 'Receive for free',
  CODE: 'Redeem code',
  PROMOTION: 'Coupon',
};

// 套餐类型
export enum skuType {
  // 云存套餐
  cs = 'CS',
  // 流量套餐
  data = 'DATA',
}

// 流量套餐类型
export enum TrafficType {
  // 无限
  unlimited = 0,
  // 有限
  limited = 1,
}
