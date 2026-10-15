import api from "@/api/client";

import type {
  AddPeriodPayload,
  CreateTimetablePayload,
  PeriodMasterItem,
  SavePeriodsPayload,
  Timetable,
  TimetableListParams,
  TimetableListResponse,
  UpdateTimetablePayload,
} from "../types/timetables.types";

export const timetablesApi = {
  list: async (
    params?: TimetableListParams,
  ): Promise<TimetableListResponse> => {
    const { data } = await api.get<{
      success: boolean;
      message: string;
      data: Timetable[];
      pagination: TimetableListResponse["pagination"];
    }>("/school/timetables", {
      params,
    });

    return {
      data: data.data,
      pagination: data.pagination,
    };
  },

  getById: async (id: string): Promise<Timetable> => {
    const { data } = await api.get<{
      success: boolean;
      message: string;
      data: Timetable;
    }>(`/school/timetables/${id}`);

    return data.data;
  },

  create: async (payload: CreateTimetablePayload): Promise<Timetable> => {
    const { data } = await api.post<{
      success: boolean;
      message: string;
      data: Timetable;
    }>("/school/timetables", payload);

    return data.data;
  },

  upsert: async (payload: CreateTimetablePayload): Promise<Timetable> => {
    const { data } = await api.post<{
      success: boolean;
      message: string;
      data: Timetable;
    }>("/school/timetables/upsert", payload);

    return data.data;
  },

  update: async (
    id: string,
    payload: UpdateTimetablePayload,
  ): Promise<Timetable> => {
    const { data } = await api.patch<{
      success: boolean;
      message: string;
      data: Timetable;
    }>(`/school/timetables/${id}`, payload);

    return data.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/school/timetables/${id}`);
  },

  getPeriods: async (): Promise<PeriodMasterItem[]> => {
    const { data } = await api.get<{
      success: boolean;
      message: string;
      data: PeriodMasterItem[];
    }>("/school/timetables/periods");

    return data.data;
  },

  savePeriods: async (
    payload: SavePeriodsPayload,
  ): Promise<PeriodMasterItem[]> => {
    const { data } = await api.post<{
      success: boolean;
      message: string;
      data: PeriodMasterItem[];
    }>("/school/timetables/periods", payload);

    return data.data;
  },

  addPeriod: async (
    payload: AddPeriodPayload,
  ): Promise<PeriodMasterItem[]> => {
    const { data } = await api.post<{
      success: boolean;
      message: string;
      data: PeriodMasterItem[];
    }>("/school/timetables/periods/add", payload);

    return data.data;
  },

  deletePeriod: async (periodId: string): Promise<PeriodMasterItem[]> => {
    const { data } = await api.delete<{
      success: boolean;
      message: string;
      data: PeriodMasterItem[];
    }>(`/school/timetables/periods/${periodId}`);

    return data.data;
  },
};

