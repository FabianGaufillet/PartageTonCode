import { CanActivateFn, Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { inject } from '@angular/core';
import { map } from 'rxjs';
import { ApiResponse } from '../interfaces/api-response';

export const authGuard: CanActivateFn = () => {
  const userService = inject(UserService);
  const router = inject(Router);
  return userService.userStatus().pipe(
    map((userStatus: ApiResponse) => {
      if (!userStatus.data['authenticated']) {
        router.navigate(['/signin']);
        return false;
      }
      return true;
    }),
  );
};
