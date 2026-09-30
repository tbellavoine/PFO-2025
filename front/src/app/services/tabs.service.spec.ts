import { TestBed } from '@angular/core/testing';

import { TabsService } from './tabs.service';
import { Tab } from '@models/tab.model';

describe('TabsService', () => {
  let service: TabsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TabsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('addTab', () => {
    const tab = new Tab('home', undefined, undefined, 'Home', ['/home']);

    it('should add the tab', () => {
      service.addTab(tab);
      expect(service.tabs()).toEqual([tab]);
    });

    it('should set a new array so that signal consumers are notified', () => {
      const before = service.tabs();
      service.addTab(tab);
      expect(service.tabs()).not.toBe(before);
      expect(before).toEqual([]);
    });

    it('should not add a tab with an existing key', () => {
      service.addTab(tab);
      const before = service.tabs();
      service.addTab(new Tab('home', undefined, undefined, 'Other', ['/other']));
      expect(service.tabs()).toBe(before);
      expect(service.tabs().length).toBe(1);
    });
  });
});
