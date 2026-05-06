import { useState } from 'react';
import { KeyRound, Save, ShieldCheck } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { MedicalRecordForm } from '@/features/medical-records/components/medical-record-form';
import { MedicalRecordList } from '@/features/medical-records/components/medical-record-list';
import { Breadcrumb } from '@/shared/navigation/breadcrumb';
import { Field } from '@/shared/forms/field';
import { Input, Select } from '@/shared/forms/controls';
import { Checkbox } from '@/shared/forms/checkbox';
import { Radio } from '@/shared/forms/radio';
import { Switch } from '@/shared/forms/switch';
import { DateInput } from '@/shared/forms/date-input';
import { Alert } from '@/shared/ui/alert';
import { Avatar } from '@/shared/ui/avatar';
import { Badge } from '@/shared/ui/badge';
import { Card } from '@/shared/ui/card';
import { Divider } from '@/shared/ui/divider';
import { Drawer } from '@/shared/ui/drawer';
import { MetricsGrid, PageAction } from '@/shared/ui/actions';

export function MedicalRecordsListPage() {
  return <MedicalRecordList />;
}

export function MedicalRecordCreatePage() {
  return <MedicalRecordForm />;
}

export function MedicalRecordEditPage() {
  const params = useParams();
  return <MedicalRecordForm recordId={Number(params.recordId)} />;
}

export function AccountPage() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <PageAction variant="secondary" onClick={() => setDrawerOpen(true)}>
          <ShieldCheck className="h-4 w-4" />
          Review Hak Akses
        </PageAction>
      </div>

      <Alert
        title="Status frontend account settings masih memakai adapter lokal"
        description="Struktur UI ini sengaja dibangun lebih dulu agar pola form, preference, dan access control dapat diuji sebelum endpoint Laravel adapter tersedia."
        tone="warning"
      />

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <Card className="space-y-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <Avatar initials="MM" size="lg" />
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-[var(--color-accent)]">Profile</p>
                <h2 className="mt-1 text-2xl font-black text-[var(--color-text)]">Michael Moore</h2>
                <p className="mt-1 text-sm text-[var(--color-muted)]">Kepala Unit Roxwood · Admin operasional frontend mock</p>
              </div>
            </div>
            <Badge tone="success">Aktif</Badge>
          </div>

          <Divider />

          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Nama lengkap" required>
              <Input value="Michael Moore" readOnly />
            </Field>
            <Field label="Email kerja">
              <Input value="michael.moore@medicalservice.local" readOnly />
            </Field>
            <Field label="Unit operasional">
              <Select value="roxwood" disabled>
                <option value="roxwood">Roxwood</option>
              </Select>
            </Field>
            <Field label="Berlaku sejak">
              <DateInput value="2026-05-04" readOnly />
            </Field>
          </div>
        </Card>

        <Card className="space-y-5">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[var(--color-accent)]">Preferences</p>
            <h2 className="mt-1 text-xl font-black text-[var(--color-text)]">Setting operasional</h2>
          </div>

          <Field label="Notifikasi utama">
            <div className="space-y-3 rounded-[24px] border border-[var(--color-border)] bg-[var(--color-surface-subtle)] p-4">
              <label className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-[var(--color-text)]">Realtime notifikasi rekam medis</p>
                  <p className="text-xs text-[var(--color-muted)]">Prioritas SSE, fallback polling sesuai PRD.</p>
                </div>
                <Switch defaultChecked />
              </label>
              <label className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-[var(--color-text)]">Toast submit sukses</p>
                  <p className="text-xs text-[var(--color-muted)]">Pertahankan feedback kanan atas untuk aksi utama.</p>
                </div>
                <Switch defaultChecked />
              </label>
            </div>
          </Field>

          <Field label="Mode review draft">
            <div className="space-y-3 rounded-[24px] border border-[var(--color-border)] bg-[var(--color-surface-subtle)] p-4">
              <label className="flex items-start gap-3">
                <Radio name="draft-mode" defaultChecked />
                <div>
                  <p className="text-sm font-semibold text-[var(--color-text)]">Pulihkan draft otomatis</p>
                  <p className="text-xs text-[var(--color-muted)]">Cocok untuk form panjang dan risiko koneksi putus.</p>
                </div>
              </label>
              <label className="flex items-start gap-3">
                <Radio name="draft-mode" />
                <div>
                  <p className="text-sm font-semibold text-[var(--color-text)]">Minta konfirmasi saat restore</p>
                  <p className="text-xs text-[var(--color-muted)]">Lebih aman untuk komputer bersama.</p>
                </div>
              </label>
            </div>
          </Field>

          <label className="flex items-start gap-3 rounded-[24px] border border-[var(--color-border)] bg-[var(--color-surface-subtle)] p-4">
            <Checkbox defaultChecked />
            <div>
              <p className="text-sm font-semibold text-[var(--color-text)]">Izinkan akses menu setting akun</p>
              <p className="text-xs text-[var(--color-muted)]">Representasi UI awal untuk access control per modul.</p>
            </div>
          </label>

          <PageAction fullWidth onClick={() => undefined}>
            <Save className="h-4 w-4" />
            Simpan preferensi mock
          </PageAction>
        </Card>
      </div>

      <Card className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[var(--color-accent)]">Access Control UI</p>
            <h2 className="mt-1 text-xl font-black text-[var(--color-text)]">Matrix hak akses dasar</h2>
          </div>
          <Badge tone="warning">Mock Role</Badge>
        </div>
        <MetricsGrid>
          {[
            ['Dashboard', 'Read only untuk ringkasan harian'],
            ['Rekam Medis', 'Create, edit, dan upload dokumen'],
            ['Setting Akun', 'Update preferensi pribadi'],
            ['Realtime Event', 'Terima invalidation dan toast'],
          ].map(([title, description]) => (
            <div key={title} className="rounded-[24px] border border-[var(--color-border)] bg-[var(--color-surface-subtle)] p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-bold text-[var(--color-text)]">{title}</p>
                <Badge tone="success">Allow</Badge>
              </div>
              <p className="mt-2 text-xs text-[var(--color-muted)]">{description}</p>
            </div>
          ))}
        </MetricsGrid>
      </Card>

      <Drawer
        open={drawerOpen}
        title="Review Hak Akses"
        subtitle="Drawer ini disiapkan sebagai pola reusable untuk panel samping admin."
        onClose={() => setDrawerOpen(false)}
      >
        <div className="space-y-5">
          <Breadcrumb
            items={[
              { label: 'Dashboard', href: '/' },
              { label: 'Setting Akun', href: '/account' },
              { label: 'Hak Akses' },
            ]}
          />
          <Alert
            title="Role aktif: Admin Operasional"
            description="Mode mock ini meniru kebutuhan admin panel tanpa mengunci format policy backend lebih awal."
            tone="info"
          />
          {[
            ['Lihat dashboard', 'Ringkasan kartu dan quick action'],
            ['Kelola rekam medis', 'List, form, draft, upload, toast'],
            ['Terima event realtime', 'SSE atau fallback polling'],
          ].map(([title, description]) => (
            <div key={title} className="rounded-[24px] border border-[var(--color-border)] p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-[var(--color-text)]">{title}</p>
                  <p className="mt-1 text-sm text-[var(--color-muted)]">{description}</p>
                </div>
                <Badge tone="success">Granted</Badge>
              </div>
            </div>
          ))}
          <PageAction variant="secondary" fullWidth onClick={() => setDrawerOpen(false)}>
            <KeyRound className="h-4 w-4" />
            Tutup review access control
          </PageAction>
        </div>
      </Drawer>
    </div>
  );
}
