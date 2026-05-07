import * as React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { MedicalRecordForm } from '@/features/medical-records/components/medical-record-form';
import { createDraftKey } from '@/state/draft/draft-keys';

const mutateAsync = vi.fn();
const showToast = vi.fn();
const storage = new Map<string, string>();

vi.mock('@/features/medical-records/api/medical-record-api', () => ({
  useMedicalRecordDetailQuery: () => ({ data: undefined }),
  useMedicalRecordSaveMutation: () => ({ isPending: false, mutateAsync }),
  useUserLookupQuery: (scope: 'doctor' | 'assistant') => ({
    data: {
      data: scope === 'doctor'
        ? [{ value: '11', label: 'Dr. Test', meta: { position: 'Doctor', division: 'Medis' } }]
        : [{ value: '21', label: 'Nurse Test', meta: { position: 'Assistant', division: 'Medis' } }],
    },
  }),
}));

vi.mock('@/shared/feedback/toast', () => ({
  showToast: (...args: unknown[]) => showToast(...args),
}));

vi.mock('@/shared/forms/autocomplete', () => ({
  Autocomplete: ({
    options,
    onSelect,
  }: {
    options: Array<{ value: string; label: string }>;
    onSelect: (option: { value: string; label: string }) => void;
  }) => {
    const selectedRef = React.useRef(false);

    React.useEffect(() => {
      if (!selectedRef.current && options[0]) {
        selectedRef.current = true;
        onSelect(options[0]);
      }
    }, [onSelect, options]);

    return <div>{options[0]?.label ?? 'lookup'}</div>;
  },
}));

vi.mock('@/shared/upload/uploader', () => ({
  Uploader: ({
    label,
    onChange,
  }: {
    label: string;
    onChange: (file: File) => Promise<void> | void;
  }) => (
    <button
      type="button"
      onClick={() => onChange(new File(['content'], `${label}.png`, { type: 'image/png' }))}
    >
      Upload {label}
    </button>
  ),
}));

vi.mock('@/hooks/use-upload-field', () => ({
  useUploadField: () => ({
    isProcessing: false,
    error: null,
    processFile: async (file: File) => ({
      fileId: 'file-1',
      fileName: file.name,
      fileUrl: `blob:${file.name}`,
      fileSize: file.size,
      mimeType: file.type,
      rawFile: file,
    }),
  }),
}));

describe('MedicalRecordForm draft retention', () => {
  beforeEach(() => {
    storage.clear();
    vi.stubGlobal('localStorage', {
      getItem: (key: string) => storage.get(key) ?? null,
      setItem: (key: string, value: string) => {
        storage.set(key, value);
      },
      removeItem: (key: string) => {
        storage.delete(key);
      },
      clear: () => storage.clear(),
    });
    mutateAsync.mockReset();
    showToast.mockReset();
  });

  it('keeps draft in storage when save fails', async () => {
    mutateAsync.mockResolvedValue({
      success: false,
      message: 'Gagal simpan',
    });

    const user = userEvent.setup();
    render(<MedicalRecordForm />);

    await user.type(screen.getByLabelText(/Nama pasien/i), 'QA Draft');
    await user.type(screen.getByLabelText(/Citizen ID/i), '3201998877665544');
    await user.clear(screen.getByLabelText(/Pekerjaan/i));
    await user.type(screen.getByLabelText(/Pekerjaan/i), 'Tester');
    await user.type(screen.getByLabelText(/Tanggal lahir/i), '1990-02-01');
    await user.type(screen.getByLabelText(/Telepon/i), '081234567891');
    await user.clear(screen.getByLabelText(/Status pasien/i));
    await user.type(screen.getByLabelText(/Status pasien/i), 'Rawat jalan');
    await user.clear(screen.getByLabelText(/Alamat/i));
    await user.type(screen.getByLabelText(/Alamat/i), 'Jl QA Draft Test');
    await user.type(screen.getByLabelText(/Hasil rekam medis/i), 'QA result');
    await user.click(screen.getByRole('button', { name: /Upload Lampiran KTP/i }));

    await waitFor(() => {
      expect(storage.get(createDraftKey('medical-record'))).toContain('QA Draft');
    });

    await user.click(screen.getByRole('button', { name: /Simpan Rekam Medis/i }));

    await waitFor(() => {
      expect(mutateAsync).toHaveBeenCalledTimes(1);
      expect(showToast).toHaveBeenCalledWith('error', 'Gagal simpan');
      expect(storage.get(createDraftKey('medical-record'))).toContain('QA Draft');
    });
  });
});
