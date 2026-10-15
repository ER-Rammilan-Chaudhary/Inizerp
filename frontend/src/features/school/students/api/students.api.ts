import api from "@/api/client";
import type {
  CreateStudentPayload,
  StudentListParams,
  StudentResponse,
  StudentsResponse,
  UpdateStudentPayload,
} from "../types/students.types";

const buildParams = (params?: StudentListParams) => {
  const searchParams = new URLSearchParams();

  if (!params) {
    return searchParams;
  }

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.set(key, String(value));
    }
  });

  return searchParams;
};

const appendValue = (formData: FormData, key: string, value: unknown) => {
  if (value === undefined || value === null || value === "") {
    return;
  }

  formData.append(key, String(value));
};

const createStudentFormData = (payload: CreateStudentPayload): FormData => {
  const formData = new FormData();

  appendValue(formData, "fullName", payload.fullName);
  appendValue(formData, "email", payload.email);
  appendValue(formData, "phone", payload.phone);
  appendValue(formData, "password", payload.password);
  appendValue(formData, "rollNo", payload.rollNo);
  appendValue(formData, "dob", payload.dob);
  appendValue(formData, "gender", payload.gender);
  appendValue(formData, "address", payload.address);
  appendValue(formData, "parentId", payload.parentId);
  appendValue(formData, "guardianId", payload.guardianId);
  appendValue(formData, "admissionDate", payload.admissionDate);
  appendValue(formData, "bloodGroup", payload.bloodGroup);
  appendValue(formData, "academicYearId", payload.academicYearId);
  appendValue(formData, "classId", payload.classId);
  appendValue(formData, "sectionId", payload.sectionId);
  appendValue(formData, "parentFullName", payload.parentFullName);
  appendValue(formData, "parentEmail", payload.parentEmail);
  appendValue(formData, "parentPhone", payload.parentPhone);
  appendValue(formData, "parentOccupation", payload.parentOccupation);
  appendValue(formData, "parentPassword", payload.parentPassword);
  appendValue(formData, "guardianFullName", payload.guardianFullName);
  appendValue(formData, "guardianRelationship", payload.guardianRelationship);
  appendValue(formData, "guardianPhone", payload.guardianPhone);

  if (payload.avatar instanceof File) {
    formData.append("avatar", payload.avatar);
  }

  return formData;
};

const updateStudentFormData = (payload: UpdateStudentPayload): FormData => {
  const formData = new FormData();

  appendValue(formData, "fullName", payload.fullName);
  appendValue(formData, "email", payload.email);
  appendValue(formData, "phone", payload.phone);
  appendValue(formData, "password", payload.password);
  appendValue(formData, "rollNo", payload.rollNo);
  appendValue(formData, "dob", payload.dob);
  appendValue(formData, "gender", payload.gender);
  appendValue(formData, "address", payload.address);
  appendValue(formData, "parentId", payload.parentId);
  appendValue(formData, "guardianId", payload.guardianId);
  appendValue(formData, "admissionDate", payload.admissionDate);
  appendValue(formData, "bloodGroup", payload.bloodGroup);
  appendValue(formData, "academicYearId", payload.academicYearId);
  appendValue(formData, "classId", payload.classId);
  appendValue(formData, "sectionId", payload.sectionId);
  appendValue(formData, "parentFullName", payload.parentFullName);
  appendValue(formData, "parentEmail", payload.parentEmail);
  appendValue(formData, "parentPhone", payload.parentPhone);
  appendValue(formData, "parentOccupation", payload.parentOccupation);
  appendValue(formData, "guardianFullName", payload.guardianFullName);
  appendValue(formData, "guardianRelationship", payload.guardianRelationship);
  appendValue(formData, "guardianPhone", payload.guardianPhone);

  if (payload.avatar instanceof File) {
    formData.append("avatar", payload.avatar);
  }

  return formData;
};

export const studentsApi = {
  getStudents: async (
    params?: StudentListParams,
  ): Promise<StudentsResponse> => {
    const query = buildParams(params);

    const { data } = await api.get<StudentsResponse>(
      `/school/students${query.toString() ? `?${query.toString()}` : ""}`,
    );

    return data;
  },

  getStudentById: async (id: string): Promise<StudentResponse> => {
    const { data } = await api.get<StudentResponse>(`/school/students/${id}`);

    return data;
  },

  createStudent: async (
    payload: CreateStudentPayload,
  ): Promise<StudentResponse> => {
    const formData = createStudentFormData(payload);

    const { data } = await api.post<StudentResponse>(
      "/school/students",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );

    return data;
  },

  updateStudent: async (
    id: string,
    payload: UpdateStudentPayload,
  ): Promise<StudentResponse> => {
    const formData = updateStudentFormData(payload);

    console.log("UPDATE STUDENT API:", {
      id,
      avatar: payload.avatar,
      isFile: payload.avatar instanceof File,
    });

    const { data } = await api.patch<StudentResponse>(
      `/school/students/${id}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );

    return data;
  },

  deleteStudent: async (id: string): Promise<StudentResponse> => {
    const { data } = await api.delete<StudentResponse>(
      `/school/students/${id}`,
    );

    return data;
  },
};
