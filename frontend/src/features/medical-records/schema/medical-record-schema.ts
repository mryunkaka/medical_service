import { z } from 'zod';

export const medicalRecordSchema = z
  .object({
    patientName: z.string().min(3, 'Nama pasien wajib diisi.'),
    patientCitizenId: z.string().min(4, 'Citizen ID wajib diisi.'),
    patientOccupation: z.string().min(2, 'Pekerjaan wajib diisi.'),
    patientDob: z.string().min(1, 'Tanggal lahir wajib diisi.'),
    patientPhone: z.string().min(8, 'Nomor telepon minimal 8 digit.'),
    patientGender: z.enum(['Laki-laki', 'Perempuan']),
    patientAddress: z.string().min(5, 'Alamat wajib diisi.'),
    patientStatus: z.string().min(2, 'Status pasien wajib diisi.'),
    doctorId: z.number().int().positive('Dokter DPJP wajib dipilih.'),
    doctorName: z.string().min(3, 'Nama dokter wajib ada.'),
    assistantIds: z.array(z.number().int().positive()).min(1, 'Minimal satu asisten harus dipilih.'),
    assistantNames: z.array(z.string().min(1)).min(1, 'Nama asisten wajib ada.'),
    operasiType: z.enum(['major', 'minor']),
    visibilityScope: z.enum(['standard', 'forensic_private']),
    medicalResultHtml: z.string().min(10, 'Hasil rekam medis wajib diisi.'),
    ktpFile: z
      .object({
        fileId: z.string(),
        fileName: z.string(),
        fileUrl: z.string(),
        fileSize: z.number(),
        mimeType: z.string(),
      })
      .nullable()
      .optional(),
    mriFile: z
      .object({
        fileId: z.string(),
        fileName: z.string(),
        fileUrl: z.string(),
        fileSize: z.number(),
        mimeType: z.string(),
      })
      .nullable()
      .optional(),
  })
  .superRefine((value, context) => {
    if (!value.ktpFile) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Lampiran KTP wajib ada.',
        path: ['ktpFile'],
      });
    }

    if (value.visibilityScope === 'forensic_private' && !value.mriFile) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Lampiran MRI wajib untuk forensic private.',
        path: ['mriFile'],
      });
    }
  });

export type MedicalRecordSchema = z.infer<typeof medicalRecordSchema>;
