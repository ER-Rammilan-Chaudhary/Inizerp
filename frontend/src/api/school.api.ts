import {
  CreateSchoolDto,
  School,
  SchoolDetailsResponse,
  SchoolListResponse,
  UpdateSchoolDto,
} from "@/types/school";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

export async function getSchools(
  page = 1,
  limit = 10,
  search = "",
): Promise<SchoolListResponse> {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  if (search.trim()) {
    params.append("search", search);
  }

  const response = await fetch(`${BASE_URL}/schools?${params.toString()}`, {
    method: "GET",
    credentials: "include",
    cache: "no-store",
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to fetch schools.");
  }

  return result.data;
}

export async function getSchoolById(
  schoolId: string,
): Promise<SchoolDetailsResponse> {
  const response = await fetch(`${BASE_URL}/schools/${schoolId}`, {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to fetch school.");
  }

  return result.data;
}

export async function createSchool(payload: CreateSchoolDto): Promise<School> {
  const response = await fetch(`${BASE_URL}/schools`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to create school.");
  }

  return result.data;
}

export async function updateSchool(
  schoolId: string,
  payload: UpdateSchoolDto,
): Promise<School> {
  const response = await fetch(`${BASE_URL}/schools/${schoolId}`, {
    method: "PUT",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to update school.");
  }

  return result.data;
}

export async function deleteSchool(schoolId: string): Promise<void> {
  const response = await fetch(`${BASE_URL}/schools/${schoolId}`, {
    method: "DELETE",
    credentials: "include",
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to delete school.");
  }
}
