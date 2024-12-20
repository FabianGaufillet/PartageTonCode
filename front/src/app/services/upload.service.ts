import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UploadDal } from '../dal/upload.dal';
import { ApiResponse } from '../interfaces/api-response';

@Injectable({
  providedIn: 'root',
})
export class UploadService {
  private readonly uploadDal = inject(UploadDal);

  constructor() {}

  uploadFile(file: File, fileId: string): Observable<ApiResponse> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('fileId', fileId);
    return this.uploadDal.uploadFile(formData);
  }
}
