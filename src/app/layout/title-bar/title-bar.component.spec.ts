import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateService, TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TitleBarComponent } from './title-bar.component';
import { Menu } from './menu.const';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

describe('TitleBarComponent', () => {
  let component: TitleBarComponent;
  let fixture: ComponentFixture<TitleBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        TitleBarComponent,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useValue: {
              getTranslation: (lang: string) => of({}) // Retourne un Observable vide
            }
          }
        })
      ],
      providers: [{provide: ActivatedRoute, useValue: {}}],
    }).compileComponents();

    fixture = TestBed.createComponent(TitleBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default title', () => {
    expect(component.title()).toBe('Thomas BELLAVOINE - Visual Studio Code');
  });

  it('should update title signal', () => {
    const newTitle = 'New Project - Visual Studio Code';
    component.title.set(newTitle);

    expect(component.title()).toBe(newTitle);
  });

  it('should render without errors', () => {
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
