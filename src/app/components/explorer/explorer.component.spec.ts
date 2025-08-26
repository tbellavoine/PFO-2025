import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ExplorerComponent } from './explorer.component';
import { ActivatedRoute } from '@angular/router';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { FontAwesomeTestingModule } from '@fortawesome/angular-fontawesome/testing';

describe('ExplorerComponent', () => {
  let component: ExplorerComponent;
  let fixture: ComponentFixture<ExplorerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExplorerComponent, FontAwesomeTestingModule,TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useValue: {
            getTranslation: () => new Promise(resolve => resolve({}))
          }
        }
      })],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: new Map()
            }
          }
        }
      ]
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
    expect(Array.isArray(map)).toBeTrue();
  });

  it('should initialize openCategories with all categories', () => {
    const map = component['explorerMap']();
    const openCategories = component.openCategories();
    const allCategories = map.map(category => category[0]);
    allCategories.forEach(category => {
      expect(openCategories.has(category)).toBeTrue();
    });
  });

  it('toggleCategory should close an open category', () => {
    const map = component['explorerMap']();
    const category = map[0][0];
    component.toggleCategory(category);
    expect(component.openCategories().has(category)).toBeFalse();
  });

  it('toggleCategory should open a closed category', () => {
    const map = component['explorerMap']();
    const category = map[0][0];
    // Close first
    component.toggleCategory(category);
    // Open again
    component.toggleCategory(category);
    expect(component.openCategories().has(category)).toBeTrue();
  });

  it('isCategoryOpen should return true for open category', () => {
    const map = component['explorerMap']();
    const category = map[0][0];
    expect(component.isCategoryOpen(category)).toBeTrue();
  });

  it('isCategoryOpen should return false for closed category', () => {
    const map = component['explorerMap']();
    const category = map[0][0];
    component.toggleCategory(category);
    expect(component.isCategoryOpen(category)).toBeFalse();
  });
});
