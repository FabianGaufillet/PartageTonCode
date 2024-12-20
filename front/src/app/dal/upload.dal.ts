import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { ApiResponse } from '../interfaces/api-response';

@Injectable({
  providedIn: 'root',
})
export class UploadDal {
  private readonly uploadUrl = `${environment.apiUrl}/upload`;
  private readonly httpClient = inject(HttpClient);

  constructor() {}

  uploadFile(formData: FormData): Observable<ApiResponse> {
    return this.httpClient.post(
      this.uploadUrl,
      formData,
    ) as Observable<ApiResponse>;
  }
}
