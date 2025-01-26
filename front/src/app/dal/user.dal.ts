import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { SignupForm } from '../interfaces/signup-form';
import { Observable } from 'rxjs';
import { ApiResponse } from '../interfaces/api-response';
import { SigninForm } from '../interfaces/signin-form';
import { UpdatedUserForm } from '../interfaces/updated-user-form';

@Injectable({
  providedIn: 'root',
})
export class UserDal {
  private readonly httpClient = inject(HttpClient);
  private readonly signupUrl = `${environment.apiUrl}/user/signup`;
  private readonly signinUrl = `${environment.apiUrl}/user/signin`;
  private readonly userStatusUrl = `${environment.apiUrl}/user/status`;
  private readonly signoutUrl = `${environment.apiUrl}/user/signout`;
  private readonly userInfosUrl = `${environment.apiUrl}/user/`;
  private readonly checkPasswordUrl = `${environment.apiUrl}/user/check-password`;
  private readonly resetPasswordUrl = `${environment.apiUrl}/user/reset-password`;
  private readonly updateUserUrl = `${environment.apiUrl}/user/update`;

  constructor() {}

  signup(form: SignupForm): Observable<ApiResponse> {
    return this.httpClient.post(
      this.signupUrl,
      form,
    ) as Observable<ApiResponse>;
  }

  signin(form: SigninForm): Observable<ApiResponse> {
    return this.httpClient.post(
      this.signinUrl,
      form,
    ) as Observable<ApiResponse>;
  }

  updateUser(userId: string, form: UpdatedUserForm): Observable<ApiResponse> {
    return this.httpClient.put(
      `${this.updateUserUrl}/${userId}`,
      form,
    ) as Observable<ApiResponse>;
  }

  userStatus(): Observable<ApiResponse> {
    return this.httpClient.get(this.userStatusUrl) as Observable<ApiResponse>;
  }

  userInfos(id: string): Observable<ApiResponse> {
    const url = `${this.userInfosUrl}${id}`;
    return this.httpClient.get(url) as Observable<ApiResponse>;
  }

  checkPassword(password: string): Observable<ApiResponse> {
    return this.httpClient.post(this.checkPasswordUrl, {
      password,
    }) as Observable<ApiResponse>;
  }

  signout(): Observable<ApiResponse> {
    return this.httpClient.get(this.signoutUrl) as Observable<ApiResponse>;
  }

  resetPassword(email: string): Observable<ApiResponse> {
    return this.httpClient.post(this.resetPasswordUrl, {
      email,
    }) as Observable<ApiResponse>;
  }
}
