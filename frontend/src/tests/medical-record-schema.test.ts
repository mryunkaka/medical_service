import { describe, expect, it } from 'vitest';
import { medicalRecordSchema } from '@/features/medical-records/schema/medical-record-schema';

describe('medicalRecordSchema', () => {
  it('requires MRI file for forensic private records', () => {
    const result = medicalRecordSchema.safeParse({
      patientName: 'Test User',
      patientCitizenId: 'ABC123',
      patientOccupation: 'Civilian',
      patientDob: '1990-01-01',
      patientPhone: '0812345678',
      patientGender: 'Laki-laki',
      patientAddress: 'Jakarta',
      patientStatus: 'Rawat jalan',
      doctorId: 11,
      doctorName: 'Dr. Michael Moore',
      assistantIds: [21],
      assistantNames: ['Nurse Dinda Pratama'],
      operasiType: 'major',
      visibilityScope: 'forensic_private',
      medicalResultHtml: '<p>Tindakan test</p>',
      ktpFile: {
        fileId: '1',
        fileName: 'ktp.jpg',
        fileUrl: '/ktp.jpg',
        fileSize: 10,
        mimeType: 'image/jpeg',
      },
      mriFile: null,
    });

    expect(result.success).toBe(false);
  });
});
