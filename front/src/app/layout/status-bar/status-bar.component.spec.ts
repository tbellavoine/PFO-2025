import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StatusBarComponent } from './status-bar.component';
import { provideTranslateService } from '@ngx-translate/core';
import { FontAwesomeTestingModule } from '@fortawesome/angular-fontawesome/testing';

describe('StatusBarComponent', () => {
  let component: StatusBarComponent;
  let fixture: ComponentFixture<StatusBarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [StatusBarComponent, FontAwesomeTestingModule],
      providers: [provideTranslateService()],
    });

    fixture = TestBed.createComponent(StatusBarComponent);
    component = fixture.componentInstance;
  });

  describe('Component Creation', () => {
    it('should create component', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize with closed dropdowns', () => {
      expect(component['isGitbranchOpen']()).toBe(false);
      expect(component['isAlertOpen']()).toBe(false);
    });
  });

  describe('Git Branch Dropdown', () => {
    it('should toggle git branch dropdown', () => {
      // Initially closed
      expect(component['isGitbranchOpen']()).toBe(false);

      // Open it
      component['toggleGitBranch']();
      expect(component['isGitbranchOpen']()).toBe(true);

      // Close it
      component['toggleGitBranch']();
      expect(component['isGitbranchOpen']()).toBe(false);
    });

    it('should close alert when opening git branch', () => {
      // Set alert as open
      component['isAlertOpen'].set(true);

      component['toggleGitBranch']();

      expect(component['isGitbranchOpen']()).toBe(true);
      expect(component['isAlertOpen']()).toBe(false);
    });

    it('should close git branch dropdown', () => {
      // Open it first
      component['isGitbranchOpen'].set(true);

      component['closeGitBranch']();

      expect(component['isGitbranchOpen']()).toBe(false);
    });
  });

  describe('Alert Dropdown', () => {
    it('should toggle alert dropdown', () => {
      // Initially closed
      expect(component['isAlertOpen']()).toBe(false);

      // Open it
      component['toggleAlert']();
      expect(component['isAlertOpen']()).toBe(true);

      // Close it
      component['toggleAlert']();
      expect(component['isAlertOpen']()).toBe(false);
    });

    it('should close git branch when opening alert', () => {
      // Set git branch as open
      component['isGitbranchOpen'].set(true);

      component['toggleAlert']();

      expect(component['isAlertOpen']()).toBe(true);
      expect(component['isGitbranchOpen']()).toBe(false);
    });

    it('should close alert dropdown', () => {
      // Open it first
      component['isAlertOpen'].set(true);

      component['closeAlert']();

      expect(component['isAlertOpen']()).toBe(false);
    });
  });

  describe('Dropdown Interactions', () => {
    it('should only have one dropdown open at a time', () => {
      // Open git branch
      component['toggleGitBranch']();
      expect(component['isGitbranchOpen']()).toBe(true);
      expect(component['isAlertOpen']()).toBe(false);

      // Open alert (should close git branch)
      component['toggleAlert']();
      expect(component['isGitbranchOpen']()).toBe(false);
      expect(component['isAlertOpen']()).toBe(true);

      // Open git branch (should close alert)
      component['toggleGitBranch']();
      expect(component['isGitbranchOpen']()).toBe(true);
      expect(component['isAlertOpen']()).toBe(false);
    });

    it('should close both dropdowns independently', () => {
      // Open both (one at a time)
      component['toggleGitBranch']();
      component['toggleAlert'](); // This closes git branch and opens alert

      // Close alert
      component['closeAlert']();
      expect(component['isAlertOpen']()).toBe(false);
      expect(component['isGitbranchOpen']()).toBe(false);

      // Open git branch and close it
      component['toggleGitBranch']();
      component['closeGitBranch']();
      expect(component['isGitbranchOpen']()).toBe(false);
    });
  });

  describe('State Management', () => {
    it('should maintain consistent state after multiple toggles', () => {
      // Multiple toggles on git branch
      component['toggleGitBranch'](); // open
      component['toggleGitBranch'](); // close
      component['toggleGitBranch'](); // open
      expect(component['isGitbranchOpen']()).toBe(true);

      // Multiple toggles on alert
      component['toggleAlert'](); // open (closes git branch)
      component['toggleAlert'](); // close
      component['toggleAlert'](); // open
      expect(component['isAlertOpen']()).toBe(true);
      expect(component['isGitbranchOpen']()).toBe(false);
    });

    it('should handle direct close calls on closed dropdowns', () => {
      // Close already closed dropdowns (should not throw errors)
      component['closeGitBranch']();
      component['closeAlert']();

      expect(component['isGitbranchOpen']()).toBe(false);
      expect(component['isAlertOpen']()).toBe(false);
    });
  });

  describe('Keyboard accessibility', () => {
    it('should toggle the git branch dropdown from the keyboard', () => {
      fixture.detectChanges();
      const toggle = fixture.debugElement.query((debugEl) => debugEl.classes['git-branch-toggle']);

      expect(toggle.nativeElement.getAttribute('role')).toBe('button');
      expect(toggle.nativeElement.tabIndex).toBe(0);

      toggle.nativeElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
      expect(component['isGitbranchOpen']()).toBe(true);
    });

    it('should toggle the alert dropdown from the keyboard and expose a label for its icon-only trigger', () => {
      fixture.detectChanges();
      const toggle = fixture.debugElement.query((debugEl) => debugEl.classes['alert-toggle']);

      expect(toggle.nativeElement.getAttribute('role')).toBe('button');
      expect(toggle.nativeElement.tabIndex).toBe(0);
      expect(toggle.nativeElement.getAttribute('aria-label')).toBeTruthy();

      toggle.nativeElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
      expect(component['isAlertOpen']()).toBe(true);
    });
  });
});
