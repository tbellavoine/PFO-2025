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
  let tabsService: jasmine.SpyObj<TabsService>;
  beforeEach(async () => {
    tabsService = jasmine.createSpyObj('TabsService', ['addTab']);

    await TestBed.configureTestingModule({
      imports: [ProfileComponent, FontAwesomeTestingModule],
      providers: [
        { provide: TabsService, useValue: tabsService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
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
      click: jasmine.createSpy('click')
    } as unknown as HTMLAnchorElement;
    spyOn(document, 'createElement').and.returnValue(mockLink);

    component.openCV();

    expect(document.createElement).toHaveBeenCalledWith('a');
    expect(mockLink.href).toBe('/assets/pdf/CV-Thomas-BELLAVOINE.pdf');
    expect(mockLink.target).toBe('_blank');
    expect(mockLink.click).toHaveBeenCalled();
  });
});
