import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { provideRouter, Router, UrlTree } from '@angular/router';
import { firstValueFrom, isObservable } from 'rxjs';
import { authGuard } from './auth.guard';
import { environment } from '../../environments/environment';
import { Path } from '@enums/path.enum';

describe('authGuard', () => {
  let httpMock: HttpTestingController;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])],
    });

    httpMock = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
  });

  afterEach(() => {
    httpMock.verify();
  });

  function runGuard() {
    return TestBed.runInInjectionContext(() =>
      authGuard({} as never, { url: '/admin/projects' } as never),
    );
  }

  it('should allow activation when the session is valid', async () => {
    const result$ = runGuard();
    const resultPromise = isObservable(result$) ? firstValueFrom(result$) : Promise.resolve(result$);

    httpMock.expectOne(`${environment.apiBaseUrl}/v1/auth/me`).flush({ email: 'admin@example.com' });

    expect(await resultPromise).toBe(true);
  });

  it('should redirect to the admin login page when the session is invalid', async () => {
    const result$ = runGuard();
    const resultPromise = isObservable(result$) ? firstValueFrom(result$) : Promise.resolve(result$);

    httpMock
      .expectOne(`${environment.apiBaseUrl}/v1/auth/me`)
      .flush({ message: 'Unauthorized' }, { status: 401, statusText: 'Unauthorized' });

    const result = await resultPromise;
    expect(result).toBeInstanceOf(UrlTree);
    expect(router.serializeUrl(result as UrlTree)).toBe(`/${Path.ADMIN}/${Path.ADMIN_LOGIN}`);
  });
});
