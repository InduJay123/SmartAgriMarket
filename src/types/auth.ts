export type UserRole = 'farmer' | 'buyer' | 'admin';


export interface LoginFormData {
  email: string;
  password: string;
  role: UserRole;
}

export interface SignupFormData {
  fullName: string;
  username: string;
  email: string;
  mobileNumber: string;
  password: string;
  confirmPassword: string;
  role: UserRole;
  farmLocation?: string;
}
