import { useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useWatch } from 'react-hook-form';
import { useMedicalRecordDetailQuery, useMedicalRecordSaveMutation, useUserLookupQuery } from '@/features/medical-records/api/medical-record-api';
import { medicalRecordSchema, type MedicalRecordSchema } from '@/features/medical-records/schema/medical-record-schema';
import { useDraftForm } from '@/hooks/use-draft-form';
import { useUploadField } from '@/hooks/use-upload-field';
import { Autocomplete } from '@/shared/forms/autocomplete';
import { Field, FieldSection } from '@/shared/forms/field';
import { Input, Select, Textarea } from '@/shared/forms/controls';
import { Uploader } from '@/shared/upload/uploader';
import { Button } from '@/shared/ui/button';
import { showToast } from '@/shared/feedback/toast';
import { FormFooter } from '@/shared/ui/actions';
import type { UserLookupItem } from '@/types/medical-record';

const defaults: MedicalRecordSchema = {
  patientName: '',
  patientCitizenId: '',
  patientOccupation: 'Civilian',
  patientDob: '',
  patientPhone: '',
  patientGender: 'Laki-laki',
  patientAddress: 'INDONESIA',
  patientStatus: 'Rawat jalan',
  doctorId: 0,
  doctorName: '',
  assistantIds: [],
  assistantNames: [],
  operasiType: 'minor',
  visibilityScope: 'standard',
  medicalResultHtml: '<p></p>',
  ktpFile: null,
  mriFile: null,
};

