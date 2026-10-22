import type { MockedObject } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { signal } from '@angular/core';
import { FontAwesomeTestingModule } from '@fortawesome/angular-fontawesome/testing';
import { ContactComponent } from './contact.component';
import { TabsService } from '@services/tabs.service';
import { AuthService } from '@services/auth.service';
import { Tab } from '@models/tab.model';
import { TabKey } from '@enums/tab-key.enum';
import { environment } from '../../../environments/environment';

describe('ContactComponent', () => {
  let component: ContactComponent;
  let fixture: ComponentFixture<ContactComponent>;
  let mockTabsService: MockedObject<TabsService>;
  let httpMock: HttpTestingController;
  let adminSignal: ReturnType<typeof signal<{ email: string } | null>>;

  const mockContact = {
    id: '1',
    site: 'http://example.com',
    email: 'mailto:test@example.com',
    linkedin: 'https://linkedin.com/in/test',
  };

  beforeEach(() => {
    mockTabsService = {
      addTab: vi.fn().mockName('TabsService.addTab'),
    } as unknown as MockedObject<TabsService>;
    adminSignal = signal(null);

    TestBed.configureTestingModule({
      imports: [ContactComponent, FontAwesomeTestingModule],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: TabsService, useValue: mockTabsService },
        { provide: AuthService, useValue: { admin: adminSignal } },
      ],
    });

    httpMock = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(ContactComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
    httpMock.expectOne(`${environment.apiBaseUrl}/v1/contact`).flush(mockContact);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('Component Creation', () => {
    it('should create component', () => {
      expect(component).toBeTruthy();
    });

    it('should have host class configured', () => {
      const hostElement = fixture.debugElement.nativeElement;
      expect(hostElement.classList.contains('w-full')).toBe(true);
    });
  });

  describe('Tab Configuration', () => {
    it('should create contact tab with correct properties', () => {
      const contactTab = component['contactTab'];

      expect(contactTab).toBeInstanceOf(Tab);
      expect(contactTab.key).toBe(TabKey.CONTACT);
      expect(contactTab.icon).toEqual(['fas', 'envelope']);
      expect(contactTab.label).toBe('EXPLORER.CONTACT_FILE');
    });
  });

  describe('OnInit Lifecycle', () => {
    it('should call addTab on TabsService during ngOnInit', () => {
      expect(mockTabsService.addTab).toHaveBeenCalledTimes(1);
      expect(mockTabsService.addTab).toHaveBeenCalledWith(component['contactTab']);
    });
  });

  describe('Contact data', () => {
    it('fetches and exposes the contact info from the API', () => {
      expect(component['contact'].value()).toEqual(mockContact);
    });
  });

  describe('Admin editing', () => {
    it('should not show the edit pencil when not connected', () => {
      fixture.detectChanges();
      expect(fixture.debugElement.query((el) => el.name === 'edit-button')).toBeFalsy();
    });

    it('should show the edit pencil when connected', () => {
      adminSignal.set({ email: 'admin@example.com' });
      fixture.detectChanges();
      expect(fixture.debugElement.query((el) => el.name === 'edit-button')).toBeTruthy();
    });

    it('should close the modal and reload contact data on save', () => {
      const reloadSpy = vi.spyOn(component['contact'], 'reload');
      component['editing'].set(true);

      component['onSaved']();

      expect(component['editing']()).toBe(false);
      expect(reloadSpy).toHaveBeenCalled();
    });
  });
});
