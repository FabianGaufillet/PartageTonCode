import { User } from './user';

export interface Post {
  author: User;
  comments: string[];
  content: string;
  createdAt: string;
  profile: User;
  title: string;
  updatedAt: string;
  upvotes: User[];
  _id: string;
}