export function MedicalRecordForm({
  recordId,
  onSuccess,
}: {
  recordId?: number;
  onSuccess?: () => void;
}) {
  const [doctorSearch, setDoctorSearch] = useState('');
  const [assistantSearch, setAssistantSearch] = useState('');
  const { data: detail } = useMedicalRecordDetailQuery(recordId ?? 0, Boolean(recordId));
  const { data: doctorLookup } = useUserLookupQuery('doctor', doctorSearch);
  const { data: assistantLookup } = useUserLookupQuery('assistant', assistantSearch);
  const saveMutation = useMedicalRecordSaveMutation(recordId);
  const ktpUpload = useUploadField();
  const mriUpload = useUploadField();

  const form = useForm<MedicalRecordSchema>({
    resolver: zodResolver(medicalRecordSchema),
    defaultValues: defaults,
  });

  const { clearStoredDraft } = useDraftForm({
    module: 'medical-record',
    recordId,
    form,
  });

  useEffect(() => {
    if (detail?.data) {
      form.reset(detail.data);
    }
  }, [detail, form]);

  const visibilityScope = useWatch({
    control: form.control,
    name: 'visibilityScope',
  });
  const doctorName = useWatch({
    control: form.control,
    name: 'doctorName',
  });
  const assistantNames = useWatch({
    control: form.control,
    name: 'assistantNames',
  });
  const ktpFile = useWatch({
    control: form.control,
    name: 'ktpFile',
  });
  const mriFile = useWatch({
    control: form.control,
    name: 'mriFile',
  });
  const errors = form.formState.errors;
  const doctorOptions = doctorLookup?.data ?? [];
  const assistantOptions = assistantLookup?.data ?? [];

  async function onSubmit(values: MedicalRecordSchema) {
    const response = await saveMutation.mutateAsync(values);
    if (!response.success) {
      showToast('error', response.message);
      return;
    }

    clearStoredDraft();
    showToast('success', response.message);
    onSuccess?.();
  }

  return (
    <div className="space-y-6">
      <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
        <FieldSection title="Identitas Pasien">
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Nama pasien" required error={errors.patientName?.message}>
              <Input {...form.register('patientName')} />
            </Field>
            <Field label="Citizen ID" required error={errors.patientCitizenId?.message}>
              <Input {...form.register('patientCitizenId')} />
            </Field>
            <Field label="Pekerjaan" error={errors.patientOccupation?.message}>
              <Input {...form.register('patientOccupation')} />
            </Field>
            <Field label="Tanggal lahir" required error={errors.patientDob?.message}>
              <Input type="date" {...form.register('patientDob')} />
            </Field>
            <Field label="Telepon" error={errors.patientPhone?.message}>
              <Input {...form.register('patientPhone')} />
            </Field>
            <Field label="Jenis kelamin" required error={errors.patientGender?.message}>
              <Select {...form.register('patientGender')}>
                <option value="Laki-laki">Laki-laki</option>
                <option value="Perempuan">Perempuan</option>
              </Select>
            </Field>
            <Field label="Status pasien" error={errors.patientStatus?.message}>
              <Input {...form.register('patientStatus')} />
            </Field>
            <Field label="Scope visibilitas" required error={errors.visibilityScope?.message}>
              <Select {...form.register('visibilityScope')}>
                <option value="standard">standard</option>
                <option value="forensic_private">forensic_private</option>
              </Select>
            </Field>
            <div className="md:col-span-2">
              <Field label="Alamat" error={errors.patientAddress?.message}>
                <Textarea {...form.register('patientAddress')} />
              </Field>
            </div>
          </div>
        </FieldSection>

        <FieldSection title="Tim Medis" description="Lookup doctor dan assistant meniru flow select user legacy tanpa mengikat UI ke endpoint PHP lama.">
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Dokter DPJP" required error={errors.doctorId?.message ?? errors.doctorName?.message}>
              <Autocomplete
                value={doctorName}
                search={doctorSearch}
                options={doctorOptions.map(mapLookupOption)}
                placeholder="Cari dokter..."
                emptyLabel="Dokter tidak ditemukan."
                onSearchChange={setDoctorSearch}
                onSelect={(option) => {
                  const picked = doctorOptions.find((item) => item.value === option.value);
                  form.setValue('doctorId', Number(picked?.value ?? 0), { shouldValidate: true });
                  form.setValue('doctorName', picked?.label ?? '', { shouldValidate: true });
                  setDoctorSearch(picked?.label ?? '');
                }}
              />
            </Field>
            <Field label="Asisten" required error={errors.assistantIds?.message ?? errors.assistantNames?.message}>
              <Autocomplete
                value={assistantNames?.[0] ?? ''}
                search={assistantSearch}
                options={assistantOptions.map(mapLookupOption)}
                placeholder="Cari asisten..."
                emptyLabel="Asisten tidak ditemukan."
                onSearchChange={setAssistantSearch}
                onSelect={(option) => {
                  const picked = assistantOptions.find((item) => item.value === option.value);
                  form.setValue('assistantIds', picked ? [Number(picked.value)] : [], { shouldValidate: true });
                  form.setValue('assistantNames', picked ? [picked.label] : [], { shouldValidate: true });
                  setAssistantSearch(picked?.label ?? '');
                }}
              />
            </Field>
            <Field label="Jenis operasi" required error={errors.operasiType?.message}>
              <Select {...form.register('operasiType')}>
                <option value="minor">Minor</option>
                <option value="major">Mayor</option>
              </Select>
            </Field>
          </div>
        </FieldSection>

        <FieldSection title="Hasil dan Lampiran" description="Autosave form tetap berjalan. Upload preview memakai kompresi browser dan cocok untuk shared hosting karena semua proses terjadi di client.">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="md:col-span-2">
              <Field label="Hasil rekam medis" required error={errors.medicalResultHtml?.message}>
                <Textarea {...form.register('medicalResultHtml')} />
              </Field>
            </div>
            <Uploader
              label="Lampiran KTP"
              required
              asset={ktpFile}
              isProcessing={ktpUpload.isProcessing}
              onChange={async (file) => {
                const asset = await ktpUpload.processFile(file);
                form.setValue('ktpFile', asset, { shouldValidate: true });
              }}
            />
            <Uploader
              label="Lampiran MRI"
              required={visibilityScope === 'forensic_private'}
              asset={mriFile}
              isProcessing={mriUpload.isProcessing}
              onChange={async (file) => {
                const asset = await mriUpload.processFile(file);
                form.setValue('mriFile', asset, { shouldValidate: true });
              }}
            />
          </div>
          {(errors.ktpFile?.message || errors.mriFile?.message) ? (
            <div className="rounded-2xl bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
              {errors.ktpFile?.message ?? errors.mriFile?.message}
            </div>
          ) : null}
        </FieldSection>

        <FormFooter hint="Draft tersimpan otomatis di browser. Tombol clear draft akan menghapus cache form modul ini.">
          <Button
            type="button"
            variant="secondary"
            onClick={() => {
              clearStoredDraft();
              form.reset(defaults);
              showToast('info', 'Draft berhasil dibersihkan.');
            }}
          >
            Clear Draft
          </Button>
          <Button type="submit" disabled={saveMutation.isPending}>
            {saveMutation.isPending ? 'Menyimpan...' : 'Simpan Rekam Medis'}
          </Button>
        </FormFooter>
      </form>
    </div>
  );
}

function mapLookupOption(option: UserLookupItem) {
  return {
    value: option.value,
    label: option.label,
    description: [option.meta.position, option.meta.division].filter(Boolean).join(' / '),
  };
}
