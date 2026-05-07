import { describe, expect, it } from 'vitest';
import { buildMedicalRecordFormData } from '@/api/client/form-data';

describe('buildMedicalRecordFormData', () => {
  it('maps medical record fields and files into multipart payload', () => {
    const file = new File(['file-content'], 'ktp.png', { type: 'image/png' });
    const formData = buildMedicalRecordFormData({
      patientName: 'QA Multipart',
      patientCitizenId: '3201998877665544',
      patientOccupation: 'Tester',
      patientDob: '1990-02-01',
      patientPhone: '081234567891',
      patientGender: 'Laki-laki',
      patientAddress: 'Jl Multipart',
      patientStatus: 'Rawat jalan',
      doctorId: 11,
      doctorName: 'Dr. Test',
      assistantIds: [21],
      assistantNames: ['Nurse Test'],
      operasiType: 'minor',
      visibilityScope: 'standard',
      medicalResultHtml: '<p>QA</p>',
      ktpFile: {
        fileId: 'ktp-1',
        fileName: 'ktp.png',
        fileUrl: 'blob:http://localhost/mock',
        fileSize: 12,
        mimeType: 'image/png',
        rawFile: file,
      },
      mriFile: null,
    });

    expect(formData.get('patientName')).toBe('QA Multipart');
    expect(formData.get('assistantIds[]')).toBe('21');
    expect(formData.get('ktpFile[fileName]')).toBe('ktp.png');
    expect(formData.get('ktp_file')).toBeInstanceOf(File);
    expect((formData.get('ktp_file') as File).name).toBe('ktp.png');
  });
});
