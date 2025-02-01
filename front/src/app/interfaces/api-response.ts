import { User } from './user';
import { Post } from './post';

export interface ApiResponse {
  message: string;
  data: { [key: string]: string | boolean | number | User | User[] | Post[] };
}
