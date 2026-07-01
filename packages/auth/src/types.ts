export interface User {
  id: string;
  phoneNumber: string;
  firstName?: string;
  lastName?: string;
  isProfileComplete: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  token: string;
  user: User;
  expiresIn: number;
}

export interface LoginRequest {
  phoneNumber: string;
}

export interface VerifyCodeRequest {
  phoneNumber: string;
  code: string;
}

export interface RegisterRequest {
  phoneNumber: string;
  firstName: string;
  lastName: string;
  code: string;
}

export interface AuthError {
  code: string;
  message: string;
  field?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: AuthError | null;
}
export interface SendOTPResponse {
  success: boolean;
  message: string;
}
