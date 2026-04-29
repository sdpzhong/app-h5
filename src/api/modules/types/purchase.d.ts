declare interface PurchasePackage {
  packageId: number;
  name: string;
  displayName: string;
  days: number;
  months: number;
  price: number;
  originalPrice: number;
  currency: string;
  type: number;
  recommend: number;
  badge: string;
  sortIndex: number;
  combinedType: number;
  // COMBO, CS, DATA
  skuType: string;
  combinedSubList: PurchasePackage[];
  lifecycle: number;
  recordType: number;
  dataType: number;
  dataTotal: number;
}
