/* eslint-disable react-refresh/only-export-components */
import { Suspense, lazy, type ReactNode } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { AuthLayout } from '@/layouts/auth-layout';
import { AppShellLayout } from '@/layouts/app-shell-layout';
import { ProtectedRoute } from '@/routes/route-guard';
import { Card } from '@/shared/ui/card';
import { Spinner } from '@/shared/ui/spinner';

const LoginPage = lazy(async () => {
  const module = await import('@/pages/login-page');
  return { default: module.LoginPage };
});

const DashboardPage = lazy(async () => {
  const module = await import('@/pages/dashboard-page');
  return { default: module.DashboardPage };
});

const MedicalRecordsListPage = lazy(async () => {
  const module = await import('@/pages/medical-records-page');
  return { default: module.MedicalRecordsListPage };
});

const MedicalRecordCreatePage = lazy(async () => {
  const module = await import('@/pages/medical-records-page');
  return { default: module.MedicalRecordCreatePage };
});

const MedicalRecordEditPage = lazy(async () => {
  const module = await import('@/pages/medical-records-page');
  return { default: module.MedicalRecordEditPage };
});

const AccountPage = lazy(async () => {
  const module = await import('@/pages/medical-records-page');
  return { default: module.AccountPage };
});

const EmsServicesPage = lazy(async () => {
  const module = await import('@/pages/modules-page');
  return { default: module.EmsServicesPage };
});

const PharmacyRecapPage = lazy(async () => {
  const module = await import('@/pages/modules-page');
  return { default: module.PharmacyRecapPage };
});

const SecretaryPage = lazy(async () => {
  const module = await import('@/pages/modules-page');
  return { default: module.SecretaryPage };
});

function withSuspense(node: ReactNode) {
  return (
    <Suspense
      fallback={(
        <div className="grid min-h-[40vh] place-items-center p-6">
          <Card className="flex items-center gap-3 px-6 py-5">
            <Spinner className="h-5 w-5" />
            <span className="text-sm font-semibold text-[var(--color-text)]">Memuat halaman...</span>
          </Card>
        </div>
      )}
    >
      {node}
    </Suspense>
  );
}

export const router = createBrowserRouter([
  {
    element: <AuthLayout />,
    children: [
      {
        path: '/login',
        element: withSuspense(<LoginPage />),
      },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppShellLayout />,
        children: [
          {
            path: '/',
            element: withSuspense(<DashboardPage />),
          },
          {
            path: '/medical-records',
            element: withSuspense(<MedicalRecordsListPage />),
          },
          {
            path: '/medical-records/new',
            element: withSuspense(<MedicalRecordCreatePage />),
          },
          {
            path: '/medical-records/:recordId/edit',
            element: withSuspense(<MedicalRecordEditPage />),
          },
          {
            path: '/account',
            element: withSuspense(<AccountPage />),
          },
          {
            path: '/ems-services',
            element: withSuspense(<EmsServicesPage />),
          },
          {
            path: '/pharmacy-recap',
            element: withSuspense(<PharmacyRecapPage />),
          },
          {
            path: '/secretary',
            element: withSuspense(<SecretaryPage />),
          },
        ],
      },
    ],
  },
]);
