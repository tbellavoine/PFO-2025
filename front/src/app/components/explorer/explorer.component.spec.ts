import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ExplorerComponent } from './explorer.component';
import { ActivatedRoute } from '@angular/router';
import { provideTranslateService } from '@ngx-translate/core';
import { FontAwesomeTestingModule } from '@fortawesome/angular-fontawesome/testing';

describe('ExplorerComponent', () => {
  let component: ExplorerComponent;
  let fixture: ComponentFixture<ExplorerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExplorerComponent, FontAwesomeTestingModule],
      providers: [
        provideTranslateService(),
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: new Map(),
            },
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ExplorerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize explorerMap as an array', () => {
    const map = component['explorerMap']();
    expect(Array.isArray(map)).toBe(true);
  });

  it('should render one accordion trigger button per category, all expanded by default', () => {
    const map = component['explorerMap']();
    const triggers = fixture.debugElement.queryAll((debugEl) => debugEl.name === 'button');

    expect(triggers.length).toBe(map.length);
    triggers.forEach((trigger) => {
      expect(trigger.nativeElement.getAttribute('aria-expanded')).toBe('true');
    });
  });

  it('should collapse a category on click and re-expand it from the keyboard', () => {
    const toggleButton = fixture.debugElement.query((debugEl) => debugEl.name === 'button');

    toggleButton.nativeElement.click();
    fixture.detectChanges();
    expect(toggleButton.nativeElement.getAttribute('aria-expanded')).toBe('false');

    toggleButton.nativeElement.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }),
    );
    fixture.detectChanges();
    expect(toggleButton.nativeElement.getAttribute('aria-expanded')).toBe('true');
  });

  it('should collapse only the toggled category when multiple are expanded', () => {
    const toggleButtons = fixture.debugElement.queryAll((debugEl) => debugEl.name === 'button');
    expect(toggleButtons.length).toBeGreaterThan(1);

    toggleButtons[0].nativeElement.click();
    fixture.detectChanges();

    expect(toggleButtons[0].nativeElement.getAttribute('aria-expanded')).toBe('false');
    expect(toggleButtons[1].nativeElement.getAttribute('aria-expanded')).toBe('true');
  });
});
