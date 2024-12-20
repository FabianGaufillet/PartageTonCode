export interface SignupForm {
  username: string;
  email: string;
  role?: 'user' | 'admin';
  avatar?: string;
  lastname: string;
  firstname: string;
  gender: 'male' | 'female' | 'other';
  age: number;
  street?: string;
  city?: string;
  zipcode?: string;
  password: string;
}
