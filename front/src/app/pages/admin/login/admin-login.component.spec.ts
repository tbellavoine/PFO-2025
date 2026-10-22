import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { provideRouter, Router } from '@angular/router';
import { AdminLoginComponent } from './admin-login.component';
import { environment } from '../../../../environments/environment';
import { Path } from '@enums/path.enum';

describe('AdminLoginComponent', () => {
  let fixture: ComponentFixture<AdminLoginComponent>;
  let component: AdminLoginComponent;
  let httpMock: HttpTestingController;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AdminLoginComponent],
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])],
    });

    httpMock = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(AdminLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not submit when the form is invalid', () => {
    component['onSubmit'](new Event('submit'));

    httpMock.expectNone(`${environment.apiBaseUrl}/v1/auth/login`);
  });

  it('should log in and navigate to /admin on success', () => {
    const navigateSpy = vi.spyOn(router, 'navigate').mockResolvedValue(true);
    component['model'].set({ email: 'admin@example.com', password: 'secret' });

    component['onSubmit'](new Event('submit'));

    httpMock.expectOne(`${environment.apiBaseUrl}/v1/auth/login`).flush({ email: 'admin@example.com' });

    expect(navigateSpy).toHaveBeenCalledWith([Path.HOME]);
    expect(component['errorMessage']()).toBeNull();
  });

  it('should show an error message on failed login', () => {
    component['model'].set({ email: 'admin@example.com', password: 'wrong' });

    component['onSubmit'](new Event('submit'));

    httpMock
      .expectOne(`${environment.apiBaseUrl}/v1/auth/login`)
      .flush({ message: 'Unauthorized' }, { status: 401, statusText: 'Unauthorized' });

    expect(component['errorMessage']()).toBe('Identifiants invalides.');
  });
});
