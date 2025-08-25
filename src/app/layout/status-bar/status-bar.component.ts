import { Component } from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { NgClass } from '@angular/common';
import { ClickOutsideDirective } from '@directive/click-outside.directive';

@Component({
  selector: 'status-bar',
  imports: [
    FaIconComponent,
    NgClass,
    ClickOutsideDirective
  ],
  templateUrl: './status-bar.component.html'
})
export class StatusBarComponent {
  protected isGitbranchOpen: boolean = false;
  protected isAlertOpen: boolean = false;

  /**
   * Toggle the git branch dropdown
   * @protected
   */
  protected toggleGitBranch(): void {
    this.isGitbranchOpen = !this.isGitbranchOpen;
    this.isAlertOpen = false;
  }

  /**
   * Toggle the alert dropdown
   * @protected
   */
  protected toggleAlert(): void {
    this.isAlertOpen = !this.isAlertOpen;
    this.isGitbranchOpen = false;
  }

  /**
   * Close the git branch dropdown
   * @protected
   */
  protected closeGitBranch(): void {
    this.isGitbranchOpen = false;
  }

  /**
   * Close the alert dropdown
   * @protected
   */
  protected closeAlert(): void {
    this.isAlertOpen = false;
  }
}
