import { useMemo, useState } from 'react';
import { Plus } from 'lucide-react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { createColumnHelper, type ColumnDef } from '@tanstack/react-table';
import { queryClient } from '@/api/query/query-client';
import { useEmsServiceSaveMutation, useEmsServicesQuery } from '@/features/ems-services/api/ems-services-api';
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
import { formatCurrency, formatDateTime } from '@/lib/utils';
import type { EmsServiceRecord } from '@/types/ems-service';

const helper = createColumnHelper<EmsServiceRecord>();

const schema = z.object({
  patientName: z.string().min(3, 'Nama pasien wajib diisi.'),
  serviceType: z.enum(['Treatment', 'Pingsan', 'Surat', 'Operasi', 'Rawat Inap', 'Kematian']),
  serviceDetail: z.string().min(2, 'Detail layanan wajib diisi.'),
  location: z.string().min(2, 'Lokasi wajib diisi.'),
  qty: z.number().int().min(1, 'Qty minimal 1.'),
  paymentType: z.enum(['cash', 'billing']),
  dpjpName: z.string().min(3, 'DPJP wajib diisi.'),
  teamNamesText: z.string().min(3, 'Minimal satu tim medis wajib diisi.'),
  medicineUsage: z.string().min(3, 'Penggunaan obat wajib diisi.'),
});

type FormValues = z.infer<typeof schema>;

const defaults: FormValues = {
  patientName: '',
  serviceType: 'Treatment',
  serviceDetail: '',
  location: '',
  qty: 1,
  paymentType: 'cash',
  dpjpName: '',
  teamNamesText: '',
  medicineUsage: '',
};

