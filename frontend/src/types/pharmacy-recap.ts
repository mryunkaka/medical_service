export type PharmacyRecapStatus = 'draft' | 'merged' | 'reviewed';

export interface PharmacyRecapRecord {
  id: number;
  saleCode: string;
  consumerName: string;
  packageName: string;
  qtyBandage: number;
  qtyIfaks: number;
  qtyPainkiller: number;
  medicName: string;
  identityLabel: string;
  createdAt: string;
  status: PharmacyRecapStatus;
}

export interface PharmacyRecapFormValues {
  consumerName: string;
  packageName: string;
  qtyBandage: number;
  qtyIfaks: number;
  qtyPainkiller: number;
  identityLabel: string;
}
