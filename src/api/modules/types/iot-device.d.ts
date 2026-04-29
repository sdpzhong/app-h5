declare interface UserDeviceInfo {
  sn: string;
  deviceId: string;
  iotId: string;
  state: number;
  productKey: string;
  deviceName: string;
  name: string;
  productType: string;
  serviceStatus: number;
  serviceState: number;
  infos: string;
  settings: object;
  shareId?: string;
  permits: any[];
  netType: string;
  powerManageFeature: string;
  skuTypes: string[];
}

declare interface RedeemCodeInfo {
  skuType: string;
  packageId: number;
  activationCode: string;
  effectiveTime: string;
  expireTime: string;
  issuer: string;
  packageInfo: RedeemCodePackageInfo;
  hasNotSupport: boolean;
  notSupportMessage: string;
}

declare interface RedeemCodePackageInfo {
  id: number;
  packageName: string;
  packageNameDisplay: string;
  recordType: number;
  lifecycle: number;
  free: boolean;
  renewal: boolean;
  type: number;
  serviceDays: number;
  serviceDaysDisplay: string;
  startTime: number;
  endTime: number;
  orderId?: string;
}

declare interface DeviceClouStorageStatusInfo {
  sn: string;
  name: string;
  packageName: string;
  startTime: number;
  endTime: number;
  recordType: number;
  lifecycle: number;
}

declare interface DeviceClouStorageStatusvBaseInfo {
  packageName: string;
  startTime: number;
  endTime: number;
  recordType: number;
  lifecycle: number;
  free: boolean;
  renewal: boolean;
  orderId: string;
  queueState: number;
}

declare interface DeviceCloudStorageInfo {
  packageName: string;
  startTime: number;
  endTime: number;
  serviceState: number;
  skuType: string;
  recordType: number;
  lifecycle: number;
}

// cloud storage ...
declare interface CloudStorageResponse {
  packages: CloudStoragePackageItem[];
  lifecycles: CloudStorageLifecycleItem[];
  serviceTimes: ServiceTimeItem[];
  recordTypes: RecordTypeItem[];
  recommends: CloudStoragePackageItem[];
}

declare interface CloudStoragePackageItem {
  id: number;
  name: string;
  displayName: string;
  lifecycle: number;
  days: number;
  months: number;
  price: number;
  originalPrice: number;
  recordType: number;
  type: number;
  recommend: number;
  renewal: number;
  badge?: string;
  sortIndex: number;
  type: number;
}

declare interface CloudStorageLifecycleItem {
  lifecycle: number;
  displayName: string;
}

declare interface ServiceTimeItem {
  days: number;
  months: number;
  displayName: string;
}

declare interface RecordTypeItem {
  recordType: number;
  displayName: string;
}

declare interface PlaceOrderRequest {
  payChannel: string;
  sn: string;
  packageId: number;
  renewal?: number;
  price?: number;
}

declare interface PlaceOrderResponse {
  payChannel: string;
  data: string;
  orderId: string;
  packageType: number;
}

declare interface OrderInfoItem {
  packageName: string;
  tradeStatus: string;
  tradeStatusDesc: string;
  createdAt: string;
  orderId: string;
  sn: string;
  price: number;
  payTime: string;
  deviceName: string;
  payerTotal: number;
  promotions: {
    type?: string;
    name: string;
    amount: number;
  }[];
  pkg: {
    lifecycle?: number;
    days: number;
    months: number;
    recordType: number;
    skuType: string;
    dataType?: number;
    dataTotal?: number;
    combinedType: number;
    combinedSubList?: CloudStoragePackageInfo[];
  };
  packageInfo: CloudStoragePackageInfo;
  payerCurrency: string;
}

declare interface IGetOrderListReponse extends IPageResponseParams {
  data: OrderInfoItem[];
}

declare interface IGetOrderListRequest extends IPageRequestParams {
  sn?: string;
}

declare interface SimpleDeviceInfo {
  productKey: string;
  deviceName: string;
  iotId: string;
  dnetMode: string[];
  pictureUrl: string;
  name: string;
  netType: string;
  // 是否使用esim
  esimStatus: boolean;
  // esim状态
  simState: number;
  sn: string;
  owner: boolean;
  // sim卡类型
  simType: number;
  esimGroupId: string;
}

declare interface IotAppUserLoginForm {
  username: string;
  password: string;
  loginType: 'CAPTCHA' | 'PASSWORD';
}

declare interface IotAppUserLoginResponse {
  token: string;
}

declare interface IotAppUserInfo {
  uid: number;
  username: string;
  nickname: string;
  timezone: string;
  email: string;
  phone: string;
  sex: number;
  avatarUrl: string;
  locale: string;
  hidden: number;
  grayscale: number;
}

