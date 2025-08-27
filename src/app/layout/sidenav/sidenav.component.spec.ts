import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SidenavComponent } from './sidenav.component';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';
import { MenuKey } from '@enums/menu-key.enum';
import { Component } from '@angular/core';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { FontAwesomeTestingModule } from '@fortawesome/angular-fontawesome/testing';

@Component({
  selector: 'app-explorer',
  template: '<div>Mock Explorer</div>',
  standalone: true
})
class MockExplorerComponent {}

describe('SidenavComponent', () => {
  let component: SidenavComponent;
  let fixture: ComponentFixture<SidenavComponent>;
  let router: jasmine.SpyObj<Router>;
  let routerEvents: Subject<NavigationEnd>;

  beforeEach(async () => {
    routerEvents = new Subject<NavigationEnd>();
    router = jasmine.createSpyObj('Router', ['navigate'], {
      events: routerEvents.asObservable(),
      createUrlTree: () => ({} as any),
      serializeUrl : () => ({} as any),
    });

    await TestBed.configureTestingModule({
      imports: [SidenavComponent, MockExplorerComponent,FontAwesomeTestingModule,TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useValue: {
            getTranslation: (lang: string) => of({}) // Retourne un Observable vide
          }
        }
      })],
      providers: [
        { provide: Router, useValue: router },
        { provide: ActivatedRoute, useValue: {} }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SidenavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Initial state', () => {
    it('should initialize with explorer closed', () => {
      expect(component['isExplorerOpen']()).toBeFalse();
    });
  });

  describe('Explorer panel', () => {
    it('should toggle explorer panel when EXPLORER menu item is clicked', () => {
      component['isExplorerOpen'].set(false);
      component['toogleExplorer'](MenuKey.EXPLORER);
      expect(component['isExplorerOpen']()).toBeTrue();

      component['toogleExplorer'](MenuKey.EXPLORER);
      expect(component['isExplorerOpen']()).toBeFalse();
    });

    it('should close explorer panel when non-EXPLORER menu item is clicked', () => {
      component['isExplorerOpen'].set(true);
      component['toogleExplorer'](MenuKey.PROFILE);
      expect(component['isExplorerOpen']()).toBeFalse();
    });
  });

  describe('Mobile behavior', () => {
    it('should close panel on mobile when closePanel is called', () => {
      spyOnProperty(window, 'innerWidth').and.returnValue(767);
      component['checkMobile']();
      component['isExplorerOpen'].set(true);
      component['closePanel']();
      expect(component['isExplorerOpen']()).toBeFalse();
    });

    it('should close explorer on navigation in mobile view', () => {
      spyOnProperty(window, 'innerWidth').and.returnValue(767);
      component['checkMobile']();
      component['isExplorerOpen'].set(true);

      routerEvents.next(new NavigationEnd(1, 'test', 'test'));
      expect(component['isExplorerOpen']()).toBeFalse();
    });

    it('should not close explorer on navigation in desktop view', () => {
      spyOnProperty(window, 'innerWidth').and.returnValue(1024);
      component['checkMobile']();
      component['isExplorerOpen'].set(true);

      routerEvents.next(new NavigationEnd(1, 'test', 'test'));
      expect(component['isExplorerOpen']()).toBeTrue();
    });
  });
});
