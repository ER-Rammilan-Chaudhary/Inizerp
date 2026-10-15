import api from "@/api/client";

import {
  UsersQuery,
  UsersResponse,
  UpdateUserFormInput,
  ResetPasswordInput,
  User,
} from "../types/user.types";

// ======================================================
// GET USERS
// ======================================================
export const getUsers = async (
  params: UsersQuery = {},
): Promise<UsersResponse> => {
  const response = await api.get("/super-admin/users", {
    params,
  });

  return response.data;
};

// ======================================================
// GET USER BY ID
// ======================================================

export const getUserById = async (
  id: string,
): Promise<{
  success: boolean;
  data: User;
}> => {
  const response = await api.get(`/super-admin/users/${id}`);

  return response.data;
};

// ======================================================
// CREATE USER
// ======================================================

export const createUser = async (data: {
  fullName: string;
  email: string;
  password: string;
  schoolId: string;
  avatar?: File | null;
}) => {
  const formData = new FormData();

  formData.append("fullName", data.fullName);
  formData.append("email", data.email);
  formData.append("password", data.password);
  formData.append("schoolId", data.schoolId);

  if (data.avatar instanceof File) {
    formData.append("avatar", data.avatar);
  }

  const response = await api.post("/super-admin/users", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

// ======================================================
// UPDATE USER
// ======================================================

export const updateUser = async (id: string, data: UpdateUserFormInput) => {
  const formData = new FormData();

  if (data.fullName !== undefined) {
    formData.append("fullName", data.fullName);
  }

  if (data.email !== undefined) {
    formData.append("email", data.email);
  }

  if (data.phone !== undefined) {
    formData.append("phone", data.phone);
  }

  if (data.status !== undefined) {
    formData.append("status", data.status);
  }

  if (data.schoolId !== undefined) {
    formData.append("schoolId", data.schoolId);
  }

  // Avatar
  if (data.avatar instanceof File) {
    formData.append("avatar", data.avatar);
  }

  const response = await api.patch(`/super-admin/users/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

// ======================================================
// DELETE USER
// ======================================================

export const deleteUser = async (id: string) => {
  const response = await api.delete(`/super-admin/users/${id}`);

  return response.data;
};

// ======================================================
// RESET PASSWORD
// ======================================================

export const resetUserPassword = async (
  id: string,
  data: ResetPasswordInput,
) => {
  const response = await api.patch(`/super-admin/users/${id}/reset-password`, data);

  return response.data;
};
