import { useMemo, useState } from 'react';
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
import { useSessionStore } from '@/state/session-store';

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
  const user = useSessionStore((state) => state.user);
  const initials = useMemo(() => {
    const parts = (user?.fullName ?? 'MS').split(' ').filter(Boolean);
    return parts.slice(0, 2).map((part) => part[0]?.toUpperCase() ?? '').join('');
  }, [user?.fullName]);

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <PageAction variant="secondary" onClick={() => setDrawerOpen(true)}>
          <ShieldCheck className="h-4 w-4" />
          Review Hak Akses
        </PageAction>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <Card className="space-y-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <Avatar initials={initials} size="lg" />
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-[var(--color-accent)]">Profile</p>
                <h2 className="mt-1 text-2xl font-black text-[var(--color-text)]">{user?.fullName ?? 'Medical Service User'}</h2>
                <p className="mt-1 text-sm text-[var(--color-muted)]">
                  {user?.position ?? 'Staff'} · {user?.division ?? 'Medical Service'} · {user?.role ?? 'User'}
                </p>
              </div>
            </div>
            <Badge tone="success">Aktif</Badge>
          </div>

          <Divider />

          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Nama lengkap" required>
              <Input value={user?.fullName ?? ''} readOnly />
            </Field>
            <Field label="Email kerja">
              <Input value={buildWorkEmail(user?.fullName)} readOnly />
            </Field>
            <Field label="Unit operasional">
              <Select value={user?.unitCode ?? 'medical-service'} disabled>
                <option value={user?.unitCode ?? 'medical-service'}>{user?.unitCode ?? 'medical-service'}</option>
              </Select>
            </Field>
            <Field label="Divisi">
              <Input value={user?.division ?? ''} readOnly />
            </Field>
            <Field label="Jabatan">
              <Input value={user?.position ?? ''} readOnly />
            </Field>
            <Field label="Role">
              <Input value={user?.role ?? ''} readOnly />
            </Field>
            <Field label="Berlaku sejak">
              <DateInput value={new Date().toISOString().slice(0, 10)} readOnly />
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
                  <p className="text-xs text-[var(--color-muted)]">Kirim pembaruan data dan invalidation event secara ringan.</p>
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
              <p className="text-xs text-[var(--color-muted)]">Akses untuk meninjau profil, preferensi, dan hak akses personal.</p>
            </div>
          </label>

          <PageAction fullWidth onClick={() => undefined}>
            <Save className="h-4 w-4" />
            Simpan preferensi
          </PageAction>
        </Card>
      </div>

      <Card className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[var(--color-accent)]">Access Control UI</p>
            <h2 className="mt-1 text-xl font-black text-[var(--color-text)]">Matrix hak akses dasar</h2>
          </div>
          <Badge tone="warning">{user?.role ?? 'Role'}</Badge>
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
        subtitle="Panel samping untuk meninjau scope akses dari session aktif."
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
            title={`Role aktif: ${user?.role ?? 'User'}`}
            description="Panel ini menampilkan pola review hak akses untuk modul yang aktif pada session berjalan."
            tone="info"
          />
          {[
            ['Lihat dashboard', 'Ringkasan kartu dan quick action'],
            ['Kelola rekam medis', 'List, form, draft, upload, toast'],
            ['Terima event realtime', 'Event invalidation dan pembaruan status'],
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

function buildWorkEmail(fullName?: string) {
  if (!fullName) {
    return '';
  }

  return `${fullName.toLowerCase().trim().replace(/\s+/g, '.')}@medicalservice.local`;
}
