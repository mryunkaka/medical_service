import type { MedicalRecordFormValues, UploadAsset } from '@/types/medical-record';

export function buildMedicalRecordFormData(values: MedicalRecordFormValues) {
  const formData = new FormData();

  appendValue(formData, 'patientName', values.patientName);
  appendValue(formData, 'patientCitizenId', values.patientCitizenId);
  appendValue(formData, 'patientOccupation', values.patientOccupation);
  appendValue(formData, 'patientDob', values.patientDob);
  appendValue(formData, 'patientPhone', values.patientPhone);
  appendValue(formData, 'patientGender', values.patientGender);
  appendValue(formData, 'patientAddress', values.patientAddress);
  appendValue(formData, 'patientStatus', values.patientStatus);
  appendValue(formData, 'doctorId', values.doctorId);
  appendValue(formData, 'doctorName', values.doctorName);
  appendValue(formData, 'operasiType', values.operasiType);
  appendValue(formData, 'visibilityScope', values.visibilityScope);
  appendValue(formData, 'medicalResultHtml', values.medicalResultHtml);

  values.assistantIds.forEach((value) => appendValue(formData, 'assistantIds[]', value));
  values.assistantNames.forEach((value) => appendValue(formData, 'assistantNames[]', value));

  appendUploadAsset(formData, 'ktpFile', 'ktp_file', values.ktpFile);
  appendUploadAsset(formData, 'mriFile', 'mri_file', values.mriFile);

  return formData;
}

function appendUploadAsset(formData: FormData, fieldName: string, fileFieldName: string, asset?: UploadAsset | null) {
  if (!asset) {
    return;
  }

  if (asset.rawFile) {
    formData.append(fileFieldName, asset.rawFile, asset.fileName);
  }

  Object.entries(asset).forEach(([key, value]) => {
    if (key === 'rawFile' || value === undefined || value === null) {
      return;
    }

    appendValue(formData, `${fieldName}[${key}]`, value);
  });
}

function appendValue(formData: FormData, key: string, value: string | number | boolean) {
  formData.append(key, String(value));
}
