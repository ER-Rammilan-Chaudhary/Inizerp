export interface AcademicYear {
  id: string;
  name: string;
  code: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AcademicYearResponse {
  success: boolean;
  message: string;
  data: AcademicYear;
}


export interface AcademicYearsResponse {
  success: boolean;
  message: string;
  data: AcademicYear[];
}

export interface CreateAcademicYearPayload {
  name: string;
  code: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

export interface UpdateAcademicYearPayload {
  name?: string;
  code?: string;
  startDate?: string;
  endDate?: string;
  isActive?: boolean;
}
