import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeComponent } from './home.component';
import { TabsService } from '@services/tabs.service';
import { LastPagesService } from '@services/last-pages.service';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { TranslateLoader, TranslateModule, TranslatePipe } from '@ngx-translate/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Tab } from '@models/tab.model';
import { TabKey } from '@enums/tab-key.enum';
import { StartMenu } from './start-menu.const';
import { AboutMenu } from './about-menu.const';
import { of } from 'rxjs';
import { FontAwesomeTestingModule } from '@fortawesome/angular-fontawesome/testing';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let mockTabsService: jasmine.SpyObj<TabsService>;
  let mockLastPagesService: jasmine.SpyObj<LastPagesService>;
  let mockLastPages: jasmine.Spy;

  beforeEach(() => {
    // Mock LastPagesService
    mockLastPages = jasmine.createSpy('lastPages').and.returnValue(['/contact', '/works']);
    mockLastPagesService = jasmine.createSpyObj('LastPagesService', ['clearHistory'], {
      lastPages: mockLastPages
    });

    // Mock TabsService
    mockTabsService = jasmine.createSpyObj('TabsService', ['addTab']);

    TestBed.configureTestingModule({
      imports: [HomeComponent,FontAwesomeTestingModule,TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useValue: {
            getTranslation: (lang: string) => of({}) // Retourne un Observable vide
          }
        }
      })],
      providers: [
        { provide: TabsService, useValue: mockTabsService },
        { provide: LastPagesService, useValue: mockLastPagesService },
        { provide: FaIconComponent, useValue: {} },
        { provide: TranslatePipe, useValue: {} },
        { provide: RouterLink, useValue: {} },
        { provide: ActivatedRoute, useValue: {} }
      ]
    });

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
  });

  describe('Component Creation', () => {
    it('should create component', () => {
      expect(component).toBeTruthy();
    });

    it('should have host class configured', () => {
      const hostElement = fixture.debugElement.nativeElement;
      expect(hostElement.classList.contains('h-full')).toBe(true);
    });

    it('should expose menu constants', () => {
      expect(component['StartMenu']).toBe(StartMenu);
      expect(component['AboutMenu']).toBe(AboutMenu);
    });

    it('should expose last pages from service', () => {
      expect(component['lastPages']).toBe(mockLastPages);
    });
  });

  describe('Tab Configuration', () => {
    it('should create home tab with correct properties', () => {
      const homeTab = component['contactTab']; // Note: variable mal nommée dans le code original

      expect(homeTab).toBeInstanceOf(Tab);
      expect(homeTab.key).toBe(TabKey.HOME);
      expect(homeTab.icon).toEqual(['fas', 'house-chimney']);
      expect(homeTab.label).toBe('EXPLORER.HOME');
    });
  });

  describe('OnInit Lifecycle', () => {
    it('should call addTab on TabsService during ngOnInit', () => {
      component.ngOnInit();

      expect(mockTabsService.addTab).toHaveBeenCalledTimes(1);
      expect(mockTabsService.addTab).toHaveBeenCalledWith(component['contactTab']);
    });

    it('should add tab with correct Tab instance', () => {
      component.ngOnInit();

      const calledTab = mockTabsService.addTab.calls.first().args[0];
      expect(calledTab).toBeInstanceOf(Tab);
      expect(calledTab.key).toBe(TabKey.HOME);
    });
  });

  describe('getPageName Method', () => {
    it('should return correct translation keys for known URLs', () => {
      expect(component.getPageName('/home')).toBe('MENUS.HOME');
      expect(component.getPageName('/contact')).toBe('MENUS.CONTACT');
      expect(component.getPageName('/works')).toBe('MENUS.WORKS');
      expect(component.getPageName('/about')).toBe('MENUS.ABOUT');
      expect(component.getPageName('/profile')).toBe('MENUS.PROFILE');
    });

    it('should format unknown URLs correctly', () => {
      expect(component.getPageName('/unknown-page')).toBe('unknown page');
      expect(component.getPageName('/test')).toBe('test');
      expect(component.getPageName('/another-test')).toBe('another test');
    });

    it('should handle edge cases', () => {
      expect(component.getPageName('/')).toBe('Page');
      expect(component.getPageName('/single')).toBe('single');
      expect(component.getPageName('')).toBe('Page');
    });
  });

  describe('getPageUrl Method', () => {
    it('should return the same URL passed as parameter', () => {
      expect(component.getPageUrl('/test')).toBe('/test');
      expect(component.getPageUrl('/home')).toBe('/home');
      expect(component.getPageUrl('/contact')).toBe('/contact');
      expect(component.getPageUrl('')).toBe('');
    });
  });

  describe('clearHistory Method', () => {
    it('should call clearHistory on LastPagesService', () => {
      component.clearHistory();

      expect(mockLastPagesService.clearHistory).toHaveBeenCalledTimes(1);
    });

    it('should call clearHistory without parameters', () => {
      component.clearHistory();

      expect(mockLastPagesService.clearHistory).toHaveBeenCalledWith();
    });
  });

  describe('Service Integration', () => {
    it('should inject services correctly', () => {
      expect(component['tabsService']).toBeDefined();
      expect(component['lastPagesService']).toBeDefined();
      expect(component['tabsService']).toBe(mockTabsService);
      expect(component['lastPagesService']).toBe(mockLastPagesService);
    });

    it('should initialize properly when fixture detects changes', () => {
      fixture.detectChanges();

      expect(mockTabsService.addTab).toHaveBeenCalledTimes(1);
    });
  });

  describe('Component Properties', () => {
    it('should have all required properties defined', () => {
      expect(component['StartMenu']).toBeDefined();
      expect(component['AboutMenu']).toBeDefined();
      expect(component['lastPages']).toBeDefined();
      expect(component['contactTab']).toBeDefined();
    });

    it('should expose readonly properties correctly', () => {
      // Verify properties are accessible (simulating template access)
      expect(component['StartMenu']).not.toBeNull();
      expect(component['AboutMenu']).not.toBeNull();
      expect(component['lastPages']).not.toBeNull();
    });
  });

  describe('URL Processing Edge Cases', () => {
    it('should handle special characters in URLs', () => {
      expect(component.getPageName('/test_page')).toBe('test_page');
      expect(component.getPageName('/test.page')).toBe('test.page');
    });

    it('should maintain URL integrity in getPageUrl', () => {
      const complexUrl = '/path/with/query?param=value#hash';
      expect(component.getPageUrl(complexUrl)).toBe(complexUrl);
    });
  });
});
