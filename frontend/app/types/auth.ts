export type UserRole = 'Admin' | 'Customer';

export interface User {
  id: number;
  username: string;
  email: string;
  role: UserRole;
  first_name?: string;
  last_name?: string;
}

export interface AuthState {
  user: User | null;
  loading: boolean;
  login: (credentials: any) => Promise<void>;
  signup: (userData: any) => Promise<void>;
  googleLogin: (token: string) => Promise<void>;
  logout: () => void;
}
