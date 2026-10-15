export interface Guardian {
  id: string;
  fullName: string;
  relationship?: string | null;
  phone?: string | null;
  email?: string | null;
  occupation?: string | null;
  address?: string | null;
}

export interface CreateGuardianPayload {
  fullName: string;
  relationship?: string | null;
  phone?: string | null;
  email?: string | null;
  occupation?: string | null;
  address?: string | null;
}

export interface GuardiansResponse {
  success: boolean;
  message: string;
  data: Guardian[];
}

export interface GuardianResponse {
  success: boolean;
  message: string;
  data: Guardian;
}
