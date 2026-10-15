export interface CreatePlanDto {
  name: string;
  code: string;
  description?: string;
  price: number;
  currency?: string;
  durationInDays: number;
  maxStudents: number;
  maxTeachers: number;
  maxAdmins: number;
}

export type UpdatePlanDto = Partial<CreatePlanDto>;

export interface AssignPlanModuleDto {
  moduleId: string;
}

export interface BulkAssignPlanModulesDto {
  moduleIds: string[];
}
