import { useMemo, useState } from 'react';
import { Plus } from 'lucide-react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { createColumnHelper, type ColumnDef } from '@tanstack/react-table';
import { queryClient } from '@/api/query/query-client';
import { useDraftForm } from '@/hooks/use-draft-form';
import { useUploadField } from '@/hooks/use-upload-field';
import { useSecretaryFileRecordSaveMutation, useSecretaryQuery } from '@/features/secretary/api/secretary-api';
import { Field } from '@/shared/forms/field';
import { DateInput } from '@/shared/forms/date-input';
import { Input, Select } from '@/shared/forms/controls';
import { Alert } from '@/shared/ui/alert';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { Card } from '@/shared/ui/card';
import { Drawer } from '@/shared/ui/drawer';
import { DataTable } from '@/shared/tables/data-table';
import { ActionGroup, InlineMetricCard, MetricsGrid } from '@/shared/ui/actions';
import { Uploader } from '@/shared/upload/uploader';
import { showToast } from '@/shared/feedback/toast';
import { IconButton } from '@/shared/ui/icon-button';
import { formatDateTime } from '@/lib/utils';
import type { SecretaryFileRecord } from '@/types/secretary';

const helper = createColumnHelper<SecretaryFileRecord>();

const schema = z.object({
  fileCategory: z.enum(['proposal', 'cooperation', 'contract', 'report', 'other']),
  title: z.string().min(3, 'Judul wajib diisi.'),
  counterpartyName: z.string().min(3, 'Pihak terkait wajib diisi.'),
  documentDate: z.string().min(1, 'Tanggal dokumen wajib diisi.'),
  status: z.enum(['draft', 'review', 'active', 'archived']),
  keywordSummary: z.string().min(3, 'Ringkasan keyword wajib diisi.'),
});

type FormValues = z.infer<typeof schema>;

const defaults: FormValues = {
  fileCategory: 'proposal',
  title: '',
  counterpartyName: '',
  documentDate: '',
  status: 'draft',
  keywordSummary: '',
};

