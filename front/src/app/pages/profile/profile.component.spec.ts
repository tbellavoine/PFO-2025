import type { MockedObject } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { ProfileComponent } from './profile.component';
import { FontAwesomeTestingModule } from '@fortawesome/angular-fontawesome/testing';
import { TabsService } from '@services/tabs.service';
import { ProfileApiModel } from '@models/api/profile.model';
import { environment } from '../../../environments/environment';

describe('ProfileComponent', () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;
  let tabsService: MockedObject<TabsService>;
  let httpMock: HttpTestingController;

  const mockProfile: ProfileApiModel = {
    id: '1',
    name: 'Thomas BELLAVOINE',
    title: 'Développeur frontend Angular',
    bioParagraphs: ['Salut, moi c’est Thomas 👋'],
    softSkills: ['teamwork', 'proactive', 'adaptability', 'creativity', 'critical thinking', 'autonomy'],
    cvUrl: '/assets/pdf/CV-Thomas-BELLAVOINE.pdf',
  };

  beforeEach(() => {
    tabsService = {
      addTab: vi.fn().mockName('TabsService.addTab'),
    } as unknown as MockedObject<TabsService>;

    TestBed.configureTestingModule({
      imports: [ProfileComponent, FontAwesomeTestingModule],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: TabsService, useValue: tabsService },
      ],
    });

    httpMock = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
    httpMock.expectOne(`${environment.apiBaseUrl}/v1/profile`).flush(mockProfile);
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
    vi.restoreAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should reshape soft skills into a display object', () => {
    expect(component.softSkillsObject()).toEqual({
      teamwork: '✓',
      proactive: '✓',
      adaptability: '✓',
      creativity: '✓',
      'critical thinking': '✓',
      autonomy: '✓',
    });
  });

  it('should open CV in new tab', () => {
    const mockLink = {
      href: '',
      target: '',
      click: vi.fn().mockName('click'),
    } as unknown as HTMLAnchorElement;
    vi.spyOn(document, 'createElement').mockReturnValue(mockLink);

    component.openCV();

    expect(document.createElement).toHaveBeenCalledWith('a');
    expect(mockLink.href).toBe('/assets/pdf/CV-Thomas-BELLAVOINE.pdf');
    expect(mockLink.target).toBe('_blank');
    expect(mockLink.click).toHaveBeenCalled();
  });

  it('should open the CV from the keyboard', () => {
    fixture.detectChanges();

    const mockLink = {
      href: '',
      target: '',
      click: vi.fn().mockName('click'),
    } as unknown as HTMLAnchorElement;
    vi.spyOn(document, 'createElement').mockReturnValue(mockLink);

    const cvTrigger = fixture.debugElement.query(
      (debugEl) => debugEl.attributes['role'] === 'button',
    );
    expect(cvTrigger.nativeElement.tabIndex).toBe(0);

    cvTrigger.nativeElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

    expect(mockLink.click).toHaveBeenCalled();
  });

  describe('Admin editing', () => {
    it('should not show the edit pencil when not connected', () => {
      expect(fixture.debugElement.query((el) => el.name === 'edit-button')).toBeFalsy();
    });

    it('should close the modal and reload profile data on save', () => {
      const reloadSpy = vi.spyOn(component['profile'], 'reload');
      component['editing'].set(true);

      component['onSaved']();

      expect(component['editing']()).toBe(false);
      expect(reloadSpy).toHaveBeenCalled();
    });
  });
});
