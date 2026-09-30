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

  it('should initialize openCategories with all categories', () => {
    const map = component['explorerMap']();
    const openCategories = component.openCategories();
    const allCategories = map.map((category) => category[0]);
    allCategories.forEach((category) => {
      expect(openCategories.has(category)).toBe(true);
    });
  });

  it('toggleCategory should close an open category', () => {
    const map = component['explorerMap']();
    const category = map[0][0];
    component.toggleCategory(category);
    expect(component.openCategories().has(category)).toBe(false);
  });

  it('toggleCategory should open a closed category', () => {
    const map = component['explorerMap']();
    const category = map[0][0];
    // Close first
    component.toggleCategory(category);
    // Open again
    component.toggleCategory(category);
    expect(component.openCategories().has(category)).toBe(true);
  });

  it('isCategoryOpen should return true for open category', () => {
    const map = component['explorerMap']();
    const category = map[0][0];
    expect(component.isCategoryOpen(category)).toBe(true);
  });

  it('isCategoryOpen should return false for closed category', () => {
    const map = component['explorerMap']();
    const category = map[0][0];
    component.toggleCategory(category);
    expect(component.isCategoryOpen(category)).toBe(false);
  });

  it('should render an accordion toggle button reflecting its expanded state', () => {
    const toggleButton = fixture.debugElement.query((debugEl) => debugEl.name === 'button');
    expect(toggleButton).toBeTruthy();
    expect(toggleButton.nativeElement.getAttribute('aria-expanded')).toBe('true');

    toggleButton.nativeElement.click();
    fixture.detectChanges();

    expect(toggleButton.nativeElement.getAttribute('aria-expanded')).toBe('false');
  });
});
