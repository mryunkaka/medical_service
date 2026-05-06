export const APP_ROUTES = {
  login: '/login',
  dashboard: '/',
  medicalRecords: '/medical-records',
  medicalRecordCreate: '/medical-records/new',
  medicalRecordEdit: '/medical-records/:recordId/edit',
  emsServices: '/ems-services',
  pharmacyRecap: '/pharmacy-recap',
  secretary: '/secretary',
  account: '/account',
} as const;
