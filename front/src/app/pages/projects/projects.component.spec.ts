import type { MockedObject } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { signal } from '@angular/core';
import { FontAwesomeTestingModule } from '@fortawesome/angular-fontawesome/testing';
import { ProjectsComponent } from './projects.component';
import { TabsService } from '@services/tabs.service';
import { AuthService } from '@services/auth.service';
import { TabKey } from '@enums/tab-key.enum';
import { ProjectCategory } from '@enums/project-category.enum';
import { ProjectApiModel } from '@models/api/project.model';
import { environment } from '../../../environments/environment';

describe('ProjectsComponent', () => {
  let component: ProjectsComponent;
  let fixture: ComponentFixture<ProjectsComponent>;
  let mockTabsService: MockedObject<TabsService>;
  let httpMock: HttpTestingController;
  let adminSignal: ReturnType<typeof signal<{ email: string } | null>>;

  const mockProjects: ProjectApiModel[] = [
    {
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
    },
    {
      id: '2',
      startDate: '2020-01-01',
      endDate: null,
      name: 'GRP',
      company: 'Web Atrio',
      category: ProjectCategory.APP,
      type: 'PRO',
      status: 'IN_PROGRESS',
      description: 'desc',
      order: 1,
      published: true,
      skills: [{ id: 's2', name: 'TypeScript', slug: 'typescript' }],
      links: [],
      previewImage: { id: 'm1', filename: 'grp.jpg', url: 'http://localhost:3000/media/grp.jpg' },
    },
  ];

  beforeEach(() => {
    mockTabsService = {
      addTab: vi.fn().mockName('TabsService.addTab'),
    } as unknown as MockedObject<TabsService>;
    adminSignal = signal(null);

    TestBed.configureTestingModule({
      imports: [ProjectsComponent, FontAwesomeTestingModule],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: TabsService, useValue: mockTabsService },
        { provide: AuthService, useValue: { admin: adminSignal } },
      ],
    });

    httpMock = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(ProjectsComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
    httpMock.expectOne(`${environment.apiBaseUrl}/v1/projects`).flush(mockProjects);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with empty selected category', () => {
    expect(component.selectedCategory()).toBe('');
  });

  it('should add tab on init', () => {
    expect(mockTabsService.addTab).toHaveBeenCalledWith(
      expect.objectContaining({
        key: TabKey.PROJECTS,
      }),
    );
  });

  it('should filter projects by category', () => {
    const category = ProjectCategory.APP;
    component.filterProjectsByCategory(category);
    expect(component.selectedCategory()).toBe(category);
  });

  it('should return all projects when no category selected', () => {
    component.selectedCategory.set('');
    const filtered = component.filteredProjects();
    expect(filtered).toEqual(mockProjects);
  });

  it('should filter projects when category is selected', () => {
    const category = ProjectCategory.APP;
    component.selectedCategory.set(category);
    const filtered = component.filteredProjects();
    const expected = mockProjects.filter((p) => p.category === category);
    expect(filtered).toEqual(expected);
  });

  it('should reshape projects into readable card views without internal ids', () => {
    const [firstCard] = component.projectCards();

    expect(firstCard.title).toBe('// Portfolio 2025');
    expect(firstCard.jsonObject).toEqual({
      date: 'Janvier 2025 - présent',
      name: 'Portfolio 2025',
      company: 'Perso',
      category: ProjectCategory.WEBSITE,
      type: 'PERSO',
      status: 'IN_PROGRESS',
      description: 'desc',
      skills: ['Angular'],
      links: [{ label: 'Site', url: 'http://example.com' }],
    });
  });

  it('should append a Preview link when a project has a preview image', () => {
    const [, grpCard] = component.projectCards();

    expect(grpCard.jsonObject.links).toEqual([
      { label: 'Preview', url: 'http://localhost:3000/media/grp.jpg' },
    ]);
  });

  it('should expose category filters as keyboard-operable toggle buttons', () => {
    const firstFilter = fixture.debugElement.query(
      (debugEl) => debugEl.attributes['role'] === 'button',
    );

    expect(firstFilter.nativeElement.tabIndex).toBe(0);
    expect(firstFilter.nativeElement.getAttribute('aria-pressed')).toBe('false');

    firstFilter.nativeElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
    fixture.detectChanges();

    expect(component.selectedCategory()).not.toBe('');
    expect(firstFilter.nativeElement.getAttribute('aria-pressed')).toBe('true');
  });

  describe('Admin editing', () => {
    it('should not show edit pencils when not connected', () => {
      expect(fixture.debugElement.query((el) => el.name === 'edit-button')).toBeFalsy();
    });

    it('should switch to the admin endpoint once connected', async () => {
      adminSignal.set({ email: 'admin@example.com' });
      fixture.detectChanges();

      httpMock.expectOne(`${environment.apiBaseUrl}/v1/admin/projects`).flush(mockProjects);
      await fixture.whenStable();

      expect(fixture.debugElement.query((el) => el.name === 'edit-button')).toBeTruthy();
    });

    it('should resolve the project being edited by id, or null for a new one', () => {
      component['editingId'].set('1');
      expect(component['editingProject']()).toEqual(mockProjects[0]);

      component['editingId'].set('new');
      expect(component['editingProject']()).toBeNull();
    });

    it('should close the modal and reload on save or delete', () => {
      const reloadSpy = vi.spyOn(component['projects'], 'reload');
      component['editingId'].set('1');

      component['onSaved']();
      expect(component['editingId']()).toBeNull();
      expect(reloadSpy).toHaveBeenCalledTimes(1);

      component['editingId'].set('1');
      component['onDeleted']();
      expect(component['editingId']()).toBeNull();
      expect(reloadSpy).toHaveBeenCalledTimes(2);
    });
  });
});
