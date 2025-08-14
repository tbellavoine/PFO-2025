import { Component } from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { NgClass } from '@angular/common';

@Component({
  selector: 'status-bar',
  imports: [
    FaIconComponent,
    NgClass
  ],
  templateUrl: './status-bar.component.html'
})
export class StatusBarComponent {
  protected isGitbranchOpen: boolean = false;
  protected isAlertOpen: boolean = false;

  protected toggleGitBranch(): void {
    this.isGitbranchOpen = !this.isGitbranchOpen;
    this.isAlertOpen = false;
  }

  protected toggleAlert(): void {
    this.isAlertOpen = !this.isAlertOpen;
    this.isGitbranchOpen = false;
  }
}
