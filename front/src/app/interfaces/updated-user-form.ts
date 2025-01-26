export interface UpdatedUserForm {
  username: string;
  email: string;
  role?: 'user' | 'admin';
  avatar?: string;
  lastname: string;
  firstname: string;
  gender: 'male' | 'female' | 'other';
  street?: string;
  city?: string;
  zipcode?: string;
}
