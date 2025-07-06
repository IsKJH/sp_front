export interface User {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
  provider?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  status: number;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken?: string;
  user: User;
}