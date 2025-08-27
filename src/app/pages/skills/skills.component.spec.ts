import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SkillsComponent } from './skills.component';
import { TabsService } from '@services/tabs.service';
import { TabKey } from '@enums/tab-key.enum';

describe('SkillsComponent', () => {
  let component: SkillsComponent;
  let fixture: ComponentFixture<SkillsComponent>;
  let mockTabsService: jasmine.SpyObj<TabsService>;

  beforeEach(async () => {
    mockTabsService = jasmine.createSpyObj('TabsService', ['addTab']);

    await TestBed.configureTestingModule({
      imports: [SkillsComponent],
      providers: [
        { provide: TabsService, useValue: mockTabsService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SkillsComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize all skill objects on ngOnInit', () => {
    component.ngOnInit();

    expect(component.frontObject()).toBeTruthy();
    expect(component.backObject()).toBeTruthy();
    expect(component.uxUiObject()).toBeTruthy();
    expect(component.devOpsObject()).toBeTruthy();
    expect(component.toolsObject()).toBeTruthy();
    expect(component.qualityObject()).toBeTruthy();
  });

  it('should add skills tab on init', () => {
    component.ngOnInit();

    expect(mockTabsService.addTab).toHaveBeenCalledWith(
      jasmine.objectContaining({
        key: TabKey.SKILLS
      })
    );
  });

  it('should initialize front skills correctly', () => {
    component.ngOnInit();

    const frontSkills = component.frontObject() as any;
    expect(frontSkills.angular).toBe('✓');
    expect(frontSkills.typescript).toBe('✓');
    expect(frontSkills.javascript).toBe('✓');
  });

  it('should initialize back skills correctly', () => {
    component.ngOnInit();

    const backSkills = component.backObject() as any;
    expect(backSkills.php).toBe('~');
    expect(backSkills.symfony).toBe('~');
    expect(backSkills.phpmyadmin).toBe('✓');
  });

  it('should initialize quality skills correctly', () => {
    component.ngOnInit();

    const qualitySkills = component.qualityObject() as any;
    expect(qualitySkills.sonarqube).toBe('✓');
    expect(qualitySkills.tests.jasmine).toBe('✓');
    expect(qualitySkills.tests.jest).toBe('✓');
  });

  it('should have moreSkills array defined', () => {
    expect(component.moreSkills).toEqual([
      'material-design',
      'responsive-design',
      'seo',
      'wordpress',
      'twig',
      'salesForce-commerce-cloud',
      'office'
    ]);
  });
});
