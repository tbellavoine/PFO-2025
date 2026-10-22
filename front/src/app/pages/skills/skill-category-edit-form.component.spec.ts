import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { SkillCategoryEditFormComponent } from './skill-category-edit-form.component';
import { SkillApiModel, SkillCategoryEntryApiModel } from '@models/api/skill-catalog.model';
import { environment } from '../../../environments/environment';

describe('SkillCategoryEditFormComponent', () => {
  let component: SkillCategoryEditFormComponent;
  let fixture: ComponentFixture<SkillCategoryEditFormComponent>;
  let httpMock: HttpTestingController;

  const mockSkills: SkillApiModel[] = [{ id: 's1', name: 'Angular', slug: 'angular' }];
  const mockEntries: SkillCategoryEntryApiModel[] = [
    {
      id: 'e1',
      skill: { id: 's1', name: 'Angular', slug: 'angular' },
      category: { id: 'c1', key: 'front_end', label: 'Front End', order: 0 },
      level: '✓',
      order: 0,
    },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SkillCategoryEditFormComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });

    httpMock = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(SkillCategoryEditFormComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('categoryId', 'c1');
    fixture.componentRef.setInput('categoryLabel', 'Front End');
    fixture.detectChanges();

    httpMock.expectOne(`${environment.apiBaseUrl}/v1/admin/skills`).flush(mockSkills);
    httpMock.expectOne(`${environment.apiBaseUrl}/v1/admin/skills/categories/c1/entries`).flush(mockEntries);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create and expose entries and the skill catalog', () => {
    expect(component).toBeTruthy();
    expect(component['entriesResource'].value()).toEqual(mockEntries);
    expect(component['skillsResource'].value()).toEqual(mockSkills);
  });

  it('should upsert an entry and reload', () => {
    component['entrySkillId'].set('s1');
    component['entryLevel'].set('~' as never);
    component['entryOrder'].set(2);

    component['upsertEntry']();

    const req = httpMock.expectOne(`${environment.apiBaseUrl}/v1/admin/skills/categories/c1/entries`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual({ skillId: 's1', level: '~', order: 2 });
    req.flush(mockEntries[0]);
    fixture.detectChanges();

    httpMock.expectOne(`${environment.apiBaseUrl}/v1/admin/skills/categories/c1/entries`).flush(mockEntries);
    expect(component['entrySkillId']()).toBe('');
  });

  it('should delete an entry and reload', () => {
    component['deleteEntry']('s1');

    httpMock.expectOne(`${environment.apiBaseUrl}/v1/admin/skills/categories/c1/entries/s1`).flush(null);
    fixture.detectChanges();
    httpMock.expectOne(`${environment.apiBaseUrl}/v1/admin/skills/categories/c1/entries`).flush(mockEntries);
  });

  it('should create a new catalog skill and select it', () => {
    component['newSkillName'].set('Vue');

    component['createSkill']();

    const req = httpMock.expectOne(`${environment.apiBaseUrl}/v1/admin/skills`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ name: 'Vue' });
    req.flush({ id: 's2', name: 'Vue', slug: 'vue' });
    fixture.detectChanges();

    httpMock.expectOne(`${environment.apiBaseUrl}/v1/admin/skills`).flush([...mockSkills, { id: 's2', name: 'Vue', slug: 'vue' }]);

    expect(component['newSkillName']()).toBe('');
    expect(component['entrySkillId']()).toBe('s2');
  });

  it('should emit closed', () => {
    const closedSpy = vi.fn();
    component.closed.subscribe(closedSpy);

    component['closed'].emit();

    expect(closedSpy).toHaveBeenCalled();
  });
});
