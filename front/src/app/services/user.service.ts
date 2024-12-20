import { inject, Injectable } from '@angular/core';
import { SigninForm } from '../interfaces/signin-form';
import { Observable } from 'rxjs';
import { ApiResponse } from '../interfaces/api-response';
import { UserDal } from '../dal/user.dal';
import { SignupForm } from '../interfaces/signup-form';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly userDal = inject(UserDal);
  constructor() {}

  signin(form: SigninForm): Observable<ApiResponse> {
    return this.userDal.signin(form);
  }

  signup(form: SignupForm): Observable<ApiResponse> {
    return this.userDal.signup(form);
  }

  userStatus(): Observable<ApiResponse> {
    return this.userDal.userStatus();
  }

  signout(): Observable<ApiResponse> {
    return this.userDal.signout();
  }
}
