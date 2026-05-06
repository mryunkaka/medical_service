import { useEffect } from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { HeartPulse } from 'lucide-react';
import { useLoginMutation } from '@/features/auth/api/auth-api';
import { UNIT_OPTIONS } from '@/constants/units';
import { Field } from '@/shared/forms/field';
import { Input, Select } from '@/shared/forms/controls';
import { Button } from '@/shared/ui/button';
import { Card } from '@/shared/ui/card';
import { showToast } from '@/shared/feedback/toast';
import { env } from '@/lib/env';
import { useSessionStore } from '@/state/session-store';

const schema = z.object({
  fullName: z.string().min(3, 'Nama lengkap wajib diisi.'),
  pin: z.string().regex(/^\d{4}$/, 'PIN harus 4 digit angka.'),
  loginUnit: z.string().min(1, 'Unit wajib dipilih.'),
});

type LoginSchema = z.infer<typeof schema>;

export function LoginScreen() {
  const navigate = useNavigate();
  const mutation = useLoginMutation();
  const setSession = useSessionStore((state) => state.setSession);
  const form = useForm<LoginSchema>({
    resolver: zodResolver(schema),
    defaultValues: {
      fullName: 'Michael Moore',
      pin: '1234',
      loginUnit: 'roxwood',
    },
  });

  useEffect(() => {
    document.title = 'Login | Medical Service';
  }, []);

  async function onSubmit(values: LoginSchema) {
    const response = await mutation.mutateAsync(values);
    if (!response.success || !response.data) {
      showToast('error', response.message);
      return;
    }

    setSession(response.data);
    showToast('success', response.message);
    navigate('/');
  }

  const errors = form.formState.errors;

  return (
    <div className="grid min-h-screen place-items-center bg-[radial-gradient(circle_at_top,#ffffff,transparent_40%),linear-gradient(135deg,#111827,#1f2937_38%,#faf7f2)] px-4 py-10">
      <Card className="w-full max-w-[460px] p-7">
        <div className="mb-6 flex items-center gap-4">
          <div className="grid h-14 w-14 place-items-center rounded-[22px] bg-[var(--color-accent-soft)] text-[var(--color-accent)]">
            <HeartPulse className="h-7 w-7" />
          </div>
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.24em] text-[var(--color-accent)]">EMS Frontend</p>
            <h1 className="mt-1 text-2xl font-black text-[var(--color-text)]">Masuk ke {env.appName}</h1>
          </div>
        </div>

        <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
          <Field label="Nama lengkap" required error={errors.fullName?.message}>
            <Input {...form.register('fullName')} />
          </Field>
          <Field label="PIN demo" hint="Gunakan 1234 untuk mode demo." required error={errors.pin?.message}>
            <Input maxLength={4} inputMode="numeric" {...form.register('pin')} />
          </Field>
          <Field label="Unit" required error={errors.loginUnit?.message}>
            <Select {...form.register('loginUnit')}>
              {UNIT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          </Field>
          <Button type="submit" className="w-full" disabled={mutation.isPending}>
            {mutation.isPending ? 'Memproses...' : 'Masuk'}
          </Button>
        </form>
      </Card>
    </div>
  );
}
