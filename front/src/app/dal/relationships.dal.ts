import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { ApiResponse } from '../interfaces/api-response';

@Injectable({
  providedIn: 'root',
})
export class RelationshipsDal {
  private readonly httpClient = inject(HttpClient);
  private readonly myFriendsUrl = `${environment.apiUrl}/relationship/friends`;
  private readonly askForFriendshipUrl = `${environment.apiUrl}/relationship/askForFriendship`;

  constructor() {}

  getMyFriends(userId: string, page: number): Observable<ApiResponse> {
    return this.httpClient.get(
      `${this.myFriendsUrl}/${userId}?page=${page}`,
    ) as Observable<ApiResponse>;
  }

  askForFriendship(strangerId: string): Observable<ApiResponse> {
    return this.httpClient.put(
      `${this.askForFriendshipUrl}/${strangerId}`,
      {},
    ) as Observable<ApiResponse>;
  }
}
