import type { UploadAsset } from '@/types/medical-record';
import { Button } from '@/shared/ui/button';

interface UploaderProps {
  label: string;
  asset?: UploadAsset | null;
  accept?: string;
  required?: boolean;
  isProcessing?: boolean;
  error?: string | null;
  onChange: (file: File) => void;
}

export function Uploader({ label, asset, accept = 'image/png,image/jpeg', required, isProcessing, error, onChange }: UploaderProps) {
  const isImage = Boolean(asset?.mimeType.startsWith('image/'));

  return (
    <div className="rounded-[24px] border border-dashed border-[var(--color-border)] bg-white p-4">
      <div className="mb-3 flex items-center justify-between gap-2">
        <div>
          <p className="text-sm font-semibold text-[var(--color-text)]">
            {label} {required ? <span className="text-[var(--color-accent)]">*</span> : null}
          </p>
          <p className="text-xs text-[var(--color-muted)]">PNG atau JPG. Sistem kompres otomatis sebelum preview.</p>
        </div>
        <label>
          <input
            type="file"
            accept={accept}
            className="hidden"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) {
                onChange(file);
              }
            }}
          />
          <Button type="button" variant="secondary" disabled={isProcessing}>
            {isProcessing ? 'Memproses...' : 'Pilih file'}
          </Button>
        </label>
      </div>
      {asset ? (
        <div className="rounded-2xl bg-[var(--color-bg)] p-3">
          <p className="truncate text-sm font-medium text-[var(--color-text)]">{asset.fileName}</p>
          <p className="mt-1 text-xs text-[var(--color-muted)]">{Math.round(asset.fileSize / 1024)} KB</p>
          {isImage ? (
            <img src={asset.fileUrl} alt={asset.fileName} className="mt-3 h-48 w-full rounded-2xl object-cover" />
          ) : (
            <div className="mt-3 rounded-2xl border border-[var(--color-border)] bg-white p-4">
              <p className="text-sm font-semibold text-[var(--color-text)]">Preview file non-gambar</p>
              <a href={asset.fileUrl} target="_blank" rel="noreferrer" className="mt-2 inline-flex text-sm font-semibold text-[var(--color-accent)]">
                Buka lampiran
              </a>
            </div>
          )}
        </div>
      ) : null}
      {error ? <p className="mt-3 text-sm font-medium text-[var(--color-danger)]">{error}</p> : null}
    </div>
  );
}
