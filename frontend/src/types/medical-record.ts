export type VisibilityScope = 'standard' | 'forensic_private';
export type OperationType = 'major' | 'minor';

export interface UploadAsset {
  fileId: string;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  mimeType: string;
}

export interface MedicalRecord {
  id: number;
  recordCode: string;
  patientName: string;
  patientCitizenId: string;
  patientOccupation: string;
  patientDob: string;
  patientPhone: string;
  patientGender: 'Laki-laki' | 'Perempuan';
  patientAddress: string;
  patientStatus: string;
  doctorId: number;
  doctorName: string;
  assistantIds: number[];
  assistantNames: string[];
  operasiType: OperationType;
  visibilityScope: VisibilityScope;
  medicalResultHtml: string;
  ktpFile?: UploadAsset | null;
  mriFile?: UploadAsset | null;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface MedicalRecordFormValues {
  patientName: string;
  patientCitizenId: string;
  patientOccupation: string;
  patientDob: string;
  patientPhone: string;
  patientGender: 'Laki-laki' | 'Perempuan';
  patientAddress: string;
  patientStatus: string;
  doctorId: number;
  doctorName: string;
  assistantIds: number[];
  assistantNames: string[];
  operasiType: OperationType;
  visibilityScope: VisibilityScope;
  medicalResultHtml: string;
  ktpFile?: UploadAsset | null;
  mriFile?: UploadAsset | null;
}

export interface UserLookupItem {
  value: string;
  label: string;
  meta: {
    fullName: string;
    position: string;
    division: string;
    batch?: number;
  };
}
