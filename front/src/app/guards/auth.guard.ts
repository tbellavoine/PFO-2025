import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map } from 'rxjs';
import { AuthService } from '@services/auth.service';
import { Path } from '@enums/path.enum';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService
    .checkSession()
    .pipe(map((isAuthenticated) => isAuthenticated || router.createUrlTree([Path.ADMIN, Path.ADMIN_LOGIN])));
};
