import { inject, Injectable } from '@angular/core';
import { SigninForm } from '../interfaces/signin-form';
import { Observable, Subject } from 'rxjs';
import { ApiResponse } from '../interfaces/api-response';
import { UserDal } from '../dal/user.dal';
import { SignupForm } from '../interfaces/signup-form';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly userDal = inject(UserDal);
  private userStatusSubject = new Subject<ApiResponse>();

  constructor() {}

  public signin(form: SigninForm): Observable<ApiResponse> {
    return this.userDal.signin(form);
  }

  public signup(form: SignupForm): Observable<ApiResponse> {
    return this.userDal.signup(form);
  }

  public userStatus(): Observable<ApiResponse> {
    return this.userDal.userStatus();
  }

  public signout(): Observable<ApiResponse> {
    return this.userDal.signout();
  }

  public getUserStatus(): Observable<ApiResponse> {
    return this.userStatusSubject;
  }

  public setUserStatus(status: ApiResponse): void {
    this.userStatusSubject.next(status);
  }
}
