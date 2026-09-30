import type { MockedObject } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProfileComponent } from './profile.component';
import { FontAwesomeTestingModule } from '@fortawesome/angular-fontawesome/testing';
import { TabsService } from '@services/tabs.service';
import { TabKey } from '@enums/tab-key.enum';
import { Tab } from '@models/tab.model';
import { Path } from '@enums/path.enum';

describe('ProfileComponent', () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;
  let tabsService: MockedObject<TabsService>;
  beforeEach(async () => {
    tabsService = {
      addTab: vi.fn().mockName('TabsService.addTab'),
    } as unknown as MockedObject<TabsService>;

    await TestBed.configureTestingModule({
      imports: [ProfileComponent, FontAwesomeTestingModule],
      providers: [{ provide: TabsService, useValue: tabsService }],
    }).compileComponents();

    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize soft skills object on init', () => {
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
});
