import type { Mock, MockedObject } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { Router, NavigationEnd } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { LastPagesService } from './last-pages.service';
import { LocalStorageKey } from '@enums/localstorage-key.enum';

describe('LastPagesService', () => {
  let service: LastPagesService;
  let routerEvents: Subject<NavigationEnd>;
  let mockTranslateService: MockedObject<TranslateService>;
  let localStorageMock: { getItem: Mock; setItem: Mock; removeItem: Mock };

  beforeEach(() => {
    routerEvents = new Subject();

    // Mock Router
    const mockRouter = {
      events: routerEvents.asObservable(),
    };

    // Mock TranslateService
    mockTranslateService = {
      instant: vi.fn().mockName('TranslateService.instant'),
    } as unknown as MockedObject<TranslateService>;
    mockTranslateService.instant.mockReturnValue('Error message');

    // Mock localStorage
    localStorageMock = {
      getItem: vi.fn().mockName('localStorage.getItem'),
      setItem: vi.fn().mockName('localStorage.setItem'),
      removeItem: vi.fn().mockName('localStorage.removeItem'),
    };
    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
      configurable: true,
    });

    TestBed.configureTestingModule({
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: TranslateService, useValue: mockTranslateService },
      ],
    });
  });

  describe('Service Creation', () => {
    it('should create service', () => {
      localStorageMock.getItem.mockReturnValue(null);

      service = TestBed.inject(LastPagesService);

      expect(service).toBeTruthy();
      expect(service.lastPages()).toEqual([]);
    });

    it('should load pages from localStorage', () => {
      const savedPages = ['page1', 'page2'];
      localStorageMock.getItem.mockReturnValue(JSON.stringify(savedPages));

      service = TestBed.inject(LastPagesService);

      expect(service.lastPages()).toEqual(savedPages);
    });

    it('should handle localStorage errors', () => {
      localStorageMock.getItem.mockReturnValue('invalid-json');
      vi.spyOn(console, 'warn').mockReturnValue(undefined);

      service = TestBed.inject(LastPagesService);

      expect(console.warn).toHaveBeenCalled();
      expect(service.lastPages()).toEqual([]);
    });
  });

  describe('Navigation Tracking', () => {
    beforeEach(() => {
      localStorageMock.getItem.mockReturnValue(null);
      service = TestBed.inject(LastPagesService);
    });

    it('should add page on navigation', () => {
      const navigationEvent = new NavigationEnd(1, '/test', '/test');

      routerEvents.next(navigationEvent);

      expect(service.lastPages()).toEqual(['/test']);
    });

    it('should ignore root navigation', () => {
      const navigationEvent = new NavigationEnd(1, '/', '/');

      routerEvents.next(navigationEvent);

      expect(service.lastPages()).toEqual([]);
    });

    it('should add multiple pages', () => {
      routerEvents.next(new NavigationEnd(1, '/page1', '/page1'));
      routerEvents.next(new NavigationEnd(2, '/page2', '/page2'));

      expect(service.lastPages()).toEqual(['/page2', '/page1']);
    });

    it('should not duplicate same page', () => {
      routerEvents.next(new NavigationEnd(1, '/same', '/same'));
      routerEvents.next(new NavigationEnd(2, '/same', '/same'));

      expect(service.lastPages()).toEqual(['/same']);
    });

    it('should limit to 4 pages', () => {
      for (let i = 1; i <= 6; i++) {
        routerEvents.next(new NavigationEnd(i, `/page${i}`, `/page${i}`));
      }

      expect(service.lastPages().length).toBe(4);
      expect(service.lastPages()).toEqual(['/page6', '/page5', '/page4', '/page3']);
    });
  });

  describe('Storage Operations', () => {
    beforeEach(() => {
      localStorageMock.getItem.mockReturnValue(null);
      service = TestBed.inject(LastPagesService);
    });

    it('should save to localStorage when adding page', () => {
      const navigationEvent = new NavigationEnd(1, '/test', '/test');

      routerEvents.next(navigationEvent);

      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        LocalStorageKey.LAST_PAGES,
        JSON.stringify(['/test']),
      );
    });

    it('should handle save errors', () => {
      localStorageMock.setItem.mockImplementation(() => {
        throw new Error('Storage full');
      });
      vi.spyOn(console, 'warn').mockReturnValue(undefined);

      routerEvents.next(new NavigationEnd(1, '/test', '/test'));

      expect(console.warn).toHaveBeenCalled();
      expect(service.lastPages()).toEqual(['/test']); // Signal should still update
    });

    it('should clear history', () => {
      // Add some pages first
      routerEvents.next(new NavigationEnd(1, '/page1', '/page1'));
      expect(service.lastPages()).toEqual(['/page1']);

      service.clearHistory();

      expect(service.lastPages()).toEqual([]);
      expect(localStorageMock.removeItem).toHaveBeenCalledWith(LocalStorageKey.LAST_PAGES);
    });
  });

  describe('Signal Behavior', () => {
    beforeEach(() => {
      localStorageMock.getItem.mockReturnValue(null);
      service = TestBed.inject(LastPagesService);
    });

    it('should return computed signal', () => {
      const pages1 = service.lastPages();
      const pages2 = service.lastPages();

      expect(pages1).toBe(pages2); // Same reference
    });

    it('should update signal when pages change', () => {
      const initialPages = service.lastPages();

      routerEvents.next(new NavigationEnd(1, '/new', '/new'));

      const updatedPages = service.lastPages();
      expect(updatedPages).not.toBe(initialPages);
      expect(updatedPages).toEqual(['/new']);
    });
  });
});
