import { IUser, IRegisterForm } from "@/types/user";
import {
  IApiResponse,
  IAuthenticatedUser,
  ILoginForm,
  ILoginResponse,
} from "@/types/auth";

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

interface ApiRequestConfig<T = any> {
  endpoint: string;
  method?: HttpMethod;
  body?: T;
  headers?: Record<string, string>;
  params?: Record<string, string>;
}

class ApiService {
  private baseUrl: string = "/api";

  private createUrl(endpoint: string, params?: Record<string, string>): string {
    const url = new URL(`${this.baseUrl}${endpoint}`, window.location.origin);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, value);
      });
    }
    return url.toString();
  }

  async request<TResponse = any, TBody = any>({
    endpoint,
    method = "GET",
    body,
    headers = {},
    params,
  }: ApiRequestConfig<TBody>): Promise<TResponse> {
    const url = this.createUrl(endpoint, params);

    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      ...(body ? { body: JSON.stringify(body) } : {}),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Une erreur est survenue");
    }

    return data;
  }

  async get<T>(endpoint: string, params?: Record<string, string>): Promise<T> {
    return this.request<T>({ endpoint, params });
  }

  async post<TResponse, TBody>(
    endpoint: string,
    body: TBody
  ): Promise<TResponse> {
    return this.request<TResponse, TBody>({
      endpoint,
      method: "POST",
      body,
    });
  }

  async put<TResponse, TBody>(
    endpoint: string,
    body: TBody
  ): Promise<TResponse> {
    return this.request<TResponse, TBody>({
      endpoint,
      method: "PUT",
      body,
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>({
      endpoint,
      method: "DELETE",
    });
  }
}

// Instance du service
export const api = new ApiService();

// Exemple d'utilisation avec des types spécifiques pour chaque endpoint
export const userApi = {
  register: (data: Omit<IRegisterForm, "confirmPassword">) =>
    api.post<Omit<IUser, "password">, typeof data>("/register", data),

  login: (credentials: { email: string; password: string }) =>
    api.post<
      { token: string; user: Omit<IUser, "password"> },
      typeof credentials
    >("/login", credentials),

  getProfile: () => api.get<Omit<IUser, "password">>("/user/profile"),

  updateProfile: (data: Partial<Omit<IUser, "id" | "password">>) =>
    api.put<Omit<IUser, "password">, typeof data>("/user/profile", data),

  changePassword: (data: { oldPassword: string; newPassword: string }) =>
    api.post<{ message: string }, typeof data>("/user/change-password", data),
};
