import type { MockedObject } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { ProjectsComponent } from './projects.component';
import { TabsService } from '@services/tabs.service';
import { TabKey } from '@enums/tab-key.enum';
import { ProjectCategory } from '@enums/project-category.enum';
import { ProjectApiModel } from '@models/api/project.model';
import { environment } from '../../../environments/environment';

describe('ProjectsComponent', () => {
  let component: ProjectsComponent;
  let fixture: ComponentFixture<ProjectsComponent>;
  let mockTabsService: MockedObject<TabsService>;
  let httpMock: HttpTestingController;

  const mockProjects: ProjectApiModel[] = [
    {
      id: '1',
      date: '2025',
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
      date: '2020 - 2025',
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
    },
  ];

  beforeEach(() => {
    mockTabsService = {
      addTab: vi.fn().mockName('TabsService.addTab'),
    } as unknown as MockedObject<TabsService>;

    TestBed.configureTestingModule({
      imports: [ProjectsComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: TabsService, useValue: mockTabsService },
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
});
