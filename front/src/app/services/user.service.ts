import { inject, Injectable } from '@angular/core';
import { SigninForm } from '../interfaces/signin-form';
import { Observable, Subject } from 'rxjs';
import { ApiResponse } from '../interfaces/api-response';
import { UserDal } from '../dal/user.dal';
import { SignupForm } from '../interfaces/signup-form';
import { UpdatedUserForm } from '../interfaces/updated-user-form';

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

  public updateUser(
    userId: string,
    form: UpdatedUserForm,
  ): Observable<ApiResponse> {
    return this.userDal.updateUser(userId, form);
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

  public userInfos(id: string): Observable<ApiResponse> {
    return this.userDal.userInfos(id);
  }

  public checkPassword(password: string): Observable<ApiResponse> {
    return this.userDal.checkPassword(password);
  }

  public resetPassword(email: string): Observable<ApiResponse> {
    return this.userDal.resetPassword(email);
  }

  public getAllUsers(page: number): Observable<ApiResponse> {
    return this.userDal.getAllUsers(page);
  }
}
