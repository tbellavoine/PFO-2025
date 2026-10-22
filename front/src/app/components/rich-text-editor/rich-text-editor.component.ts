import { afterNextRender, Component, DestroyRef, effect, ElementRef, inject, model, signal, viewChild } from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import type { FormValueControl } from '@angular/forms/signals';

interface ActiveFormats {
  bold: boolean;
  italic: boolean;
  underline: boolean;
  insertUnorderedList: boolean;
}

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
  protected readonly activeFormats = signal<ActiveFormats>({
    bold: false,
    italic: false,
    underline: false,
    insertUnorderedList: false,
  });
  private readonly destroyRef = inject(DestroyRef);
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

    // Selection state (what's bold/italic/... at the cursor) only changes
    // via the document-level `selectionchange` event, not `input` — a
    // plain click or arrow-key move updates it without firing `input`.
    afterNextRender(() => {
      document.addEventListener('selectionchange', this.updateActiveFormats);
      this.destroyRef.onDestroy(() => {
        document.removeEventListener('selectionchange', this.updateActiveFormats);
      });
    });
  }

  /**
   * Run a rich-text command (bold/italic/...) on the current selection
   * @param command
   */
  protected exec(command: string): void {
    document.execCommand(command);
    this.syncValue();
    this.updateActiveFormats();
  }

  protected syncValue(): void {
    const html = this.editor().nativeElement.innerHTML;
    this.lastSyncedValue = html;
    this.value.set(html);
  }

  protected readonly updateActiveFormats = (): void => {
    const element = this.editor().nativeElement;
    if (document.activeElement !== element || typeof document.queryCommandState !== 'function') {
      return;
    }
    this.activeFormats.set({
      bold: document.queryCommandState('bold'),
      italic: document.queryCommandState('italic'),
      underline: document.queryCommandState('underline'),
      insertUnorderedList: document.queryCommandState('insertUnorderedList'),
    });
  };
}
