import type { MockedObject } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { signal } from '@angular/core';
import { FontAwesomeTestingModule } from '@fortawesome/angular-fontawesome/testing';
import { SkillsComponent } from './skills.component';
import { TabsService } from '@services/tabs.service';
import { AuthService } from '@services/auth.service';
import { TabKey } from '@enums/tab-key.enum';
import { SkillCategoryApiModel } from '@models/api/skill-category.model';
import { SkillCategoryEntity } from '@models/api/skill-catalog.model';
import { environment } from '../../../environments/environment';

describe('SkillsComponent', () => {
  let component: SkillsComponent;
  let fixture: ComponentFixture<SkillsComponent>;
  let mockTabsService: MockedObject<TabsService>;
  let httpMock: HttpTestingController;
  let adminSignal: ReturnType<typeof signal<{ email: string } | null>>;

  const mockCategories: SkillCategoryApiModel[] = [
    { key: 'front_end', label: 'Front End', skills: [{ name: 'Angular', level: '✓' }, { name: 'TypeScript', level: '✓' }, { name: 'JavaScript', level: '✓' }] },
    { key: 'back_end', label: 'Back End', skills: [{ name: 'Php', level: '~' }, { name: 'Symfony', level: '~' }, { name: 'Phpmyadmin', level: '✓' }] },
    { key: 'ux_ui', label: 'UX/UI', skills: [{ name: 'Figma', level: '✓' }] },
    { key: 'dev_ops', label: 'DevOps', skills: [{ name: 'Docker', level: '✓' }] },
    { key: 'tools', label: 'Outils', skills: [{ name: 'Jira', level: '✓' }] },
    { key: 'quality', label: 'Qualité', skills: [{ name: 'Sonarqube', level: '✓' }, { name: 'Jasmine', level: '✓' }, { name: 'Jest', level: '✓' }] },
  ];

  beforeEach(() => {
    mockTabsService = {
      addTab: vi.fn().mockName('TabsService.addTab'),
    } as unknown as MockedObject<TabsService>;
    adminSignal = signal(null);

    TestBed.configureTestingModule({
      imports: [SkillsComponent, FontAwesomeTestingModule],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: TabsService, useValue: mockTabsService },
        { provide: AuthService, useValue: { admin: adminSignal } },
      ],
    });

    httpMock = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(SkillsComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
    httpMock.expectOne(`${environment.apiBaseUrl}/v1/skills`).flush(mockCategories);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should expose all skill category objects', () => {
    expect(component.frontObject()).toBeTruthy();
    expect(component.backObject()).toBeTruthy();
    expect(component.uxUiObject()).toBeTruthy();
    expect(component.devOpsObject()).toBeTruthy();
    expect(component.toolsObject()).toBeTruthy();
    expect(component.qualityObject()).toBeTruthy();
  });

  it('should add skills tab on init', () => {
    expect(mockTabsService.addTab).toHaveBeenCalledWith(
      expect.objectContaining({
        key: TabKey.SKILLS,
      }),
    );
  });

  it('should reshape front skills correctly', () => {
    expect(component.frontObject()).toEqual({
      Angular: '✓',
      TypeScript: '✓',
      JavaScript: '✓',
    });
  });

  it('should reshape back skills correctly', () => {
    expect(component.backObject()).toEqual({
      Php: '~',
      Symfony: '~',
      Phpmyadmin: '✓',
    });
  });

  it('should reshape quality skills correctly', () => {
    expect(component.qualityObject()).toEqual({
      Sonarqube: '✓',
      Jasmine: '✓',
      Jest: '✓',
    });
  });

  it('should have moreSkills array defined', () => {
    expect(component.moreSkills).toEqual([
      'material-design',
      'responsive-design',
      'seo',
      'wordpress',
      'twig',
      'salesForce-commerce-cloud',
      'office',
    ]);
  });

  describe('Admin editing', () => {
    const mockCategoryIds: SkillCategoryEntity[] = [
      { id: 'c1', key: 'front_end', label: 'Front End', order: 0 },
    ];

    it('should not show any edit pencil when not connected', () => {
      expect(fixture.debugElement.query((el) => el.name === 'edit-button')).toBeFalsy();
    });

    it('should resolve a category id once connected and fetch admin categories', async () => {
      adminSignal.set({ email: 'admin@example.com' });
      fixture.detectChanges();

      httpMock.expectOne(`${environment.apiBaseUrl}/v1/admin/skills/categories`).flush(mockCategoryIds);
      await fixture.whenStable();

      expect(component['categoryIdFor']('front_end')).toBe('c1');
      expect(component['categoryIdFor']('back_end')).toBeUndefined();
    });

    it('should reload categories when the category editor closes', () => {
      const reloadSpy = vi.spyOn(component['categories'], 'reload');
      component['editingCategoryKey'].set('front_end');

      component['closeCategoryEditor']();

      expect(component['editingCategoryKey']()).toBeNull();
      expect(reloadSpy).toHaveBeenCalled();
    });
  });
});
