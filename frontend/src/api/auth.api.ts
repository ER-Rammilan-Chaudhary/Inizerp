import client from "@/api/client";
import type {
  ApiResponse,
  AuthUser,
  LoginData,
  LoginRequest,
  RefreshData,
} from "@/types/auth.types";

export const authApi = {
  async login(payload: LoginRequest): Promise<LoginData> {
    const { data } = await client.post<ApiResponse<LoginData>>(
      "/auth/login",
      payload,
    );

    return data.data;
  },

  /** Refresh token is read by the backend from the httpOnly cookie. */
  async refresh(): Promise<RefreshData> {
    const { data } =
      await client.post<ApiResponse<RefreshData>>("/auth/refresh");

    return data.data;
  },

  async me(): Promise<AuthUser> {
    const { data } = await client.get<ApiResponse<AuthUser>>("/auth/me");
    return data.data;
  },

  async logout(): Promise<ApiResponse<null>> {
    const { data } = await client.post<ApiResponse<null>>("/auth/logout");
    return data;
  },
};
