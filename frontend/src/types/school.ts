export interface School {
  id: string;

  name: string;
  slug: string;

  email: string | null;
  phone: string | null;
  address: string | null;

  logo: string | null;
  principal: string | null;

  primaryColor: string | null;
  secondaryColor: string | null;

  slogan: string | null;
  missionStatement: string | null;
  visionStatement: string | null;

  startHour: string | null;
  closeHour: string | null;

  createdAt: string;
  updatedAt: string;
}

export interface CreateSchoolDto {
  name: string;

  email?: string;
  phone?: string;
  address?: string;

  logo?: string;

  principal?: string;

  primaryColor?: string;
  secondaryColor?: string;

  slogan?: string;
  missionStatement?: string;
  visionStatement?: string;

  startHour?: string;
  closeHour?: string;
}

export interface UpdateSchoolDto extends Partial<CreateSchoolDto> {}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface SchoolListResponse {
  schools: School[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface SchoolDetailsResponse extends School {}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}
