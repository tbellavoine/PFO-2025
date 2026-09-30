import type { MockedObject } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SidenavComponent } from './sidenav.component';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';
import { MenuKey } from '@enums/menu-key.enum';
import { Component } from '@angular/core';
import { provideTranslateService } from '@ngx-translate/core';
import { FontAwesomeTestingModule } from '@fortawesome/angular-fontawesome/testing';

@Component({
  selector: 'app-explorer',
  template: '<div>Mock Explorer</div>',
  standalone: true,
})
class MockExplorerComponent {}

describe('SidenavComponent', () => {
  let component: SidenavComponent;
  let fixture: ComponentFixture<SidenavComponent>;
  let router: MockedObject<Router>;
  let routerEvents: Subject<NavigationEnd>;

  beforeEach(async () => {
    routerEvents = new Subject<NavigationEnd>();
    router = {
      navigate: vi.fn().mockName('Router.navigate'),
      events: routerEvents.asObservable(),
      createUrlTree: () => ({}) as any,
      serializeUrl: () => ({}) as any,
    } as unknown as MockedObject<Router>;

    await TestBed.configureTestingModule({
      imports: [SidenavComponent, MockExplorerComponent, FontAwesomeTestingModule],
      providers: [
        provideTranslateService(),
        { provide: Router, useValue: router },
        { provide: ActivatedRoute, useValue: {} },
      ],
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
      expect(component['isExplorerOpen']()).toBe(false);
    });
  });

  describe('Explorer panel', () => {
    it('should toggle explorer panel when EXPLORER menu item is clicked', () => {
      component['isExplorerOpen'].set(false);
      component['toogleExplorer'](MenuKey.EXPLORER);
      expect(component['isExplorerOpen']()).toBe(true);

      component['toogleExplorer'](MenuKey.EXPLORER);
      expect(component['isExplorerOpen']()).toBe(false);
    });

    it('should close explorer panel when non-EXPLORER menu item is clicked', () => {
      component['isExplorerOpen'].set(true);
      component['toogleExplorer'](MenuKey.PROFILE);
      expect(component['isExplorerOpen']()).toBe(false);
    });
  });

  describe('Mobile behavior', () => {
    it('should close panel on mobile when closePanel is called', () => {
      vi.spyOn(window, 'innerWidth', 'get').mockReturnValue(767);
      component['checkMobile']();
      component['isExplorerOpen'].set(true);
      component['closePanel']();
      expect(component['isExplorerOpen']()).toBe(false);
    });

    it('should close explorer on navigation in mobile view', () => {
      vi.spyOn(window, 'innerWidth', 'get').mockReturnValue(767);
      component['checkMobile']();
      component['isExplorerOpen'].set(true);

      routerEvents.next(new NavigationEnd(1, 'test', 'test'));
      expect(component['isExplorerOpen']()).toBe(false);
    });

    it('should not close explorer on navigation in desktop view', () => {
      vi.spyOn(window, 'innerWidth', 'get').mockReturnValue(1024);
      component['checkMobile']();
      component['isExplorerOpen'].set(true);

      routerEvents.next(new NavigationEnd(1, 'test', 'test'));
      expect(component['isExplorerOpen']()).toBe(true);
    });
  });
});
