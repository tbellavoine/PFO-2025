import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { FontAwesomeTestingModule } from '@fortawesome/angular-fontawesome/testing';
import { ProfileEditFormComponent } from './profile-edit-form.component';
import { ProfileApiModel } from '@models/api/profile.model';
import { environment } from '../../../environments/environment';

describe('ProfileEditFormComponent', () => {
  let component: ProfileEditFormComponent;
  let fixture: ComponentFixture<ProfileEditFormComponent>;
  let httpMock: HttpTestingController;

  const mockProfile: ProfileApiModel = {
    id: '1',
    name: 'Thomas BELLAVOINE',
    title: 'Développeur frontend Angular',
    bioParagraphs: ['Paragraph 1'],
    softSkills: ['teamwork'],
    cvUrl: '/cv.pdf',
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ProfileEditFormComponent, FontAwesomeTestingModule],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });

    httpMock = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(ProfileEditFormComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('profile', mockProfile);
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should prefill the form and arrays from the profile input', () => {
    expect(component['model']()).toEqual({ name: mockProfile.name, title: mockProfile.title, cvUrl: mockProfile.cvUrl });
    expect(component['bioParagraphs']()).toEqual(['Paragraph 1']);
    expect(component['softSkills']()).toEqual(['teamwork']);
  });

  it('should add and remove a bio paragraph', () => {
    component['addBioParagraph']();
    expect(component['bioParagraphs']()).toEqual(['Paragraph 1', '']);

    component['removeBioParagraph'](0);
    expect(component['bioParagraphs']()).toEqual(['']);
  });

  it('should PUT the updated profile and emit saved on success', () => {
    const savedSpy = vi.fn();
    component.saved.subscribe(savedSpy);

    component['onSubmit'](new Event('submit'));

    const req = httpMock.expectOne(`${environment.apiBaseUrl}/v1/admin/profile`);
    expect(req.request.body).toEqual({
      name: mockProfile.name,
      title: mockProfile.title,
      cvUrl: mockProfile.cvUrl,
      bioParagraphs: ['Paragraph 1'],
      softSkills: ['teamwork'],
    });
    req.flush({ ok: true });

    expect(savedSpy).toHaveBeenCalled();
  });
});
