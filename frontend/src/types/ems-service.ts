export type EmsServiceType = 'Treatment' | 'Pingsan' | 'Surat' | 'Operasi' | 'Rawat Inap' | 'Kematian';

export interface EmsServiceRecord {
  id: number;
  serviceCode: string;
  patientName: string;
  serviceType: EmsServiceType;
  serviceDetail: string;
  location: string;
  qty: number;
  paymentType: 'cash' | 'billing';
  dpjpName: string;
  teamNames: string[];
  medicineUsage: string;
  total: number;
  createdAt: string;
}

export interface EmsServiceFormValues {
  patientName: string;
  serviceType: EmsServiceType;
  serviceDetail: string;
  location: string;
  qty: number;
  paymentType: 'cash' | 'billing';
  dpjpName: string;
  teamNames: string[];
  medicineUsage: string;
}
