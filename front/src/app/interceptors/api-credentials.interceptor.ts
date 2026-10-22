import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../environments/environment';

/**
 * The backend's auth cookie is httpOnly + sameSite=strict, so every call to
 * our own API (not just /auth/*) must opt in to sending/receiving it.
 */
export const apiCredentialsInterceptor: HttpInterceptorFn = (req, next) => {
  if (!req.url.startsWith(environment.apiBaseUrl)) {
    return next(req);
  }

  return next(req.clone({ withCredentials: true }));
};
