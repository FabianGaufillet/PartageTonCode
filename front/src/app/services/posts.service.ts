import { inject, Injectable } from '@angular/core';
import { NewPost } from '../interfaces/new-post';
import { Observable } from 'rxjs';
import { ApiResponse } from '../interfaces/api-response';
import { PostsDal } from '../dal/posts.dal';

@Injectable({
  providedIn: 'root',
})
export class PostsService {
  private readonly postsDal = inject(PostsDal);

  constructor() {}

  publish(post: NewPost): Observable<ApiResponse> {
    return this.postsDal.publish(post);
  }
}
