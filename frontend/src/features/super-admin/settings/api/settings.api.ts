import api from "@/api/client";
import type {
  Setting,
  UpdateSettingInput,
} from "../types/settings.types";

const BASE_URL = "/super-admin/settings";

export const getSettings = async (): Promise<Setting[]> => {
  const { data } = await api.get<{ success: boolean; data: Setting[] }>(BASE_URL);
  return data.data ?? [];
};

export const getSettingByKey = async (key: string): Promise<Setting | null> => {
  try {
    const { data } = await api.get<{ success: boolean; data: Setting }>(
      `${BASE_URL}/${key}`,
    );
    return data.data;
  } catch {
    return null;
  }
};

export const updateSetting = async (
  payload: UpdateSettingInput,
): Promise<Setting> => {
  const { data } = await api.post<{ success: boolean; data: Setting }>(
    BASE_URL,
    payload,
  );
  return data.data;
};

export const updateSettings = async (
  settings: Record<string, unknown>,
): Promise<Setting[]> => {
  const promises = Object.entries(settings).map(async ([key, value]) => {
    const { data } = await api.post<{ success: boolean; data: Setting }>(
      BASE_URL,
      { key, value },
    );
    return data.data;
  });

  return Promise.all(promises);
};

export const getSettingsBySection = async (
  section: "general" | "security" | "system",
): Promise<Setting[]> => {
  const allSettings = await getSettings();
  if (!section) return allSettings;
  return allSettings;
};

export const uploadSettingFile = async (
  file: File,
  type: "logo" | "favicon",
): Promise<{ url: string }> => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("type", type);
  const { data } = await api.post<{ success: boolean; data: { url: string } }>(
    `${BASE_URL}/upload`,
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    },
  );
  return data.data;
};
