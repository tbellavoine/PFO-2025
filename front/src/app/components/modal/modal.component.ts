import { Component, HostListener, input, output } from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';

/**
 * Generic dialog shell: backdrop + bordered panel matching the site's dark
 * theme, content projected via <ng-content>. Closes on backdrop click or
 * Escape; the caller owns *whether* it's rendered (an @if around
 * <app-modal>), this component just renders itself and reports close intent.
 */
@Component({
  selector: 'app-modal',
  imports: [FaIconComponent],
  templateUrl: './modal.component.html',
})
export class ModalComponent {
  public readonly title = input<string>();
  public readonly closed = output<void>();

  @HostListener('document:keydown.escape')
  protected onEscape(): void {
    this.closed.emit();
  }

  protected onBackdropClick(): void {
    this.closed.emit();
  }
}
