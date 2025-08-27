import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProjectsComponent } from './projects.component';
import { TabsService } from '@services/tabs.service';
import { TabKey } from '@enums/tab-key.enum';
import { ProjectCategory } from '@enums/project-category.enum';

describe('ProjectsComponent', () => {
  let component: ProjectsComponent;
  let fixture: ComponentFixture<ProjectsComponent>;
  let mockTabsService: jasmine.SpyObj<TabsService>;

  beforeEach(async () => {
    mockTabsService = jasmine.createSpyObj('TabsService', ['addTab']);

    await TestBed.configureTestingModule({
      imports: [ProjectsComponent],
      providers: [
        { provide: TabsService, useValue: mockTabsService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProjectsComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with empty selected category', () => {
    expect(component.selectedCategory()).toBe('');
  });

  it('should add tab on init', () => {
    component.ngOnInit();
    expect(mockTabsService.addTab).toHaveBeenCalledWith(
      jasmine.objectContaining({
        key: TabKey.PROJECTS
      })
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
    expect(filtered).toEqual(component.projects);
  });

  it('should filter projects when category is selected', () => {
    const category = ProjectCategory.APP;
    component.selectedCategory.set(category);
    const filtered = component.filteredProjects();
    const expected = component.projects.filter(p => p.category === category);
    expect(filtered).toEqual(expected);
  });
});
