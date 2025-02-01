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
  private readonly askForFriendshipUrl = `${environment.apiUrl}/relationship/askForFriendship`;

  constructor() {}

  askForFriendship(strangerId: string): Observable<ApiResponse> {
    return this.httpClient.put(
      `${this.askForFriendshipUrl}/${strangerId}`,
      {},
    ) as Observable<ApiResponse>;
  }
}
