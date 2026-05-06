import { useMemo, useState } from 'react';
import { Eye, Pencil, Plus } from 'lucide-react';
import { createColumnHelper, type ColumnDef } from '@tanstack/react-table';
import { queryClient } from '@/api/query/query-client';
import { useMedicalRecordsQuery } from '@/features/medical-records/api/medical-record-api';
import { MedicalRecordForm } from '@/features/medical-records/components/medical-record-form';
import { DataTable } from '@/shared/tables/data-table';
import { Badge } from '@/shared/ui/badge';
import { RowActionIcon, RowActions } from '@/shared/ui/actions';
import { Card } from '@/shared/ui/card';
import { IconButton } from '@/shared/ui/icon-button';
import { Modal } from '@/shared/ui/modal';
import { EmptyState } from '@/shared/ui/empty-state';
import { formatDateTime } from '@/lib/utils';
import type { MedicalRecord } from '@/types/medical-record';

const helper = createColumnHelper<MedicalRecord>();

export function MedicalRecordList() {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<MedicalRecord | null>(null);
  const [editingRecordId, setEditingRecordId] = useState<number | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const { data } = useMedicalRecordsQuery(search);
  const records = data?.data ?? [];

  const columns = useMemo(
    () =>
      [
        helper.accessor('createdAt', {
          header: 'Tanggal',
          cell: (info) => formatDateTime(info.getValue()),
        }),
        helper.accessor('recordCode', {
          header: 'No. Rekam Medis',
          cell: (info) => <span className="font-semibold text-[var(--color-primary)]">{info.getValue()}</span>,
        }),
        helper.accessor('patientName', {
          header: 'Pasien',
        }),
        helper.accessor('doctorName', {
          header: 'DPJP',
        }),
        helper.accessor('assistantNames', {
          header: 'Asisten',
          cell: (info) => info.getValue().join(', '),
        }),
        helper.accessor('operasiType', {
          header: 'Operasi',
          cell: (info) => <Badge tone={info.getValue() === 'major' ? 'danger' : 'warning'}>{info.getValue() === 'major' ? 'Mayor' : 'Minor'}</Badge>,
        }),
        helper.accessor('visibilityScope', {
          header: 'Scope',
          cell: (info) => <Badge tone={info.getValue() === 'forensic_private' ? 'brand' : 'neutral'}>{info.getValue()}</Badge>,
        }),
        helper.display({
          id: 'actions',
          header: 'Aksi',
          cell: ({ row }) => (
            <RowActions>
              <RowActionIcon title="Detail" onClick={() => setSelected(row.original)}>
                <Eye className="h-4 w-4" />
              </RowActionIcon>
              <RowActionIcon title="Edit" onClick={() => setEditingRecordId(row.original.id)}>
                <Pencil className="h-4 w-4" />
              </RowActionIcon>
            </RowActions>
          ),
        }),
      ] as Array<ColumnDef<MedicalRecord, unknown>>,
    [],
  );

  return (
    <div className="space-y-6">
      <Card>
        {records.length === 0 ? (
          <EmptyState
            title="Belum ada rekam medis"
            description="Mulai dengan membuat satu rekam medis baru. Data yang disimpan di mode demo akan tetap tersimpan di browser."
            action={(
              <IconButton type="button" className="h-10 w-10 rounded-2xl" title="Tambah rekam medis" onClick={() => setCreateOpen(true)}>
                <Plus className="h-4 w-4" />
              </IconButton>
            )}
          />
        ) : (
          <DataTable
            data={records}
            columns={columns}
            search={search}
            onSearchChange={setSearch}
            onBulkDelete={() => undefined}
            primaryAction={(
              <IconButton type="button" title="Tambah rekam medis" className="h-6 w-6 rounded-md" onClick={() => setCreateOpen(true)}>
                <Plus className="h-3 w-3" />
              </IconButton>
            )}
          />
        )}
      </Card>

      <Modal
        open={Boolean(selected)}
        title={selected?.recordCode ?? 'Detail Rekam Medis'}
        subtitle="Review keseluruhan data pasien, scope visibilitas, dan lampiran utama."
        onClose={() => setSelected(null)}
      >
        {selected ? (
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="bg-[var(--color-bg)]">
              <p className="text-xs uppercase tracking-[0.16em] text-[var(--color-muted)]">Identitas</p>
              <p className="mt-3 text-lg font-bold">{selected.patientName}</p>
              <p className="mt-1 text-sm text-[var(--color-muted)]">{selected.patientCitizenId}</p>
              <p className="mt-4 text-sm">{selected.patientAddress}</p>
            </Card>
            <Card className="bg-[var(--color-bg)]">
              <p className="text-xs uppercase tracking-[0.16em] text-[var(--color-muted)]">Tim Medis</p>
              <p className="mt-3 text-sm font-semibold">{selected.doctorName}</p>
              <p className="mt-1 text-sm text-[var(--color-muted)]">{selected.assistantNames.join(', ')}</p>
              <div className="mt-4 flex gap-2">
                <Badge tone={selected.operasiType === 'major' ? 'danger' : 'warning'}>{selected.operasiType}</Badge>
                <Badge tone={selected.visibilityScope === 'forensic_private' ? 'brand' : 'neutral'}>{selected.visibilityScope}</Badge>
              </div>
            </Card>
            <Card className="md:col-span-2">
              <p className="text-xs uppercase tracking-[0.16em] text-[var(--color-muted)]">Hasil Rekam Medis</p>
              <div className="prose prose-sm mt-4 max-w-none" dangerouslySetInnerHTML={{ __html: selected.medicalResultHtml }} />
            </Card>
          </div>
        ) : null}
      </Modal>

      <Modal
        open={createOpen}
        title="Tambah Rekam Medis"
        onClose={() => setCreateOpen(false)}
      >
        <MedicalRecordForm
          onSuccess={() => {
            setCreateOpen(false);
            void queryClient.invalidateQueries({ queryKey: ['medical-records'] });
          }}
        />
      </Modal>

      <Modal
        open={Boolean(editingRecordId)}
        title="Edit Rekam Medis"
        subtitle="Perubahan data dilakukan di modal agar flow tabel tetap ringkas."
        onClose={() => setEditingRecordId(null)}
      >
        {editingRecordId ? (
          <MedicalRecordForm
            recordId={editingRecordId}
            onSuccess={() => {
              setEditingRecordId(null);
              void queryClient.invalidateQueries({ queryKey: ['medical-records'] });
            }}
          />
        ) : null}
      </Modal>
    </div>
  );
}
