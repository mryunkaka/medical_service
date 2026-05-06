export interface SessionUser {
  id: number;
  fullName: string;
  role: string;
  position: string;
  division: string;
  unitCode: string;
  canViewAllUnits: boolean;
  cutiStatus?: string | null;
  cutiStartDate?: string | null;
  cutiEndDate?: string | null;
}

export interface LoginPayload {
  fullName: string;
  pin: string;
  loginUnit: string;
  forceLogin?: boolean;
}
