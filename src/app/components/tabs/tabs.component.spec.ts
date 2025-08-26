import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { TabsComponent } from './tabs.component';
import { TabsService } from '@services/tabs.service';
import { Tab } from '@models/tab.model';
import { TabKey } from '@enums/tab-key.enum';
import { signal } from '@angular/core';

describe('TabsComponent', () => {
  let component: TabsComponent;
  let fixture: ComponentFixture<TabsComponent>;
  let router: jasmine.SpyObj<Router>;
  let tabsService: jasmine.SpyObj<TabsService>;

  const mockTabs: Tab[] = [
    { key: TabKey.HOME, route: ['/'], label: 'Home' },
    { key: TabKey.PROJECTS, route: ['/settings'], label: 'Settings' },
    { key: TabKey.PROFILE, route: ['/profile'], label: 'Profile' }
  ] as Tab[];

  beforeEach(async () => {
    router = jasmine.createSpyObj('Router', ['navigate']);
    router.navigate.and.returnValue(Promise.resolve(true));

    tabsService = jasmine.createSpyObj('TabsService', ['tabs'], {
      tabs: signal(mockTabs)
    });

    await TestBed.configureTestingModule({
      imports: [TabsComponent],
      providers: [
        { provide: Router, useValue: router },
        { provide: TabsService, useValue: tabsService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with tabs from TabsService', () => {
    expect(component.tabs()).toEqual(mockTabs);
  });

  describe('removeTab', () => {
    it('should prevent default and stop propagation when event is provided', () => {
      const event = jasmine.createSpyObj('Event', ['preventDefault', 'stopPropagation']);
      const tab = mockTabs[1];

      component.removeTab(tab, event);

      expect(event.preventDefault).toHaveBeenCalled();
      expect(event.stopPropagation).toHaveBeenCalled();
    });


    it('should remove tab and update tabs list', () => {
      const tabToRemove = mockTabs[1];
      const expectedTabs = [mockTabs[0], mockTabs[2]];

      component.removeTab(tabToRemove);

      expect(tabsService.tabs()).toEqual(expectedTabs);
    });

    it('should navigate to previous tab when available', () => {
      const tab = mockTabs[1];

      component.removeTab(tab);

      expect(router.navigate).toHaveBeenCalledWith(mockTabs[0].route);
    });

    it('should navigate to next tab when previous is not available', () => {
      const tab = mockTabs[0];

      component.removeTab(tab);

      expect(router.navigate).toHaveBeenCalledWith(mockTabs[1].route);
    });
  });
});