declare interface PackageStatusInfo {
  state: number;
  sn: string;
  name: string;
  expireTime: number;
  toast: boolean;
  lifecycle: number;
  list: PackageInfoItem[];
}

declare interface PackageInfoItem {
  packageName: string;
  startTime: number;
  endTime: number;
  recordType: number;
  lifecycle: number;
  free: boolean;
  renewal: boolean;
  orderId: string;
  queueState: number;
}

declare interface CreateOrderInfoForm {
  payChannel: 'WECHAT' | 'ALIPAY' | 'FREE' | 'PAYPAL' | 'GOOGLEPAY' | 'APPLY';
  sn: string;
  packageId?: number;
  renewal?: number;
  price?: number;
}

declare interface CreateOrderResponse {
  payChannel: string;
  data: string;
  orderId: string;
  packageType: number;
}

declare interface CaptureOrderRequest {
  orderId?: string;
  transactionId?: string;
  message?: string;
  timestamp?: number;
  extras?: any;
}

declare interface CaptureOrderResponse {}

// declare interface TrafficPackageInfo {
//   packageId: number;
//   name: string;
//   displayName: string;
//   days: number;
//   months: number;
//   price: number;
//   originalPrice: number;
//   currency: string;
//   type: number;
//   recommend: number;
//   badge: string;
//   sortIndex: number;
//   dataType: number;
//   dataTotal: number;
// }

declare type TrafficPackageInfo = CloudStoragePackageInfo;

declare interface TrafficPackageServiceStatusInfo {
  state: number;
  sn: string;
  name: string;
  expireTime: number;
  toast: boolean;
  list: TrafficPackageBaseInfo[];
  netType: string;
  powerManageFeature: string;
  simType: number;
}

declare interface TrafficPackageBaseInfo {
  packageName: string;
  startTime: number;
  endTime: number;
  recordType: number;
  lifecycle: number;
  free: boolean;
  renewal: boolean;
  orderId: string;
  queueState: number;
}

declare interface IGetDeviceTrafficServiceRecordRequest extends IPageRequestParams {
  sn?: string;
}

declare interface IGetDeviceTrafficServiceRecordResponse extends IPageResponseParams {
  data: TrafficServiceInfo[];
}

declare interface TrafficServiceInfo {
  packageName: string;
  startTime: number;
  endTime: number;
  dataType: number;
  dataTotal: number;
  free: boolean;
  renewal: boolean;
  orderId: string;
  queueState: number;
}

declare interface CloudStoragePackageInfo {
  id: number;
  packageId: number;
  name: string;
  displayName: string;
  lifecycle: number;
  days: number;
  months: number;
  price: number;
  originalPrice: number;
  currency: string;
  recordType: number;
  type: number;
  recommend: number;
  badge: string;
  sortIndex: number;
  combinedType: number;
  combinedSubList: CloudStoragePackageInfo[] | null;
  skuType: string;
  dataType: number;
  dataTotal: number;
}

declare type IGetDeviceCloudStorageServiceRecordRequest = IGetDeviceTrafficServiceRecordRequest;

declare interface CloudStorageServiceRecord {
  packageId: number;
  packageType: number;
  days: number;
  months: number;
  packageName: string;
  startTime: number;
  endTime: number;
  recordType: number;
  lifecycle: number;
  free: true;
  renewal: true;
  orderId: string;
  queueState: number;
}

declare interface IGetDeviceCloudStorageServiceRecordResponse extends IPageResponseParams {
  data: CloudStorageServiceRecord[];
}

declare interface CloudStorageServiceStrongInfo {
  sn: string;
  serviceInfo: {
    state: number;
    sn: string;
    name: string;
    expireTime: number;
    toast: boolean;
    lifecycle: number;
    list: CloudStorageServiceRecord[];
    serviceDays: number;
    lifecyle: number;
  };
  deviceInfo: {
    sn: string;
    deviceId: string;
    iotId: string;
    state: number;
    productKey: string;
    deviceName: string;
    name: string;
    productType: string;
    serviceStatus: number;
    serviceState: number;
    infos: string;
    settings: any;
    shareId: number;
    permits: string[];
    netType: string;
    powerManageFeature: string;
  };
}

declare interface EsimGroup {
  operatorName: string;
  operatorId: string;
  recommend: number;
  operatorIconUrl: string;
  lastUsed: boolean;
}

declare interface ActiveEsimRequest {
  sn: string;
  operatorId: string;
}

declare interface DeviceNetworkStatusResponse {
  hasCompleted: boolean;
  needChooseOperator: boolean;
  runningProcessList: RunningProcessListItem[];
}

declare interface RunningProcessListItem {
  processState: string;
  stateDescription: string;
  timestamp: number;
}
