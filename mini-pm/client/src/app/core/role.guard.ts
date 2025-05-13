import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { AuthService } from './auth.service';

export const roleGuard: (...allowed: ('admin'|'member')[]) => CanActivateFn =
  (...roles) => (): boolean | UrlTree => {
    const auth = inject(AuthService);
    const router = inject(Router);

    if (!auth.isLoggedIn) {
      return router.createUrlTree(['/login']);
    }

    if (!roles.includes(auth.role!)) {
      return router.createUrlTree(['/dashboard']);
    }

    return true;
  };