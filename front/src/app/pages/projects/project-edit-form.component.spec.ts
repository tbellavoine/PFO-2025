import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { FontAwesomeTestingModule } from '@fortawesome/angular-fontawesome/testing';
import { ProjectEditFormComponent } from './project-edit-form.component';
import { ProjectApiModel } from '@models/api/project.model';
import { ProjectCategory } from '@enums/project-category.enum';
import { environment } from '../../../environments/environment';

describe('ProjectEditFormComponent', () => {
  let component: ProjectEditFormComponent;
  let fixture: ComponentFixture<ProjectEditFormComponent>;
  let httpMock: HttpTestingController;

  const mockProject: ProjectApiModel = {
    id: '1',
    startDate: '2025-01-01',
    endDate: null,
    name: 'Portfolio 2025',
    company: 'Perso',
    category: ProjectCategory.WEBSITE,
    type: 'PERSO',
    status: 'IN_PROGRESS',
    description: 'desc',
    order: 0,
    published: true,
    skills: [{ id: 's1', name: 'Angular', slug: 'angular' }],
    links: [{ id: 'l1', label: 'Site', url: 'http://example.com', order: 0 }],
    previewImage: { id: 'm1', filename: 'p.jpg', url: 'http://localhost:3000/media/p.jpg' },
  };

  function createFixture() {
    TestBed.configureTestingModule({
      imports: [ProjectEditFormComponent, FontAwesomeTestingModule],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });

    httpMock = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(ProjectEditFormComponent);
    component = fixture.componentInstance;
  }

  afterEach(() => {
    httpMock.verify();
  });

  describe('editing an existing project', () => {
    beforeEach(() => {
      createFixture();
      fixture.componentRef.setInput('project', mockProject);
      fixture.detectChanges();
      httpMock.expectOne(`${environment.apiBaseUrl}/v1/admin/skills`).flush([{ id: 's1', name: 'Angular', slug: 'angular' }]);
    });

    it('should prefill the form from the project input', () => {
      expect(component['model']()).toEqual({
        startDate: '2025-01-01',
        endDate: null,
        name: 'Portfolio 2025',
        company: 'Perso',
        category: ProjectCategory.WEBSITE,
        type: 'PERSO',
        status: 'IN_PROGRESS',
        description: 'desc',
        order: 0,
        published: true,
      });
      expect(component['links']()).toEqual([{ label: 'Site', url: 'http://example.com' }]);
      expect(component['skillIds']()).toEqual(['s1']);
      expect(component['previewImage']()).toEqual({ id: 'm1', filename: 'p.jpg', url: 'http://localhost:3000/media/p.jpg' });
    });

    it('should PUT on submit and emit saved', () => {
      const savedSpy = vi.fn();
      component.saved.subscribe(savedSpy);

      component['onSubmit'](new Event('submit'));

      const req = httpMock.expectOne(`${environment.apiBaseUrl}/v1/admin/projects/1`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body.previewImageId).toBe('m1');
      req.flush(mockProject);

      expect(savedSpy).toHaveBeenCalled();
    });

    it('should DELETE on delete and emit deleted', () => {
      const deletedSpy = vi.fn();
      component.deleted.subscribe(deletedSpy);

      component['onDelete']();

      httpMock.expectOne(`${environment.apiBaseUrl}/v1/admin/projects/1`).flush(null);

      expect(deletedSpy).toHaveBeenCalled();
    });

    it('should upload a file and set it as the preview image', () => {
      const file = new File(['data'], 'new.jpg', { type: 'image/jpeg' });
      const input = document.createElement('input');
      input.type = 'file';
      Object.defineProperty(input, 'files', { value: [file] });

      component['onFileSelected']({ target: input } as unknown as Event);

      const req = httpMock.expectOne(`${environment.apiBaseUrl}/v1/admin/media`);
      expect(req.request.method).toBe('POST');
      req.flush({ id: 'm2', filename: 'new.jpg', url: 'http://localhost:3000/media/new.jpg' });

      expect(component['previewImage']()).toEqual({ id: 'm2', filename: 'new.jpg', url: 'http://localhost:3000/media/new.jpg' });
    });
  });

  describe('creating a new project', () => {
    beforeEach(() => {
      createFixture();
      fixture.componentRef.setInput('project', null);
      fixture.detectChanges();
      httpMock.expectOne(`${environment.apiBaseUrl}/v1/admin/skills`).flush([]);
    });

    it('should start with an empty form', () => {
      expect(component['model']().name).toBe('');
      expect(component['links']()).toEqual([]);
      expect(component['previewImage']()).toBeNull();
    });

    it('should POST on submit', () => {
      component['model'].update((m) => ({ ...m, name: 'New project', startDate: '2026-01-01', description: 'desc' }));

      component['onSubmit'](new Event('submit'));

      const req = httpMock.expectOne(`${environment.apiBaseUrl}/v1/admin/projects`);
      expect(req.request.method).toBe('POST');
      req.flush(mockProject);
    });
  });
});
