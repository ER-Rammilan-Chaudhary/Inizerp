import { School } from "@prisma/client";

export interface CreateSchoolDto {
  code: string;
  name: string;
  slug?: string;

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

export interface UpdateSchoolDto extends Partial<CreateSchoolDto> {
  isActive?: boolean;
}

export interface SchoolStatistics {
  students: number;
  teachers: number;
  parents: number;
  classes: number;
  subjects: number;
}

export interface SchoolDetailsResponse {
  school: School;
  stats: SchoolStatistics;
}
