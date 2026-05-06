import { useMemo, useState } from 'react';
import { Plus } from 'lucide-react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { createColumnHelper, type ColumnDef } from '@tanstack/react-table';
import { queryClient } from '@/api/query/query-client';
import { usePharmacyRecapQuery, usePharmacyRecapSaveMutation } from '@/features/pharmacy-recap/api/pharmacy-recap-api';
import { useDraftForm } from '@/hooks/use-draft-form';
import { Field } from '@/shared/forms/field';
import { Input, Select } from '@/shared/forms/controls';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { Card } from '@/shared/ui/card';
import { Drawer } from '@/shared/ui/drawer';
import { DataTable } from '@/shared/tables/data-table';
import { ActionGroup, InlineMetricCard, MetricsGrid } from '@/shared/ui/actions';
import { showToast } from '@/shared/feedback/toast';
import { IconButton } from '@/shared/ui/icon-button';
import { formatDateTime } from '@/lib/utils';
import type { PharmacyRecapRecord } from '@/types/pharmacy-recap';

const helper = createColumnHelper<PharmacyRecapRecord>();

const schema = z.object({
  consumerName: z.string().min(3, 'Nama konsumen wajib diisi.'),
  packageName: z.string().min(3, 'Paket wajib diisi.'),
  qtyBandage: z.number().int().min(0),
  qtyIfaks: z.number().int().min(0),
  qtyPainkiller: z.number().int().min(0),
  identityLabel: z.string().min(3, 'Label identitas wajib diisi.'),
});

type FormValues = z.infer<typeof schema>;

const defaults: FormValues = {
  consumerName: '',
  packageName: '',
  qtyBandage: 0,
  qtyIfaks: 0,
  qtyPainkiller: 0,
  identityLabel: '',
};

export function PharmacyRecapWorkspace() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { data } = usePharmacyRecapQuery(search, statusFilter);
  const mutation = usePharmacyRecapSaveMutation();
  const records = data?.data ?? [];

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: defaults,
  });

  const { clearStoredDraft } = useDraftForm({
    module: 'pharmacy-recap',
    form,
  });

  const columns = useMemo(
    () =>
      [
        helper.accessor('createdAt', { header: 'Tanggal', cell: (info) => formatDateTime(info.getValue()) }),
        helper.accessor('saleCode', { header: 'Kode' }),
        helper.accessor('consumerName', { header: 'Konsumen' }),
        helper.accessor('packageName', { header: 'Paket' }),
        helper.accessor('identityLabel', { header: 'Identity' }),
        helper.accessor('status', {
          header: 'Status',
          cell: (info) => <Badge tone={info.getValue() === 'merged' ? 'success' : info.getValue() === 'reviewed' ? 'neutral' : 'warning'}>{info.getValue()}</Badge>,
        }),
      ] as Array<ColumnDef<PharmacyRecapRecord, unknown>>,
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
    void queryClient.invalidateQueries({ queryKey: ['pharmacy-recap'] });
    showToast('success', response.message);
  }

  return (
    <div className="space-y-6">
      <MetricsGrid>
        <InlineMetricCard label="Total transaksi" value={records.length} />
        <InlineMetricCard label="Bandage" value={records.reduce((sum, item) => sum + item.qtyBandage, 0)} />
        <InlineMetricCard label="IFAKS" value={records.reduce((sum, item) => sum + item.qtyIfaks, 0)} />
        <InlineMetricCard label="Painkiller" value={records.reduce((sum, item) => sum + item.qtyPainkiller, 0)} />
      </MetricsGrid>

      <Card>
        <DataTable
          data={records}
          columns={columns}
          search={search}
          onSearchChange={setSearch}
          onBulkDelete={() => undefined}
          primaryAction={(
            <IconButton type="button" title="Input rekap" className="h-8 w-8 rounded-xl" onClick={() => setDrawerOpen(true)}>
              <Plus className="h-4 w-4" />
            </IconButton>
          )}
          filters={(
            <Select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="h-10 w-full rounded-xl px-3 py-2 text-xs md:max-w-[180px]">
              <option value="">Semua status</option>
              <option value="draft">draft</option>
              <option value="merged">merged</option>
              <option value="reviewed">reviewed</option>
            </Select>
          )}
          mobileCard={(item) => (
            <Card className="p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.16em] text-[var(--color-muted)]">{item.saleCode}</p>
                  <h3 className="mt-2 text-lg font-bold">{item.consumerName}</h3>
                  <p className="mt-1 text-sm text-[var(--color-muted)]">{item.packageName}</p>
                </div>
                <Badge tone={item.status === 'merged' ? 'success' : item.status === 'reviewed' ? 'neutral' : 'warning'}>{item.status}</Badge>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-2 text-sm">
                <div>Bandage: {item.qtyBandage}</div>
                <div>IFAKS: {item.qtyIfaks}</div>
                <div>Painkiller: {item.qtyPainkiller}</div>
              </div>
            </Card>
          )}
        />
      </Card>

      <Drawer open={drawerOpen} title="Input Rekap Farmasi" subtitle="Flow frontend untuk input paket, kuantitas, dan identitas konsumen." onClose={() => setDrawerOpen(false)}>
        <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
          <Field label="Nama konsumen" required error={form.formState.errors.consumerName?.message}>
            <Input {...form.register('consumerName')} />
          </Field>
          <Field label="Paket" required error={form.formState.errors.packageName?.message}>
            <Input {...form.register('packageName')} />
          </Field>
          <div className="grid gap-4 md:grid-cols-3">
            <Field label="Bandage"><Input type="number" min={0} {...form.register('qtyBandage', { valueAsNumber: true })} /></Field>
            <Field label="IFAKS"><Input type="number" min={0} {...form.register('qtyIfaks', { valueAsNumber: true })} /></Field>
            <Field label="Painkiller"><Input type="number" min={0} {...form.register('qtyPainkiller', { valueAsNumber: true })} /></Field>
          </div>
          <Field label="Identity / divisi" required error={form.formState.errors.identityLabel?.message}>
            <Input {...form.register('identityLabel')} />
          </Field>
          <ActionGroup>
            <Button type="button" variant="secondary" onClick={() => { clearStoredDraft(); form.reset(defaults); }}>Clear Draft</Button>
            <Button type="submit" disabled={mutation.isPending}>{mutation.isPending ? 'Menyimpan...' : 'Simpan Rekap'}</Button>
          </ActionGroup>
        </form>
      </Drawer>
    </div>
  );
}
