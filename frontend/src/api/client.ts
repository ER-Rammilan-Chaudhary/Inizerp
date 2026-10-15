import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { useAuthStore } from "@/store/auth.store";

//  API CONFIG
const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api",
  TIMEOUT: 30000,
} as const;

// TYPES
interface RetryRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

// MAIN API CLIENT

const client = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    "Content-Type": "application/json",
  },

// * Sends HTTP-only refresh cookie.
  withCredentials: true,
});

/* ===========================
   REFRESH CLIENT
=========================== */

/**
 * Separate axios instance for refresh.
 *
 * DO NOT use `client` here.
 * Otherwise refresh request can go through
 * the same interceptor and cause recursion.
 */
const refreshClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,

  headers: {
    "Content-Type": "application/json",
  },

  /**
   * Required when refresh token
   * is stored in an HTTP-only cookie.
   */
  withCredentials: true,
});

/* ===========================
   REFRESH STATE
=========================== */

/**
 * Only one refresh request can run at a time.
 *
 * Example:
 *
 * Request A -> 401
 * Request B -> 401
 * Request C -> 401
 *
 * Only ONE /auth/refresh request is made.
 *
 * A, B and C wait for the same promise.
 */
let refreshPromise: Promise<string> | null = null;

/**
 * Prevent multiple redirects.
 */
let redirectingToLogin = false;

/* ===========================
   REFRESH ACCESS TOKEN
=========================== */

function refreshAccessToken(): Promise<string> {
  /**
   * If refresh is already running,
   * return the existing promise.
   */
  if (refreshPromise) {
    return refreshPromise;
  }

  refreshPromise = refreshClient
    .post("/auth/refresh")
    .then((response) => {
      console.log("REFRESH SUCCESS:", response.data);

      /**
       * Expected response:
       *
       * {
       *   data: {
       *     accessToken: "..."
       *   }
       * }
       */
      const accessToken = response.data?.data?.accessToken;

      if (!accessToken) {
        throw new Error("Refresh response did not include an access token");
      }

      /**
       * Save new access token.
       */
      useAuthStore.getState().setAccessToken(accessToken);

      return accessToken;
    })
    .catch((error: AxiosError) => {
      /**
       * Very useful for debugging.
       */
      console.error("REFRESH FAILED:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });

      throw error;
    })
    .finally(() => {
      /**
       * Allow another refresh later.
       */
      refreshPromise = null;
    });

  return refreshPromise;
}

/* ===========================
   REDIRECT TO LOGIN
=========================== */

function redirectToLogin() {
  /**
   * Axios can also run during SSR.
   */
  if (typeof window === "undefined") {
    return;
  }

  /**
   * Prevent multiple redirects.
   */
  if (redirectingToLogin) {
    return;
  }

  redirectingToLogin = true;

  /**
   * Clear auth state.
   */
  useAuthStore.getState().logout();

  /**
   * Redirect.
   */
  window.location.replace("/login");
}

/* ===========================
   REQUEST INTERCEPTOR
=========================== */

client.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    /**
     * Get latest token from Zustand.
     */
    const token = useAuthStore.getState().accessToken;

    if (token) {
      config.headers = config.headers ?? {};

      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },

  (error) => {
    return Promise.reject(error);
  },
);

/* ===========================
   RESPONSE INTERCEPTOR
=========================== */

client.interceptors.response.use(
  /**
   * Successful response.
   */
  (response) => {
    return response;
  },

  /**
   * Error response.
   */
  async (error: AxiosError) => {
    const originalRequest = error.config as RetryRequestConfig | undefined;

    /**
     * No request config.
     */
    if (!originalRequest) {
      return Promise.reject(error);
    }

    const url = originalRequest.url ?? "";

    /**
     * Detect auth endpoints.
     */
    const isLoginRequest = url.includes("/auth/login");
    const isRefreshRequest = url.includes("/auth/refresh");

    /* ===========================
       LOGIN
    =========================== */

    /**
     * Login can legitimately return 401
     * for wrong credentials.
     *
     * NEVER try refresh here.
     */
    if (isLoginRequest) {
      return Promise.reject(error);
    }

    /* ===========================
       REFRESH
    =========================== */

    /**
     * Safety guard.
     *
     * Normally refreshClient is separate,
     * so this interceptor won't receive
     * the refresh request anyway.
     */
    if (isRefreshRequest) {
      return Promise.reject(error);
    }

    /* ===========================
       ACCESS TOKEN EXPIRED
    =========================== */

    if (error.response?.status === 401 && !originalRequest._retry) {
      /**
       * Make sure this request
       * cannot be retried twice.
       */
      originalRequest._retry = true;

      try {
        /**
         * Get a new access token.
         *
         * If another request is already refreshing,
         * this waits for the same promise.
         */
        const newAccessToken = await refreshAccessToken();

        /**
         * Make sure headers exist.
         */
        originalRequest.headers = originalRequest.headers ?? {};

        /**
         * Put new token into the failed request.
         */
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        /**
         * Retry original request.
         */
        return client(originalRequest);
      } catch (refreshError) {
        /**
         * Refresh token is probably expired,
         * invalid, missing, or cookie wasn't sent.
         */
        console.error("ACCESS TOKEN REFRESH FAILED:", refreshError);

        redirectToLogin();

        return Promise.reject(refreshError);
      }
    }

    /* ===========================
       MAINTENANCE MODE (503)
    =========================== */
    if (
      error.response?.status === 503 &&
      (error.response?.data as any)?.code === "MAINTENANCE_MODE"
    ) {
      if (
        !isLoginRequest &&
        typeof window !== "undefined" &&
        !window.location.pathname.startsWith("/super-admin") &&
        !window.location.pathname.startsWith("/maintenance")
      ) {
        window.location.replace("/maintenance");
      }
      return Promise.reject(error);
    }

    /* ===========================
       OTHER ERRORS
    =========================== */

    /**
     * 400
     * 403
     * 404
     * 422
     * 500
     * etc.
     *
     * Don't refresh.
     */
    return Promise.reject(error);
  },
);

/* ===========================
   EXPORT
=========================== */

export default client;
