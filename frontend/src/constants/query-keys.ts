export const queryKeys = {
  auth: ['auth'] as const,
  session: ['auth', 'session'] as const,
  dashboard: ['dashboard'] as const,
  medicalRecords: ['medical-records'] as const,
  medicalRecordDetail: (id: number) => ['medical-records', id] as const,
  emsServices: ['ems-services'] as const,
  pharmacyRecap: ['pharmacy-recap'] as const,
  secretary: ['secretary'] as const,
  lookups: (scope: string, q: string) => ['lookups', scope, q] as const,
};
