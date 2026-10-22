import type { MockedObject } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { signal } from '@angular/core';
import { FontAwesomeTestingModule } from '@fortawesome/angular-fontawesome/testing';
import { WorksComponent } from './works.component';
import { TabsService } from '@services/tabs.service';
import { AuthService } from '@services/auth.service';
import { TabKey } from '@enums/tab-key.enum';
import { ExperienceApiModel } from '@models/api/experience.model';
import { environment } from '../../../environments/environment';

describe('WorksComponent', () => {
  let component: WorksComponent;
  let fixture: ComponentFixture<WorksComponent>;
  let mockTabsService: MockedObject<TabsService>;
  let httpMock: HttpTestingController;
  let adminSignal: ReturnType<typeof signal<{ email: string } | null>>;

  const mockExperiences: ExperienceApiModel[] = [
    {
      id: '1',
      slug: 'grdf',
      company: 'Web atrio',
      role: 'Développeur Front-End Angular',
      startDate: '2020-10-01',
      endDate: null,
      status: 'En cours',
      order: 0,
      published: true,
      achievements: [
        { id: 'a2', text: 'Second', order: 1 },
        { id: 'a1', text: 'First', order: 0 },
      ],
      skills: [
        { id: 'es1', skill: { id: 's1', name: 'Angular', slug: 'angular' }, category: { id: 'c1', key: 'front_end', label: 'Front End', order: 0 } },
        { id: 'es2', skill: { id: 's2', name: 'TypeScript', slug: 'typescript' }, category: { id: 'c1', key: 'front_end', label: 'Front End', order: 0 } },
        { id: 'es3', skill: { id: 's3', name: 'Symfony', slug: 'symfony' }, category: { id: 'c2', key: 'back_end', label: 'Back End', order: 1 } },
      ],
    },
  ];

  beforeEach(() => {
    mockTabsService = {
      addTab: vi.fn().mockName('TabsService.addTab'),
    } as unknown as MockedObject<TabsService>;
    adminSignal = signal(null);

    TestBed.configureTestingModule({
      imports: [WorksComponent, FontAwesomeTestingModule],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: TabsService, useValue: mockTabsService },
        { provide: AuthService, useValue: { admin: adminSignal } },
      ],
    });

    httpMock = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(WorksComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
    httpMock.expectOne(`${environment.apiBaseUrl}/v1/experiences`).flush(mockExperiences);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should add works tab on init', () => {
    expect(mockTabsService.addTab).toHaveBeenCalledWith(
      expect.objectContaining({
        key: TabKey.WORKS,
      }),
    );
  });

  it('should call addTab exactly once on init', () => {
    expect(mockTabsService.addTab).toHaveBeenCalledTimes(1);
  });

  it('should expose experiences reshaped into card views', () => {
    const [experience] = component.experiences();

    expect(experience.id).toBe('1');
    expect(experience.title).toBe('// Développeur Front-End Angular - Web atrio');
    expect(experience.data.period).toBe('Octobre 2020 - présent');
  });

  it('should group skills by category key', () => {
    const [experience] = component.experiences();

    expect(experience.data.skills).toEqual({
      front_end: ['Angular', 'TypeScript'],
      back_end: ['Symfony'],
    });
  });

  it('should sort achievements by order', () => {
    const [experience] = component.experiences();

    expect(experience.data.achievements).toEqual(['First', 'Second']);
  });

  describe('Admin editing', () => {
    it('should not show edit pencils when not connected', () => {
      expect(fixture.debugElement.query((el) => el.name === 'edit-button')).toBeFalsy();
    });

    it('should switch to the admin endpoint once connected', async () => {
      adminSignal.set({ email: 'admin@example.com' });
      fixture.detectChanges();

      httpMock.expectOne(`${environment.apiBaseUrl}/v1/admin/experiences`).flush(mockExperiences);
      await fixture.whenStable();

      expect(fixture.debugElement.query((el) => el.name === 'edit-button')).toBeTruthy();
    });

    it('should resolve the experience being edited by id, or null for a new one', () => {
      component['editingId'].set('1');
      expect(component['editingExperience']()).toEqual(mockExperiences[0]);

      component['editingId'].set('new');
      expect(component['editingExperience']()).toBeNull();
    });

    it('should close the modal and reload on save or delete', () => {
      const reloadSpy = vi.spyOn(component['experiencesResource'], 'reload');
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
