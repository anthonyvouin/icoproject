export interface ILoginForm {
  email: string;
  password: string;
}

export interface ILoginResponse {
  token: string;
  user: {
    id: number;
    email: string;
    name: string | null;
  };
}

export interface IAuthenticatedUser {
  id: number;
  email: string;
  name: string | null;
}

// Types pour les réponses API
export interface IApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface IApiErrorResponse {
  success: false;
  error: string;
}

export interface IApiSuccessResponse<T> {
  success: true;
  data: T;
}
