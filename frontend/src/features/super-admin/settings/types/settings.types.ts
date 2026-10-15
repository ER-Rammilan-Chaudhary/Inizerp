export interface Setting {
  id: string;
  key: string;
  value: unknown;
  schoolId?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface SettingsResponse {
  success: boolean;
  message: string;
  data: {
    general: Setting[];
    security: Setting[];
    system: Setting[];
  };
}

export interface SettingResponse {
  success: boolean;
  message: string;
  data: Setting;
}

export interface SettingsSectionResponse {
  success: boolean;
  message: string;
  data: Setting[];
}

export interface UpdateSettingInput {
  key: string;
  value: unknown;
}

export interface UploadSettingResponse {
  success: boolean;
  message: string;
  data: {
    setting: Setting;
    url: string;
  };
}
