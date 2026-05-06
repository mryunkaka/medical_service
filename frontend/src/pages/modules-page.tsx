import { EmsServicesWorkspace } from '@/features/ems-services/components/ems-services-workspace';
import { PharmacyRecapWorkspace } from '@/features/pharmacy-recap/components/pharmacy-recap-workspace';
import { SecretaryWorkspace } from '@/features/secretary/components/secretary-workspace';

export function EmsServicesPage() {
  return <EmsServicesWorkspace />;
}

export function PharmacyRecapPage() {
  return <PharmacyRecapWorkspace />;
}

export function SecretaryPage() {
  return <SecretaryWorkspace />;
}