export function SecretaryWorkspace() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [search, setSearch] = useState('');
  const { data } = useSecretaryQuery();
  const mutation = useSecretaryFileRecordSaveMutation();
  const upload = useUploadField({
    maxSizeMb: 0.8,
    accept: ['image/png', 'image/jpeg', 'application/pdf'],
  });
  const payload = data?.data;
  const fileRecords = payload?.fileRecords.filter((item) =>
    [item.title, item.counterpartyName, item.recordCode, item.keywordSummary].some((field) =>
      field.toLowerCase().includes(search.toLowerCase()),
    ),
  ) ?? [];

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: defaults,
  });

  const { clearStoredDraft } = useDraftForm({
    module: 'secretary-file-record',
    form,
  });

  const columns = useMemo(
    () =>
      [
        helper.accessor('recordCode', { header: 'Kode' }),
        helper.accessor('title', { header: 'Judul' }),
        helper.accessor('counterpartyName', { header: 'Pihak Terkait' }),
        helper.accessor('documentDate', { header: 'Tanggal', cell: (info) => formatDateTime(`${info.getValue()}T00:00:00.000Z`) }),
        helper.accessor('status', {
          header: 'Status',
          cell: (info) => <Badge tone={info.getValue() === 'active' ? 'success' : info.getValue() === 'review' ? 'warning' : 'neutral'}>{info.getValue()}</Badge>,
        }),
      ] as Array<ColumnDef<SecretaryFileRecord, unknown>>,
    [],
  );

  async function onSubmit(values: FormValues) {
    const response = await mutation.mutateAsync(values);
    if (!response.success) {
      showToast('error', response.message);
      return;
    }

    clearStoredDraft();
    form.reset(defaults);
    setDrawerOpen(false);
    void queryClient.invalidateQueries({ queryKey: ['secretary'] });
    showToast('success', response.message);
  }

  return (
    <div className="space-y-6">
      <Alert
        title="Secretary workspace disusun dari empat flow legacy"
        description="Agenda kunjungan, koordinasi internal, surat rahasia, dan file registry disatukan agar operasional lebih cepat dipindai di desktop dan mobile."
        tone="info"
      />

      <MetricsGrid>
        <InlineMetricCard label="Agenda kunjungan" value={payload?.visitAgendas.length ?? 0} />
        <InlineMetricCard label="Koordinasi internal" value={payload?.internalCoordinations.length ?? 0} />
        <InlineMetricCard label="Surat rahasia" value={payload?.confidentialLetters.length ?? 0} />
        <InlineMetricCard label="File registry" value={payload?.fileRecords.length ?? 0} />
      </MetricsGrid>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <Card>
          <h2 className="text-lg font-bold">File Registry</h2>
          <div className="mt-4">
            <DataTable
              data={fileRecords}
              columns={columns}
              search={search}
              onSearchChange={setSearch}
              onBulkDelete={() => undefined}
              primaryAction={(
                <IconButton type="button" title="Tambah file registry" className="h-8 w-8 rounded-xl" onClick={() => setDrawerOpen(true)}>
                  <Plus className="h-4 w-4" />
                </IconButton>
              )}
              mobileCard={(item) => (
                <Card className="p-4">
                  <p className="text-xs uppercase tracking-[0.16em] text-[var(--color-muted)]">{item.recordCode}</p>
                  <h3 className="mt-2 text-lg font-bold">{item.title}</h3>
                  <p className="mt-1 text-sm text-[var(--color-muted)]">{item.counterpartyName}</p>
                  <div className="mt-4 flex items-center justify-between">
                    <Badge tone={item.status === 'active' ? 'success' : item.status === 'review' ? 'warning' : 'neutral'}>{item.status}</Badge>
                    <span className="text-xs text-[var(--color-muted)]">{item.documentDate}</span>
                  </div>
                </Card>
              )}
            />
          </div>
        </Card>

        <div className="space-y-6">
          <Card>
            <h2 className="text-lg font-bold">Agenda Kunjungan</h2>
            <div className="mt-4 space-y-3">
              {payload?.visitAgendas.map((item) => (
                <div key={item.id} className="rounded-[24px] border border-[var(--color-border)] bg-[var(--color-surface-subtle)] p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-semibold">{item.visitorName}</p>
                    <Badge tone={item.status === 'completed' ? 'success' : item.status === 'cancelled' ? 'danger' : 'warning'}>{item.status}</Badge>
                  </div>
                  <p className="mt-2 text-sm text-[var(--color-muted)]">{item.originName} - {item.location}</p>
                </div>
              ))}
            </div>
          </Card>
          <Card>
            <h2 className="text-lg font-bold">Koordinasi dan Surat</h2>
            <div className="mt-4 space-y-3 text-sm">
              {payload?.internalCoordinations.map((item) => (
                <div key={item.id} className="rounded-[24px] border border-[var(--color-border)] p-4">
                  <p className="font-semibold">{item.title}</p>
                  <p className="mt-1 text-[var(--color-muted)]">{item.divisionScope} - {item.hostName}</p>
                </div>
              ))}
              {payload?.confidentialLetters.map((item) => (
                <div key={item.id} className="rounded-[24px] border border-[var(--color-border)] p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-semibold">{item.subject}</p>
                    <Badge tone={item.confidentialityLevel === 'top_secret' ? 'danger' : item.confidentialityLevel === 'secret' ? 'warning' : 'neutral'}>{item.confidentialityLevel}</Badge>
                  </div>
                  <p className="mt-1 text-[var(--color-muted)]">{item.counterpartyName} - {item.letterDirection}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      <Drawer open={drawerOpen} title="Tambah File Registry" subtitle="Form frontend untuk proposal, kerja sama, kontrak, laporan, dan lampiran." onClose={() => setDrawerOpen(false)}>
        <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
          <Field label="Jenis file" required error={form.formState.errors.fileCategory?.message}>
            <Select {...form.register('fileCategory')}>
              <option value="proposal">proposal</option>
              <option value="cooperation">cooperation</option>
              <option value="contract">contract</option>
              <option value="report">report</option>
              <option value="other">other</option>
            </Select>
          </Field>
          <Field label="Judul" required error={form.formState.errors.title?.message}>
            <Input {...form.register('title')} />
          </Field>
          <Field label="Pihak terkait" required error={form.formState.errors.counterpartyName?.message}>
            <Input {...form.register('counterpartyName')} />
          </Field>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Tanggal dokumen" required error={form.formState.errors.documentDate?.message}>
              <DateInput {...form.register('documentDate')} />
            </Field>
            <Field label="Status" required error={form.formState.errors.status?.message}>
              <Select {...form.register('status')}>
                <option value="draft">draft</option>
                <option value="review">review</option>
                <option value="active">active</option>
                <option value="archived">archived</option>
              </Select>
            </Field>
          </div>
          <Field label="Keyword summary" required error={form.formState.errors.keywordSummary?.message}>
            <Input {...form.register('keywordSummary')} />
          </Field>
          <Uploader
            label="Lampiran registry"
            accept="image/png,image/jpeg,application/pdf"
            asset={null}
            isProcessing={upload.isProcessing}
            error={upload.error}
            onChange={async (file) => {
              try {
                await upload.processFile(file);
              } catch {
                return;
              }
            }}
          />
          <ActionGroup>
            <Button type="button" variant="secondary" onClick={() => { clearStoredDraft(); form.reset(defaults); }}>Clear Draft</Button>
            <Button type="submit" disabled={mutation.isPending}>{mutation.isPending ? 'Menyimpan...' : 'Simpan File Registry'}</Button>
          </ActionGroup>
        </form>
      </Drawer>
    </div>
  );
}
