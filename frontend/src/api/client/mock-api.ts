import type { ApiResponse } from '@/types/api';
import type { LoginPayload, SessionUser } from '@/types/auth';
import type { MedicalServiceApi } from '@/api/client/medical-service-api';
import type { DashboardPayload } from '@/types/dashboard';
import type { EmsServiceFormValues, EmsServiceRecord } from '@/types/ems-service';
import type { MedicalRecord, MedicalRecordFormValues, UserLookupItem } from '@/types/medical-record';
import type { PharmacyRecapFormValues, PharmacyRecapRecord } from '@/types/pharmacy-recap';
import type { RealtimeDeltaPayload } from '@/types/realtime';
import type { SecretaryFileRecord, SecretaryFileRecordFormValues, SecretaryPayload } from '@/types/secretary';
import { delay, generateFileId } from '@/lib/utils';
import { readJson, writeJson } from '@/lib/storage';
import { realtimeClient } from '@/realtime/client/realtime-client';

const SESSION_KEY = 'medical-service-session-api';
const RECORDS_KEY = 'medical-service-medical-records';
const EMS_SERVICES_KEY = 'medical-service-ems-services';
const PHARMACY_RECAP_KEY = 'medical-service-pharmacy-recap';
const SECRETARY_FILE_KEY = 'medical-service-secretary-files';

const staffLookups: UserLookupItem[] = [
  { value: '11', label: 'Dr. Michael Moore', meta: { fullName: 'Dr. Michael Moore', position: 'Doctor', division: 'Medical', batch: 4 } },
  { value: '12', label: 'Dr. Alicia Yang', meta: { fullName: 'Dr. Alicia Yang', position: 'Specialist', division: 'Forensic', batch: 7 } },
  { value: '21', label: 'Nurse Dinda Pratama', meta: { fullName: 'Nurse Dinda Pratama', position: 'Assistant', division: 'Medical', batch: 6 } },
  { value: '22', label: 'Nurse Bima Surya', meta: { fullName: 'Nurse Bima Surya', position: 'Assistant', division: 'Medical', batch: 5 } },
];

const defaultSession: SessionUser = {
  id: 1,
  fullName: 'Michael Moore',
  role: 'Staff',
  position: 'Doctor',
  division: 'Medical',
  unitCode: 'roxwood',
  canViewAllUnits: false,
};

const seedRecords: MedicalRecord[] = [
  {
    id: 101,
    recordCode: 'MR-000101',
    patientName: 'Alden Brooks',
    patientCitizenId: 'RH39IQLC',
    patientOccupation: 'Civilian',
    patientDob: '1994-08-23',
    patientPhone: '08123456789',
    patientGender: 'Laki-laki',
    patientAddress: 'Jakarta, Indonesia',
    patientStatus: 'Rawat jalan',
    doctorId: 11,
    doctorName: 'Dr. Michael Moore',
    assistantIds: [21],
    assistantNames: ['Nurse Dinda Pratama'],
    operasiType: 'minor',
    visibilityScope: 'standard',
    medicalResultHtml: '<p>Luka sayat ringan, tindakan pembersihan luka dan balutan.</p>',
    ktpFile: {
      fileId: generateFileId(),
      fileName: 'ktp-alden.jpg',
      fileUrl: '/brand-logo.png',
      fileSize: 220000,
      mimeType: 'image/jpeg',
    },
    mriFile: null,
    createdBy: 'Michael Moore',
    createdAt: '2026-05-03T09:30:00.000Z',
    updatedAt: '2026-05-03T09:30:00.000Z',
  },
  {
    id: 102,
    recordCode: 'MR-000102',
    patientName: 'Karen Vega',
    patientCitizenId: 'ZX91PPKL',
    patientOccupation: 'Pilot',
    patientDob: '1989-11-19',
    patientPhone: '081298887776',
    patientGender: 'Perempuan',
    patientAddress: 'Bandung, Indonesia',
    patientStatus: 'Observasi',
    doctorId: 12,
    doctorName: 'Dr. Alicia Yang',
    assistantIds: [21, 22],
    assistantNames: ['Nurse Dinda Pratama', 'Nurse Bima Surya'],
    operasiType: 'major',
    visibilityScope: 'forensic_private',
    medicalResultHtml: '<p>Investigasi trauma lanjutan dengan dokumentasi MRI.</p>',
    ktpFile: {
      fileId: generateFileId(),
      fileName: 'ktp-karen.jpg',
      fileUrl: '/brand-logo.png',
      fileSize: 240000,
      mimeType: 'image/jpeg',
    },
    mriFile: {
      fileId: generateFileId(),
      fileName: 'mri-karen.jpg',
      fileUrl: '/brand-logo.png',
      fileSize: 320000,
      mimeType: 'image/jpeg',
    },
    createdBy: 'Alicia Yang',
    createdAt: '2026-05-02T12:00:00.000Z',
    updatedAt: '2026-05-04T03:15:00.000Z',
  },
];

