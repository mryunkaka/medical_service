import { describe, expect, it } from 'vitest';
import { mockApi } from '@/api/client/mock-api';

describe('mockApi', () => {
  it('rejects invalid demo pin', async () => {
    const response = await mockApi.login({
      fullName: 'Michael Moore',
      pin: '9999',
      loginUnit: 'roxwood',
    });

    expect(response.success).toBe(false);
  });

  it('returns seeded medical records', async () => {
    const response = await mockApi.getMedicalRecords();
    expect(response.success).toBe(true);
    expect(response.data.length).toBeGreaterThan(0);
  });
});
