import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WorksComponent } from './works.component';
import { TabsService } from '@services/tabs.service';
import { TabKey } from '@enums/tab-key.enum';
import { Experiences } from './experiences.const';

describe('WorksComponent', () => {
  let component: WorksComponent;
  let fixture: ComponentFixture<WorksComponent>;
  let mockTabsService: jasmine.SpyObj<TabsService>;

  beforeEach(async () => {
    mockTabsService = jasmine.createSpyObj('TabsService', ['addTab']);

    await TestBed.configureTestingModule({
      imports: [WorksComponent],
      providers: [
        { provide: TabsService, useValue: mockTabsService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(WorksComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have Experiences data available', () => {
    expect(component.Experiences).toBe(Experiences);
    expect(component.Experiences).toBeDefined();
  });

  it('should add works tab on init', () => {
    component.ngOnInit();

    expect(mockTabsService.addTab).toHaveBeenCalledWith(
      jasmine.objectContaining({
        key: TabKey.WORKS
      })
    );
  });

  it('should call addTab exactly once on init', () => {
    component.ngOnInit();

    expect(mockTabsService.addTab).toHaveBeenCalledTimes(1);
  });
});
