import { User } from './user';

export interface ApiResponse {
  message: string;
  data: { [key: string]: string | boolean | User };
}
