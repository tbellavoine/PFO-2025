import { Directive, ElementRef, HostListener, inject, output, input } from '@angular/core';

@Directive({
  selector: '[clickOutside]'
})
export class ClickOutsideDirective {
  private elementRef = inject(ElementRef);
  public clickOutside = output<void>();
  public excludeElements = input<string[]>([]);

  @HostListener('document:click', ['$event'])
  onClick(event: Event) {
    const target = event.target as Element;
    const isExcluded = this.excludeElements().some(selector =>
      target.closest(selector)
    );

    if (isExcluded) return;
    if (!this.elementRef.nativeElement.contains(target)) {
      this.clickOutside.emit();
    }
  }
}
