import { Component, signal } from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { NgClass } from '@angular/common';
import { ClickOutsideDirective } from '@directive/click-outside.directive';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'status-bar',
  imports: [
    FaIconComponent,
    NgClass,
    ClickOutsideDirective,
    TranslatePipe
  ],
  templateUrl: './status-bar.component.html'
})
export class StatusBarComponent {
  protected isGitbranchOpen = signal<boolean>(false);
  protected isAlertOpen = signal<boolean>(false);

  /**
   * Toggle the git branch dropdown
   * @protected
   */
  protected toggleGitBranch(): void {
    this.isGitbranchOpen.update((isOpen) => !isOpen);
    this.isAlertOpen.set(false);
  }

  /**
   * Toggle the alert dropdown
   * @protected
   */
  protected toggleAlert(): void {
    this.isAlertOpen.update((isOpen) => !isOpen);
    this.isGitbranchOpen.set(false);
  }

  /**
   * Close the git branch dropdown
   * @protected
   */
  protected closeGitBranch(): void {
    this.isGitbranchOpen.set(false);
  }

  /**
   * Close the alert dropdown
   * @protected
   */
  protected closeAlert(): void {
    this.isAlertOpen.set(false);
  }
}