export function EmsServicesWorkspace() {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { data } = useEmsServicesQuery(search, typeFilter);
  const mutation = useEmsServiceSaveMutation();
  const records = data?.data ?? [];

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: defaults,
  });

  const { clearStoredDraft } = useDraftForm({
    module: 'ems-services',
    form,
  });

  const columns = useMemo(
    () =>
      [
        helper.accessor('createdAt', {
          header: 'Tanggal',
          cell: (info) => formatDateTime(info.getValue()),
        }),
        helper.accessor('serviceCode', { header: 'Kode' }),
        helper.accessor('patientName', { header: 'Pasien' }),
        helper.accessor('serviceType', {
          header: 'Layanan',
          cell: (info) => <Badge tone="brand">{info.getValue()}</Badge>,
        }),
        helper.accessor('dpjpName', { header: 'DPJP' }),
        helper.accessor('paymentType', {
          header: 'Pembayaran',
          cell: (info) => <Badge tone={info.getValue() === 'billing' ? 'warning' : 'success'}>{info.getValue()}</Badge>,
        }),
        helper.accessor('total', {
          header: 'Total',
          cell: (info) => formatCurrency(info.getValue()),
        }),
      ] as Array<ColumnDef<EmsServiceRecord, unknown>>,
    [],
  );

  async function onSubmit(values: FormValues) {
    const response = await mutation.mutateAsync({
      patientName: values.patientName,
      serviceType: values.serviceType,
      serviceDetail: values.serviceDetail,
      location: values.location,
      qty: values.qty,
      paymentType: values.paymentType,
      dpjpName: values.dpjpName,
      teamNames: values.teamNamesText.split(',').map((item) => item.trim()).filter(Boolean),
      medicineUsage: values.medicineUsage,
    });

    if (!response.success) {
      showToast('error', response.message);
      return;
    }

    clearStoredDraft();
    form.reset(defaults);
    setDrawerOpen(false);
    void queryClient.invalidateQueries({ queryKey: ['ems-services'] });
    showToast('success', response.message);
  }

  return (
    <div className="space-y-6">
      <MetricsGrid>
        <InlineMetricCard label="Total transaksi" value={records.length} />
        <InlineMetricCard label="Operasi" value={records.filter((item) => item.serviceType === 'Operasi').length} />
        <InlineMetricCard label="Cash" value={records.filter((item) => item.paymentType === 'cash').length} />
        <InlineMetricCard label="Billing" value={records.filter((item) => item.paymentType === 'billing').length} />
      </MetricsGrid>

      <Card>
        <DataTable
          data={records}
          columns={columns}
          search={search}
          onSearchChange={setSearch}
          onBulkDelete={() => undefined}
          primaryAction={(
            <IconButton type="button" title="Input layanan" className="h-8 w-8 rounded-xl" onClick={() => setDrawerOpen(true)}>
              <Plus className="h-4 w-4" />
            </IconButton>
          )}
          filters={(
            <Select value={typeFilter} onChange={(event) => setTypeFilter(event.target.value)} className="h-10 w-full rounded-xl px-3 py-2 text-xs md:max-w-[180px]">
              <option value="">Semua layanan</option>
              <option value="Treatment">Treatment</option>
              <option value="Pingsan">Pingsan</option>
              <option value="Surat">Surat</option>
              <option value="Operasi">Operasi</option>
              <option value="Rawat Inap">Rawat Inap</option>
              <option value="Kematian">Kematian</option>
            </Select>
          )}
          mobileCard={(item) => (
            <Card className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.16em] text-[var(--color-muted)]">{item.serviceCode}</p>
                  <h3 className="mt-2 text-lg font-bold">{item.patientName}</h3>
                  <p className="mt-1 text-sm text-[var(--color-muted)]">{item.dpjpName} - {item.location}</p>
                </div>
                <Badge tone="brand">{item.serviceType}</Badge>
              </div>
              <p className="mt-4 text-sm text-[var(--color-muted)]">{item.medicineUsage}</p>
              <p className="mt-4 text-sm font-semibold">{formatCurrency(item.total)}</p>
            </Card>
          )}
        />
      </Card>

      <Drawer open={drawerOpen} title="Input EMS Service" subtitle="Form ringkas mengikuti istilah legacy untuk type, detail, DPJP, tim, dan obat." onClose={() => setDrawerOpen(false)}>
        <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
          <Field label="Nama pasien" required error={form.formState.errors.patientName?.message}>
            <Input {...form.register('patientName')} />
          </Field>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Jenis layanan" required error={form.formState.errors.serviceType?.message}>
              <Select {...form.register('serviceType')}>
                <option value="Treatment">Treatment</option>
                <option value="Pingsan">Pingsan</option>
                <option value="Surat">Surat</option>
                <option value="Operasi">Operasi</option>
                <option value="Rawat Inap">Rawat Inap</option>
                <option value="Kematian">Kematian</option>
              </Select>
            </Field>
            <Field label="Detail layanan" required error={form.formState.errors.serviceDetail?.message}>
              <Input {...form.register('serviceDetail')} />
            </Field>
            <Field label="Lokasi" required error={form.formState.errors.location?.message}>
              <Input {...form.register('location')} />
            </Field>
            <Field label="Qty" required error={form.formState.errors.qty?.message}>
              <Input type="number" min={1} {...form.register('qty', { valueAsNumber: true })} />
            </Field>
            <Field label="Pembayaran" required error={form.formState.errors.paymentType?.message}>
              <Select {...form.register('paymentType')}>
                <option value="cash">cash</option>
                <option value="billing">billing</option>
              </Select>
            </Field>
            <Field label="DPJP" required error={form.formState.errors.dpjpName?.message}>
              <Input {...form.register('dpjpName')} />
            </Field>
          </div>
          <Field label="Tim medis" hint="Pisahkan dengan koma." required error={form.formState.errors.teamNamesText?.message}>
            <Input {...form.register('teamNamesText')} />
          </Field>
          <Field label="Penggunaan obat / tindakan" required error={form.formState.errors.medicineUsage?.message}>
            <Input {...form.register('medicineUsage')} />
          </Field>
          <ActionGroup>
            <Button type="button" variant="secondary" onClick={() => { clearStoredDraft(); form.reset(defaults); }}>Clear Draft</Button>
            <Button type="submit" disabled={mutation.isPending}>{mutation.isPending ? 'Menyimpan...' : 'Simpan EMS Service'}</Button>
          </ActionGroup>
        </form>
      </Drawer>
    </div>
  );
}
