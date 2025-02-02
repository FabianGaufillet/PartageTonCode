import { inject, Injectable } from '@angular/core';
import { RelationshipsDal } from '../dal/relationships.dal';
import { Observable } from 'rxjs';
import { ApiResponse } from '../interfaces/api-response';

@Injectable({
  providedIn: 'root',
})
export class RelationshipsService {
  private readonly relationshipsDal = inject(RelationshipsDal);

  constructor() {}

  public getMyFriends(userId: string, page: number): Observable<ApiResponse> {
    return this.relationshipsDal.getMyFriends(userId, page);
  }

  public askForFriendship(strangerId: string): Observable<ApiResponse> {
    return this.relationshipsDal.askForFriendship(strangerId);
  }
}
