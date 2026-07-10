"use client";

import { useCallback, useState } from "react";
import {
  createSchool,
  deleteSchool,
  getSchoolById,
  getSchools,
  updateSchool,
} from "@/api/school.api";
import {
  CreateSchoolDto,
  School,
  SchoolDetailsResponse,
  SchoolListResponse,
  UpdateSchoolDto,
} from "@/types/school";

export function useSchools() {
  const [loading, setLoading] = useState(false);

  const fetchSchools = useCallback(
    async (page = 1, limit = 10, search = ""): Promise<SchoolListResponse> => {
      setLoading(true);

      try {
        return await getSchools(page, limit, search);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const fetchSchool = useCallback(
    async (id: string): Promise<SchoolDetailsResponse> => {
      setLoading(true);

      try {
        return await getSchoolById(id);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const addSchool = useCallback(
    async (payload: CreateSchoolDto): Promise<School> => {
      setLoading(true);

      try {
        return await createSchool(payload);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const editSchool = useCallback(
    async (id: string, payload: UpdateSchoolDto): Promise<School> => {
      setLoading(true);

      try {
        return await updateSchool(id, payload);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const removeSchool = useCallback(async (id: string): Promise<void> => {
    setLoading(true);

    try {
      await deleteSchool(id);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,

    fetchSchools,
    fetchSchool,

    addSchool,
    editSchool,
    removeSchool,
  };
}
