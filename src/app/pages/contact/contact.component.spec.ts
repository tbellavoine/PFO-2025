import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ContactComponent } from './contact.component';
import { TabsService } from '@services/tabs.service';
import { JsonCardComponent } from '@components/json-card/json-card.component';
import { Tab } from '@models/tab.model';
import { TabKey } from '@enums/tab-key.enum';
import { Contact } from './constact.const';

describe('ContactComponent', () => {
  let component: ContactComponent;
  let fixture: ComponentFixture<ContactComponent>;
  let mockTabsService: jasmine.SpyObj<TabsService>;

  beforeEach(() => {
    mockTabsService = jasmine.createSpyObj('TabsService', ['addTab']);

    TestBed.configureTestingModule({
      imports: [ContactComponent],
      providers: [
        { provide: TabsService, useValue: mockTabsService },
        { provide: JsonCardComponent, useValue: {} }
      ]
    });

    fixture = TestBed.createComponent(ContactComponent);
    component = fixture.componentInstance;
  });

  describe('Component Creation', () => {
    it('should create component', () => {
      expect(component).toBeTruthy();
    });

    it('should have contact data available', () => {
      expect(component['Contact']).toBe(Contact);
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
      component.ngOnInit();

      expect(mockTabsService.addTab).toHaveBeenCalledTimes(1);
      expect(mockTabsService.addTab).toHaveBeenCalledWith(component['contactTab']);
    });

    it('should add tab with correct Tab instance', () => {
      component.ngOnInit();

      const calledTab = mockTabsService.addTab.calls.first().args[0];
      expect(calledTab).toBeInstanceOf(Tab);
      expect(calledTab.key).toBe(TabKey.CONTACT);
    });
  });

  describe('Component Integration', () => {
    it('should initialize properly when fixture detects changes', () => {
      // Trigger ngOnInit through fixture
      fixture.detectChanges();

      expect(mockTabsService.addTab).toHaveBeenCalledTimes(1);
    });

    it('should not call addTab multiple times on multiple change detections', () => {
      // Multiple change detections
      fixture.detectChanges();
      fixture.detectChanges();
      fixture.detectChanges();

      // addTab should still be called only once (in ngOnInit)
      expect(mockTabsService.addTab).toHaveBeenCalledTimes(1);
    });
  });

  describe('Service Injection', () => {
    it('should inject TabsService correctly', () => {
      expect(component['tabsService']).toBeDefined();
      expect(component['tabsService']).toBe(mockTabsService);
    });
  });

  describe('Contact Data', () => {
    it('should expose Contact constant', () => {
      expect(component['Contact']).toBeDefined();
      expect(component['Contact']).toBe(Contact);
    });

    it('should make Contact available in template', () => {
      // Since Contact is protected readonly, it should be accessible in template
      const contactProperty = component['Contact'];
      expect(contactProperty).not.toBeNull();
      expect(contactProperty).not.toBeUndefined();
    });
  });
});
