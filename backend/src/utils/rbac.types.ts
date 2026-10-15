export interface CreateRoleInput {
  schoolId?: string;
  name: string;
  key: string;
  description?: string;
  isSystem?: boolean;
}

export interface UpdateRoleInput {
  name?: string;
  key?: string;
  description?: string;
  permissionIds?: string[];
}

export interface AssignPermissionsInput {
  permissionIds: string[];
}
