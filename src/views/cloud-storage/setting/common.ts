export const CloudStorageStateTextMap = {
  0: '待生效',
  1: '待生效',
  2: '生效中',
  3: '已过期',
};

export const CloudStorageStateEnMap = {
  0: 'Pending',
  1: 'Pending',
  2: 'In effect',
  3: 'Expired',
};

// 套餐服务队列状态
export enum PackageServiceState {
  pending = 0,
  wating = 1,
  effected = 2,
  expired = 3,
}

// 套餐服务状态 0-未开通，1-已开通，2-已过期
export const CsServiceStateTexpMap = {
  0: '未开通',
  1: '已开通',
  2: '已过期',
};

export const CsServiceStateEnTexpMap = {
  0: 'Not activated',
  1: 'Activated',
  2: 'Expired',
};