const seedEmsServices: EmsServiceRecord[] = [
  {
    id: 301,
    serviceCode: 'EMS-0301',
    patientName: 'Raymond Cole',
    serviceType: 'Operasi',
    serviceDetail: 'Besar - Sedang',
    location: 'RS',
    qty: 1,
    paymentType: 'billing',
    dpjpName: 'Dr. Alicia Yang',
    teamNames: ['Nurse Dinda Pratama', 'Nurse Bima Surya'],
    medicineUsage: 'Operasi besar, observasi pasca tindakan',
    total: 6800000,
    createdAt: '2026-05-05T06:10:00.000Z',
  },
  {
    id: 302,
    serviceCode: 'EMS-0302',
    patientName: 'Jenna Park',
    serviceType: 'Treatment',
    serviceDetail: 'RS',
    location: 'Roxwood Main Clinic',
    qty: 1,
    paymentType: 'cash',
    dpjpName: 'Dr. Michael Moore',
    teamNames: ['Nurse Dinda Pratama'],
    medicineUsage: 'Bandage 1 pcs, Gauze',
    total: 450000,
    createdAt: '2026-05-06T01:40:00.000Z',
  },
];

const seedPharmacyRecap: PharmacyRecapRecord[] = [
  {
    id: 401,
    saleCode: 'FAR-0401',
    consumerName: 'Rina Sari',
    packageName: 'Paket A + Bandage',
    qtyBandage: 2,
    qtyIfaks: 1,
    qtyPainkiller: 0,
    medicName: 'Michael Moore',
    identityLabel: 'Executive',
    createdAt: '2026-05-05T03:00:00.000Z',
    status: 'merged',
  },
  {
    id: 402,
    saleCode: 'FAR-0402',
    consumerName: 'Budi Wicaksono',
    packageName: 'Paket Painkiller',
    qtyBandage: 0,
    qtyIfaks: 0,
    qtyPainkiller: 2,
    medicName: 'Alicia Yang',
    identityLabel: 'General Affair',
    createdAt: '2026-05-06T02:25:00.000Z',
    status: 'draft',
  },
];

const seedSecretary: SecretaryPayload = {
  visitAgendas: [
    {
      id: 501,
      agendaCode: 'VIS-250506-001',
      visitorName: 'PT Arunika Visit',
      originName: 'PT Arunika',
      visitPurpose: 'Koordinasi kerja sama layanan kesehatan korporat.',
      visitDate: '2026-05-07',
      visitTime: '10:00',
      location: 'Meeting Room A',
      picName: 'Michael Moore',
      status: 'scheduled',
    },
  ],
  internalCoordinations: [
    {
      id: 601,
      coordinationCode: 'INT-250506-001',
      title: 'Koordinasi Audit Farmasi',
      divisionScope: 'Medical, General Affair',
      hostName: 'Alicia Yang',
      coordinationDate: '2026-05-08',
      startTime: '13:30',
      status: 'scheduled',
      summaryNotes: 'Sinkronisasi stok, owner harian, dan kebutuhan follow-up audit.',
      followUpNotes: 'Siapkan rekap konsumsi dan checklist validasi paket.',
    },
  ],
  confidentialLetters: [
    {
      id: 701,
      registerCode: 'SEC-IN-250506-001',
      referenceNumber: 'RH/SEC/442',
      subject: 'Distribusi kontrak rahasia',
      counterpartyName: 'Board Office',
      letterDirection: 'incoming',
      confidentialityLevel: 'secret',
      letterDate: '2026-05-06',
      status: 'logged',
    },
  ],
  fileRecords: [
    {
      id: 801,
      recordCode: 'FIL-250506-001',
      fileCategory: 'proposal',
      title: 'Proposal Klinik Satellite',
      counterpartyName: 'PT Arunika',
      documentDate: '2026-05-04',
      status: 'review',
      keywordSummary: 'Proposal, satellite clinic, kerja sama, 2026',
    },
  ],
};

function getRecords() {
  const stored = readJson<MedicalRecord[]>(RECORDS_KEY, []);
  if (stored.length > 0) {
    return stored;
  }

  writeJson(RECORDS_KEY, seedRecords);
  return seedRecords;
}

function saveRecords(records: MedicalRecord[]) {
  writeJson(RECORDS_KEY, records);
}

function getEmsServices() {
  const stored = readJson<EmsServiceRecord[]>(EMS_SERVICES_KEY, []);
  if (stored.length > 0) {
    return stored;
  }

  writeJson(EMS_SERVICES_KEY, seedEmsServices);
  return seedEmsServices;
}

