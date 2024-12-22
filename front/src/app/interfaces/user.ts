export interface User {
  username: string;
  email: string;
  role: 'user' | 'admin';
  avatar: string;
  lastname: string;
  firstname: string;
  gender: 'male' | 'female' | 'other';
  age: number;
  street?: string;
  zipcode?: string;
  city?: string;
}
