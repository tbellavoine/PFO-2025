import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, of, tap } from 'rxjs';
import { environment } from '../../environments/environment';

export interface AdminSession {
  email: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly _admin = signal<AdminSession | null>(null);
  public readonly admin = this._admin.asReadonly();

  login(email: string, password: string): Observable<AdminSession> {
    return this.http
      .post<AdminSession>(`${environment.apiBaseUrl}/v1/auth/login`, { email, password })
      .pipe(tap((session) => this._admin.set(session)));
  }

  logout(): Observable<void> {
    return this.http
      .post<{ ok: true }>(`${environment.apiBaseUrl}/v1/auth/logout`, {})
      .pipe(
        tap(() => this._admin.set(null)),
        // logout clearing the cookie is what matters; a network failure
        // shouldn't stop the UI from treating the session as ended.
        catchError(() => {
          this._admin.set(null);
          return of(undefined);
        }),
      ) as Observable<void>;
  }

  /**
   * Check whether the httpOnly session cookie (if any) is still valid.
   * Used by the admin route guard; resolves to false rather than throwing
   * on a 401 so the guard can redirect instead of erroring.
   */
  checkSession(): Observable<boolean> {
    return this.http.get<AdminSession>(`${environment.apiBaseUrl}/v1/auth/me`).pipe(
      tap((session) => this._admin.set(session)),
      map(() => true),
      catchError(() => {
        this._admin.set(null);
        return of(false);
      }),
    );
  }
}