function saveEmsServices(records: EmsServiceRecord[]) {
  writeJson(EMS_SERVICES_KEY, records);
}

function getPharmacyRecap() {
  const stored = readJson<PharmacyRecapRecord[]>(PHARMACY_RECAP_KEY, []);
  if (stored.length > 0) {
    return stored;
  }

  writeJson(PHARMACY_RECAP_KEY, seedPharmacyRecap);
  return seedPharmacyRecap;
}

function savePharmacyRecap(records: PharmacyRecapRecord[]) {
  writeJson(PHARMACY_RECAP_KEY, records);
}

function getSecretaryFiles() {
  const stored = readJson<SecretaryFileRecord[]>(SECRETARY_FILE_KEY, []);
  if (stored.length > 0) {
    return stored;
  }

  writeJson(SECRETARY_FILE_KEY, seedSecretary.fileRecords);
  return seedSecretary.fileRecords;
}

function saveSecretaryFiles(records: SecretaryFileRecord[]) {
  writeJson(SECRETARY_FILE_KEY, records);
}

function respond<T>(data: T, message: string, toastType: ApiResponse<T>['meta']['toastType'] = 'info'): ApiResponse<T> {
  return {
    success: true,
    message,
    data,
    errors: null,
    meta: {
      toastType,
      version: 'v1',
      realtime: {
        enabled: true,
        fallback: 'polling',
      },
    },
  };
}

