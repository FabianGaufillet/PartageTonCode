import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { NewPost } from '../interfaces/new-post';
import { Observable } from 'rxjs';
import { ApiResponse } from '../interfaces/api-response';

@Injectable({
  providedIn: 'root',
})
export class PostsDal {
  private readonly postUrl = `${environment.apiUrl}/post`;
  private readonly httpClient = inject(HttpClient);

  constructor() {}

  publish(post: NewPost): Observable<ApiResponse> {
    return this.httpClient.post(
      `${this.postUrl}/create`,
      post,
    ) as Observable<ApiResponse>;
  }
}
