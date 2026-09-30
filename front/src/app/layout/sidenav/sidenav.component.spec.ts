import type { MockedObject } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SidenavComponent } from './sidenav.component';
import { Router, NavigationEnd, ActivatedRoute, UrlTree } from '@angular/router';
import { Subject } from 'rxjs';
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
      createUrlTree: () => ({}) as unknown as UrlTree,
      serializeUrl: () => ({}) as unknown as string,
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

    it('should update mobile state on window resize', () => {
      vi.spyOn(window, 'innerWidth', 'get').mockReturnValue(767);
      window.dispatchEvent(new Event('resize'));
      expect(component.isMobile()).toBe(true);
    });

    it('should stop listening to window resize and router events after destroy', () => {
      vi.spyOn(window, 'innerWidth', 'get').mockReturnValue(767);
      component['checkMobile']();
      fixture.destroy();

      component['isExplorerOpen'].set(true);
      routerEvents.next(new NavigationEnd(1, 'test', 'test'));
      expect(component['isExplorerOpen']()).toBe(true);

      vi.spyOn(window, 'innerWidth', 'get').mockReturnValue(1024);
      window.dispatchEvent(new Event('resize'));
      expect(component.isMobile()).toBe(true);
    });
  });

  describe('Keyboard accessibility', () => {
    it('should expose the explorer toggle as a keyboard-operable button with a label', () => {
      const toggle = fixture.debugElement.query((debugEl) => debugEl.classes['explorer-toggle']);
      expect(toggle.nativeElement.getAttribute('role')).toBe('button');
      expect(toggle.nativeElement.tabIndex).toBe(0);
      expect(toggle.nativeElement.getAttribute('aria-label')).toBeTruthy();

      toggle.nativeElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
      expect(component['isExplorerOpen']()).toBe(true);
    });
  });
});