export const mockApi = {
  async login(payload: LoginPayload) {
    await delay();

    if (payload.pin !== '1234') {
      return {
        success: false,
        message: 'PIN tidak valid.',
        data: null,
        errors: { pin: ['PIN harus 1234 untuk mode demo.'] },
        meta: { toastType: 'error', version: 'v1' },
      } satisfies ApiResponse<null>;
    }

    const user = { ...defaultSession, fullName: payload.fullName, unitCode: payload.loginUnit };
    writeJson(SESSION_KEY, user);
    return respond(user, 'Login berhasil.', 'success');
  },

  async logout() {
    await delay(150);
    localStorage.removeItem(SESSION_KEY);
    return respond(null, 'Logout berhasil.', 'success');
  },

  async getSession() {
    await delay(120);
    const user = readJson<SessionUser | null>(SESSION_KEY, null);
    return respond(user, user ? 'Session aktif.' : 'Belum login.', 'info');
  },

  async getDashboard() {
    await delay();
    const records = getRecords();
    const emsServices = getEmsServices();
    const pharmacyRecap = getPharmacyRecap();
    const totalMajor = records.filter((record) => record.operasiType === 'major').length;
    return respond<DashboardPayload>(
      {
        summaryCards: [
          { label: 'Total Rekam Medis', value: records.length, tone: 'brand' as const },
          { label: 'Operasi Mayor', value: totalMajor, tone: 'danger' as const },
          { label: 'EMS Services Hari Ini', value: emsServices.length, tone: 'warning' as const },
          { label: 'Rekap Farmasi Aktif', value: pharmacyRecap.filter((item) => item.status !== 'reviewed').length, tone: 'success' as const },
        ],
        quickActions: [
          { title: 'Tambah Rekam Medis', href: '/medical-records/new' },
          { title: 'Input EMS Services', href: '/ems-services' },
          { title: 'Review Rekap Farmasi', href: '/pharmacy-recap' },
        ],
      },
      'Dashboard berhasil dimuat.',
    );
  },

  async getMedicalRecords(search = '') {
    await delay();
    const lower = search.trim().toLowerCase();
    const filtered = getRecords().filter((record) =>
      [record.patientName, record.patientCitizenId, record.recordCode, record.doctorName].some((field) =>
        field.toLowerCase().includes(lower),
      ),
    );

    return {
      ...respond(filtered, 'Daftar rekam medis berhasil dimuat.'),
      meta: {
        toastType: 'info',
        version: 'v1',
        pagination: {
          page: 1,
          perPage: filtered.length || 1,
          total: filtered.length,
          totalPages: 1,
        },
      },
    } satisfies ApiResponse<MedicalRecord[]>;
  },

  async getMedicalRecord(id: number) {
    await delay();
    const record = getRecords().find((item) => item.id === id) ?? null;
    return respond(record, record ? 'Detail rekam medis berhasil dimuat.' : 'Data tidak ditemukan.');
  },

  async saveMedicalRecord(values: MedicalRecordFormValues, recordId?: number) {
    await delay();
    const records = getRecords();
    const nextId = recordId ?? Math.max(...records.map((record) => record.id), 100) + 1;
    const now = new Date().toISOString();

    const payload: MedicalRecord = {
      id: nextId,
      recordCode: `MR-${String(nextId).padStart(6, '0')}`,
      createdAt: recordId ? records.find((record) => record.id === recordId)?.createdAt ?? now : now,
      updatedAt: now,
      createdBy: defaultSession.fullName,
      ...values,
    };

    const nextRecords = recordId
      ? records.map((record) => (record.id === recordId ? payload : record))
      : [payload, ...records];

    saveRecords(nextRecords);
    realtimeClient.emit({
      event: recordId ? 'medical-record.updated' : 'medical-record.created',
      data: {
        module: 'medical-records',
        recordId: String(payload.id),
        action: recordId ? 'updated' : 'created',
        actorId: String(defaultSession.id),
      },
      meta: {
        toastType: 'success',
        invalidate: ['medical-records:list', `medical-records:detail:${payload.id}`],
      },
    });

    return respond(payload, 'Rekam medis berhasil disimpan.', 'success');
  },

  async getEmsServices(search = '', type = '') {
    await delay();
    const lower = search.trim().toLowerCase();
    const filtered = getEmsServices().filter((record) => {
      const matchText = [record.patientName, record.serviceCode, record.dpjpName, record.location]
        .some((field) => field.toLowerCase().includes(lower));
      const matchType = !type || record.serviceType === type;
      return matchText && matchType;
    });

    return respond(filtered, 'Data EMS services berhasil dimuat.');
  },

  async saveEmsService(values: EmsServiceFormValues) {
    await delay();
    const services = getEmsServices();
    const nextId = Math.max(...services.map((record) => record.id), 300) + 1;
    const record: EmsServiceRecord = {
      id: nextId,
      serviceCode: `EMS-${String(nextId).padStart(4, '0')}`,
      createdAt: new Date().toISOString(),
      total: values.qty * (values.serviceType === 'Operasi' ? 2_500_000 : values.serviceType === 'Rawat Inap' ? 850_000 : 450_000),
      ...values,
    };

    saveEmsServices([record, ...services]);
    return respond(record, 'Data EMS services berhasil disimpan.', 'success');
  },

  async getPharmacyRecap(search = '', status = '') {
    await delay();
    const lower = search.trim().toLowerCase();
    const filtered = getPharmacyRecap().filter((record) => {
      const matchText = [record.consumerName, record.packageName, record.saleCode, record.identityLabel]
        .some((field) => field.toLowerCase().includes(lower));
      const matchStatus = !status || record.status === status;
      return matchText && matchStatus;
    });

    return respond(filtered, 'Rekap farmasi berhasil dimuat.');
  },

  async savePharmacyRecap(values: PharmacyRecapFormValues) {
    await delay();
    const records = getPharmacyRecap();
    const nextId = Math.max(...records.map((record) => record.id), 400) + 1;
    const record: PharmacyRecapRecord = {
      id: nextId,
      saleCode: `FAR-${String(nextId).padStart(4, '0')}`,
      medicName: defaultSession.fullName,
      createdAt: new Date().toISOString(),
      status: 'draft',
      ...values,
    };

    savePharmacyRecap([record, ...records]);
    return respond(record, 'Input rekap farmasi berhasil disimpan.', 'success');
  },

  async getSecretaryData() {
    await delay();
    return respond(
      {
        ...seedSecretary,
        fileRecords: getSecretaryFiles(),
      },
      'Data secretary berhasil dimuat.',
    );
  },

  async saveSecretaryFileRecord(values: SecretaryFileRecordFormValues) {
    await delay();
    const records = getSecretaryFiles();
    const nextId = Math.max(...records.map((record) => record.id), 800) + 1;
    const record: SecretaryFileRecord = {
      id: nextId,
      recordCode: `FIL-${String(nextId).padStart(6, '0')}`,
      ...values,
    };

    saveSecretaryFiles([record, ...records]);
    return respond(record, 'Data file secretary berhasil disimpan.', 'success');
  },

  async getUserLookup(scope: 'doctor' | 'assistant' | 'all', q = '') {
    await delay(120);
    const lower = q.toLowerCase();
    const filtered = staffLookups.filter((item) => {
      const matchesText = item.label.toLowerCase().includes(lower);
      if (!matchesText) {
        return false;
      }
      if (scope === 'doctor') {
        return item.meta.position.toLowerCase().includes('doctor') || item.meta.position.toLowerCase().includes('specialist');
      }
      if (scope === 'assistant') {
        return item.meta.position.toLowerCase().includes('assistant');
      }
      return true;
    });

    return respond(filtered, 'Lookup berhasil dimuat.');
  },

  async getRealtimeDelta() {
    await delay(120);
    return respond<RealtimeDeltaPayload>(
      {
        hasChanges: false,
        latestCursor: new Date().toISOString(),
        events: [],
      },
      'Delta berhasil dimuat.',
    );
  },
} satisfies MedicalServiceApi;
