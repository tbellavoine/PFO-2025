import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, ParamMap, provideRouter, Router } from '@angular/router';
import { TabsComponent } from './tabs.component';
import { TabsService } from '@services/tabs.service';
import { Tab } from '@models/tab.model';
import { TabKey } from '@enums/tab-key.enum';
import { signal } from '@angular/core';
import { BehaviorSubject, of } from 'rxjs';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { FontAwesomeTestingModule } from '@fortawesome/angular-fontawesome/testing';

describe('TabsComponent', () => {
  let component: TabsComponent;
  let fixture: ComponentFixture<TabsComponent>;
  let router: jasmine.SpyObj<Router>;
  let tabsService: jasmine.SpyObj<TabsService>;

  const mockTabs: Tab[] = [
    { key: TabKey.HOME, route: ['/'], label: 'Home' },
    { key: TabKey.PROJECTS, route: ['/settings'], label: 'Settings' }
  ] as Tab[];
  const paramMapSubject = new BehaviorSubject<ParamMap>({
    get: (key: string) => 'test-image',
    getAll: () => [],
    has: () => true,
    keys: [] as string[]
  });
  const mockActivatedRoute = {
    paramMap: paramMapSubject.asObservable(),
    snapshot: {
      params: { imageName: 'test-image' }
    }
  };
  beforeEach(async () => {
    router = jasmine.createSpyObj('Router', ['navigate']);
    tabsService = jasmine.createSpyObj('TabsService', [], {
      tabs: signal(mockTabs)
    });

    await TestBed.configureTestingModule({
      imports: [TabsComponent,FontAwesomeTestingModule,TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useValue: {
            getTranslation: (lang: string) => of({}) // Retourne un Observable vide
          }
        }
      })],
      providers: [
        provideRouter([]),
        { provide: TabsService, useValue: tabsService },
        { provide: ActivatedRoute, useValue: mockActivatedRoute }      ]
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
    it('should prevent event propagation', () => {
      const event = jasmine.createSpyObj('Event', ['preventDefault', 'stopPropagation']);
      component.removeTab(mockTabs[1], event);
      expect(event.preventDefault).toHaveBeenCalled();
      expect(event.stopPropagation).toHaveBeenCalled();
    });

    it('should remove a tab', () => {
      component.removeTab(mockTabs[1]);
      expect(tabsService.tabs()).toEqual([mockTabs[0]]);
    });
  });
});
