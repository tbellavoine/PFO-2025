import { ComponentFixture, TestBed } from '@angular/core/testing';
import { JsonCardComponent } from './json-card.component';
import { Router } from '@angular/router';
import { Path } from '@enums/path.enum';

describe('JsonCardComponent', () => {
  let component: JsonCardComponent;
  let fixture: ComponentFixture<JsonCardComponent>;
  let router: Router;

  const mockJsonObject = {
    name: "Test Name",
    age: 25,
    isActive: true,
    website: "https://example.com",
    email: "mailto:test@example.com",
    nullValue: null,
    links: [
      { label: "External", url: "https://external.com" },
      { label: "Internal", url: "internal-path" }
    ]
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JsonCardComponent],
      providers: [
        {
          provide: Router,
          useValue: { navigate: jasmine.createSpy('navigate').and.returnValue(Promise.resolve(true)) }
        }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JsonCardComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
  });

  it('should create', () => {
    Object.assign(component.jsonObject, { value: mockJsonObject });
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  describe('with valid input', () => {
    beforeEach(() => {
      Object.assign(component.jsonObject, { value: mockJsonObject });
      fixture.detectChanges();
    });

    describe('highlightJsonLine', () => {
      it('should highlight property names', () => {
        const result = component.highlightJsonLine('"name": "value"');
        expect(result).toContain('<span class="text-blue-light">"name"</span>');
      });

      it('should highlight http links', () => {
        const result = component.highlightJsonLine('"url": "https://example.com"');
        expect(result).toContain('<a href="https://example.com" target="_blank" rel="noopener noreferrer" class="text-accent cursor-pointer">');
      });

      it('should highlight mailto links', () => {
        const result = component.highlightJsonLine('"email": "mailto:test@example.com"');
        expect(result).toContain('<a href="mailto:test@example.com" target="_blank" class="text-accent cursor-pointer">');
      });

      it('should highlight numbers', () => {
        const result = component.highlightJsonLine('"age": 25');
        expect(result).toContain('<span class="text-green-light">25</span>');
      });

      it('should highlight booleans', () => {
        const result = component.highlightJsonLine('"isActive": true');
        expect(result).toContain('<span class="text-blue">true</span>');
      });

      it('should highlight null values', () => {
        const result = component.highlightJsonLine('"value": null');
        expect(result).toContain('<span class="text-blue">null</span>');
      });

      it('should highlight "active" specially', () => {
        const result = component.highlightJsonLine('"active"');
        expect(result).toContain('<span class="text-green-light font-bold">"active"</span>');
      });
    });

    describe('openUrl', () => {
      it('should open external URLs in new tab', () => {
        spyOn(window, 'open');
        component.openUrl('https://example.com');
        expect(window.open).toHaveBeenCalledWith('https://example.com', '_blank');
      });

      it('should navigate internally for non-http URLs', () => {
        component.openUrl('internal-path');
        expect(router.navigate).toHaveBeenCalledWith([Path.PREVIEW, 'internal-path']);
      });
    });
  });
});
