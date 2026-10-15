export type SchoolStatus = "ACTIVE" | "TRIAL" | "SUSPENDED";

export interface SchoolOwner {
  id: string;

  fullName: string;

  email: string;

  phone: string | null;

  role: string;

  schoolId: string;
}

export interface School {
  id: string;
  code: string;
  name: string;
  slug: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  logo: string | null;
  status: SchoolStatus;
  ownerId: string | null;
  owner?: SchoolOwner | null;
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

  _count: {
    students: number;
    teachers: number;
    users: number;
  };
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

  // only create time
  ownerName: string;
  ownerEmail: string;
  ownerPassword: string;
  ownerPhone?: string;
}

export interface UpdateSchoolDto {
  name?: string;

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

export interface CreateSchoolResponse {
  success: boolean;
  message: string;
  data: {
    school: School;
    owner: SchoolOwner;
  };
}

export interface SchoolListResponse {
  schools: School[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
}

export type SchoolDetailsResponse = School;

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface ResetPasswordResponse {
  success: boolean;

  message: string;

  data: {
    id: string;
    fullName: string;
    email: string;
    role: string;
    schoolId: string;
  };
}
