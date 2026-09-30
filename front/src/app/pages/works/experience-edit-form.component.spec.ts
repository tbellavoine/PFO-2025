import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { ExperienceEditFormComponent } from './experience-edit-form.component';
import { ExperienceApiModel } from '@models/api/experience.model';
import { environment } from '../../../environments/environment';

describe('ExperienceEditFormComponent', () => {
  let component: ExperienceEditFormComponent;
  let fixture: ComponentFixture<ExperienceEditFormComponent>;
  let httpMock: HttpTestingController;

  const mockExperience: ExperienceApiModel = {
    id: '1',
    slug: 'grdf',
    company: 'Web atrio',
    role: 'Dev',
    periodLabel: 'Oct 2020',
    status: 'En cours',
    order: 0,
    published: true,
    achievements: [{ id: 'a1', text: 'Did things', order: 0 }],
    skills: [{ id: 'es1', skill: { id: 's1', name: 'Angular', slug: 'angular' }, category: { id: 'c1', key: 'front_end', label: 'Front End', order: 0 } }],
  };

  function createFixture() {
    TestBed.configureTestingModule({
      imports: [ExperienceEditFormComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });

    httpMock = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(ExperienceEditFormComponent);
    component = fixture.componentInstance;
  }

  function flushCatalogRequests() {
    httpMock.expectOne(`${environment.apiBaseUrl}/v1/admin/skills`).flush([{ id: 's1', name: 'Angular', slug: 'angular' }]);
    httpMock.expectOne(`${environment.apiBaseUrl}/v1/admin/skills/categories`).flush([{ id: 'c1', key: 'front_end', label: 'Front End', order: 0 }]);
  }

  afterEach(() => {
    httpMock.verify();
  });

  describe('editing an existing experience', () => {
    beforeEach(() => {
      createFixture();
      fixture.componentRef.setInput('experience', mockExperience);
      fixture.detectChanges();
      flushCatalogRequests();
    });

    it('should prefill the form from the experience input', () => {
      expect(component['model']()).toEqual({
        slug: 'grdf',
        company: 'Web atrio',
        role: 'Dev',
        periodLabel: 'Oct 2020',
        status: 'En cours',
        order: 0,
        published: true,
      });
      expect(component['achievements']()).toEqual(['Did things']);
      expect(component['skillAssignments']()).toEqual([{ skillId: 's1', categoryId: 'c1' }]);
    });

    it('should PUT on submit and emit saved', () => {
      const savedSpy = vi.fn();
      component.saved.subscribe(savedSpy);

      component['onSubmit'](new Event('submit'));

      const req = httpMock.expectOne(`${environment.apiBaseUrl}/v1/admin/experiences/1`);
      expect(req.request.method).toBe('PUT');
      req.flush(mockExperience);

      expect(savedSpy).toHaveBeenCalled();
    });

    it('should DELETE on delete and emit deleted', () => {
      const deletedSpy = vi.fn();
      component.deleted.subscribe(deletedSpy);

      component['onDelete']();

      httpMock.expectOne(`${environment.apiBaseUrl}/v1/admin/experiences/1`).flush(null);

      expect(deletedSpy).toHaveBeenCalled();
    });
  });

  describe('creating a new experience', () => {
    beforeEach(() => {
      createFixture();
      fixture.componentRef.setInput('experience', null);
      fixture.detectChanges();
      flushCatalogRequests();
    });

    it('should start with an empty form', () => {
      expect(component['model']()).toEqual({
        slug: '',
        company: '',
        role: '',
        periodLabel: '',
        status: '',
        order: 0,
        published: false,
      });
      expect(component['achievements']()).toEqual([]);
    });

    it('should POST on submit', () => {
      component['model'].set({
        slug: 'new-job',
        company: 'Acme',
        role: 'Dev',
        periodLabel: '2026',
        status: 'En cours',
        order: 0,
        published: false,
      });

      component['onSubmit'](new Event('submit'));

      const req = httpMock.expectOne(`${environment.apiBaseUrl}/v1/admin/experiences`);
      expect(req.request.method).toBe('POST');
      req.flush(mockExperience);
    });
  });
});
