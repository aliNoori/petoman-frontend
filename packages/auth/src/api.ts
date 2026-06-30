import axios, { AxiosInstance, AxiosError } from 'axios';
import type { 
  //LoginRequest,
  VerifyCodeRequest, 
  RegisterRequest, 
  AuthResponse,
  User,
  AuthError 
} from './types';

class AuthAPI {
  private api: AxiosInstance;
  private useMock = false; // Set to false when API is ready
  constructor(baseURL: string = 'http://127.0.0.1:3000/api') {
    this.api = axios.create({
      baseURL,
      timeout: 50000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add request interceptor to include auth token
    this.api.interceptors.request.use((config) => {
      const token = this.getStoredToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // Add response interceptor to handle errors
    this.api.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        const authError: AuthError = {
          code: error.response?.status?.toString() || 'UNKNOWN',
          message: this.getErrorMessage(error),
          field: (error.response?.data as any)?.field,
        };
        return Promise.reject(authError);
      }
    );
  }

  private getStoredToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('petoman_auth_token');
    }
    return null;
  }

  private getErrorMessage(error: AxiosError): string {
    if (error.response?.data && (error.response.data as any)?.message) {
      return (error.response.data as any).message;
    }
    
    // Check if it's a network error
    if (error.code === 'ERR_NETWORK' || !error.response) {
      return 'خطا در اتصال به سرور. لطفاً اتصال اینترنت خود را بررسی کنید';
    }
    
    if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
      return 'زمان درخواست به پایان رسید. لطفاً دوباره تلاش کنید';
    }
    
    switch (error.response?.status) {
      case 400:
        return 'اطلاعات ارسالی نامعتبر است';
      case 401:
        return 'کد وارد شده صحیح نیست';
      case 404:
        return 'کاربر یافت نشد';
      case 429:
        return 'تعداد درخواست‌ها بیش از حد مجاز است';
      case 500:
        return 'خطای سرور. لطفا دوباره تلاش کنید';
      default:
        return 'خطا در برقراری ارتباط. لطفاً دوباره تلاش کنید';
    }
  }

  async checkPhoneNumber(phoneNumber: string): Promise<{ exists: boolean }> {
    if (this.useMock) {
      // Mock mode - no API call
      console.log('Mock: Checking phone number:', phoneNumber);
      return Promise.resolve({ exists: false });
    }
    
    // Real API call
    const response = await this.api.post('/v1/auth/check-phone', { phoneNumber });
    return response.data;
  }

  async sendOTP(phoneNumber: string): Promise<{ data: any }> {
    // if (this.useMock) {
    //   // Mock mode - no API call
    //   console.log('Mock: OTP sent to:', phoneNumber);
    //   return Promise.resolve({ message: 'کد تایید ارسال شد' });
    // }

    // Real API call
    const response = await this.api.post('/v1/auth/send-otp', { phoneNumber });
    return response.data;
  }

  async verifyOTP(data: VerifyCodeRequest): Promise<AuthResponse> {
    if (this.useMock) {
      // Mock mode - no API call
      console.log('Mock: Verifying OTP for:', data.phoneNumber);
      return Promise.resolve({
        token: 'mock-jwt-token-' + Date.now(),
        expiresIn: 3600,
        user: {
          id: '1',
          phoneNumber: data.phoneNumber,
          firstName: 'کاربر',
          lastName: 'تست',
          isProfileComplete: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
      });
    }
    
    // Real API call
    const response = await this.api.post('/v1/auth/verify-otp', data);
    return response.data;
  }

  async register(data: RegisterRequest): Promise<AuthResponse> {
    if (this.useMock) {
      // Mock mode - no API call
      console.log('Mock: Registering user:', data.phoneNumber, data.firstName, data.lastName);
      return Promise.resolve({
        token: 'mock-jwt-token-' + Date.now(),
        expiresIn: 3600,
        user: {
          id: '1',
          phoneNumber: data.phoneNumber,
          firstName: data.firstName,
          lastName: data.lastName,
          isProfileComplete: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
      });
    }
    
    // Real API call
    const response = await this.api.post('/v1/auth/register', data);
    return response.data;
  }

  async refreshToken(): Promise<AuthResponse> {
    if (this.useMock) {
      // Mock mode - no API call
      console.log('Mock: Refreshing token');
      return Promise.resolve({
        token: 'mock-jwt-token-' + Date.now(),
        expiresIn: 3600,
        user: {
          id: '1',
          phoneNumber: '09123456789',
          firstName: 'کاربر',
          lastName: 'تست',
          isProfileComplete: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
      });
    }
    
    // Real API call
    const response = await this.api.post('/v1/auth/refresh');
    return response.data;
  }

  async logout(): Promise<void> {
    if (this.useMock) {
      // Mock mode - no API call
      console.log('Mock: Logging out');
      return Promise.resolve();
    }
    
    // Real API call
    await this.api.post('/v1/auth/logout');
  }

  async getCurrentUser(): Promise<User> {
    if (this.useMock) {
      // Mock mode - no API call
      console.log('Mock: Getting current user');
      return Promise.resolve({
        id: '1',
        phoneNumber: '09123456789',
        firstName: 'کاربر',
        lastName: 'تست',
        isProfileComplete: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }
    
    // Real API call
    const response = await this.api.get('/v1/auth/me');
    return response.data;
  }

  async updateProfile(data: Partial<User>): Promise<User> {
    if (this.useMock) {
      // Mock mode - no API call
      console.log('Mock: Updating profile', data);
      return Promise.resolve({
        id: '1',
        phoneNumber: '09123456789',
        firstName: data.firstName || 'کاربر',
        lastName: data.lastName || 'تست',
        isProfileComplete: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }
    
    // Real API call
    const response = await this.api.put('/v1/auth/profile', data);
    return response.data;
  }
}

export { AuthAPI };
export default AuthAPI;
