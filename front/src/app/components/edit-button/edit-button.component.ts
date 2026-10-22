import { Component, output } from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';

/**
 * The pencil affordance shown on every editable block/entity when an admin
 * is connected. The host page decides where to place it and what to open
 * on click (a modal with that block's edit form).
 */
@Component({
  selector: 'edit-button',
  imports: [FaIconComponent],
  template: `
    <button type="button" (click)="edit.emit()"
            class="flex items-center justify-center w-8 h-8 rounded-sm text-light/40 transition-all hover:bg-accent hover:text-light cursor-pointer"
            aria-label="Modifier" title="Modifier">
      <fa-icon [icon]="['fas','pen']"/>
    </button>
  `,
})
export class EditButtonComponent {
  public readonly edit = output<void>();
}
