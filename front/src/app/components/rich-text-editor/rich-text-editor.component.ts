import { Component, effect, ElementRef, model, viewChild } from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import type { FormValueControl } from '@angular/forms/signals';

/**
 * Minimal contenteditable-based rich text editor: bold/italic/underline/list,
 * HTML in, HTML out. Implements Signal Forms' FormValueControl contract, so
 * it binds via [formField] exactly like a native input; it also works as a
 * plain two-way [value]/(valueChange) control outside a form (e.g. a
 * signal-array editor that isn't wired through Signal Forms).
 */
@Component({
  selector: 'rich-text-editor',
  imports: [FaIconComponent],
  templateUrl: './rich-text-editor.component.html',
})
export class RichTextEditorComponent implements FormValueControl<string> {
  readonly value = model<string>('');
  protected readonly editor = viewChild.required<ElementRef<HTMLDivElement>>('editor');
  private lastSyncedValue = '';

  constructor() {
    effect(() => {
      const current = this.value();
      if (current === this.lastSyncedValue) {
        return;
      }
      this.lastSyncedValue = current;
      this.editor().nativeElement.innerHTML = current;
    });
  }

  /**
   * Run a rich-text command (bold/italic/...) on the current selection
   * @param command
   */
  protected exec(command: string): void {
    document.execCommand(command);
    this.syncValue();
  }

  protected syncValue(): void {
    const html = this.editor().nativeElement.innerHTML;
    this.lastSyncedValue = html;
    this.value.set(html);
  }
}
