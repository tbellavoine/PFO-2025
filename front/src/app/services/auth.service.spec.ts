import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should set the admin session on successful login', () => {
    service.login('admin@example.com', 'secret').subscribe();

    httpMock
      .expectOne(`${environment.apiBaseUrl}/v1/auth/login`)
      .flush({ email: 'admin@example.com' });

    expect(service.admin()).toEqual({ email: 'admin@example.com' });
  });

  it('should clear the admin session on logout', () => {
    service.login('admin@example.com', 'secret').subscribe();
    httpMock.expectOne(`${environment.apiBaseUrl}/v1/auth/login`).flush({ email: 'admin@example.com' });

    service.logout().subscribe();
    httpMock.expectOne(`${environment.apiBaseUrl}/v1/auth/logout`).flush({ ok: true });

    expect(service.admin()).toBeNull();
  });

  it('should resolve checkSession to true and set the session on 200', () => {
    let result: boolean | undefined;
    service.checkSession().subscribe((value) => (result = value));

    httpMock.expectOne(`${environment.apiBaseUrl}/v1/auth/me`).flush({ email: 'admin@example.com' });

    expect(result).toBe(true);
    expect(service.admin()).toEqual({ email: 'admin@example.com' });
  });

  it('should resolve checkSession to false and clear the session on 401', () => {
    let result: boolean | undefined;
    service.checkSession().subscribe((value) => (result = value));

    httpMock
      .expectOne(`${environment.apiBaseUrl}/v1/auth/me`)
      .flush({ message: 'Unauthorized' }, { status: 401, statusText: 'Unauthorized' });

    expect(result).toBe(false);
    expect(service.admin()).toBeNull();
  });
});
