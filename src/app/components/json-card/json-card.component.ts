import { Component, computed, inject, input } from '@angular/core';
import { NgClass } from '@angular/common';
import { Router } from '@angular/router';
import { Path } from '@enums/path.enum';

@Component({
  selector: 'json-card',
  imports: [
    NgClass
  ],
  templateUrl: './json-card.component.html',
})
export class JsonCardComponent {
  public readonly jsonObject = input.required<any>();
  public readonly title = input<string>();
  public readonly jsonLines = computed<string[]>(() => {
    const filteredJsonOject: any = { ...this.jsonObject() };
    delete filteredJsonOject['links'];

    return JSON.stringify(filteredJsonOject, null, 2).split('\n');
  });
  public readonly jsonLinks = computed<{ label: string, url: string }[]>(() => {
    const jsonObject: any = { ...this.jsonObject() };

    return jsonObject ? jsonObject.links : [];
  });
  private readonly router = inject(Router);

  /**
   * Highlight a line of JSON with HTML spans for syntax coloring
   * @param line
   */
  public highlightJsonLine(line: string): string {
    let highlighted: string = line;

    // 🎨 Clés JSON (propriétés)
    highlighted = highlighted.replace(/"([^"]+)"(\s*:)/g, '<span class="text-blue-light">"$1"</span>$2');

    // 🔗 Liens HTTP/HTTPS dans les valeurs string
    highlighted = highlighted.replace(/(\s+)"(https?:\/\/[^"]*)"(?=\s*[,\]\}]|$)/g, '$1<a href="$2" target="_blank" rel="noopener noreferrer" class="text-accent cursor-pointer">"$2"</a>');

    // 📧 Liens mailto dans les valeurs string
    highlighted = highlighted.replace(/(\s+)"(mailto:[^"]*)"(?=\s*[,\]\}]|$)/g, '$1<a href="$2" target="_blank" class="text-accent cursor-pointer">"$2"</a>');

    // 🎨 Valeurs string dans les tableaux ou objets
    highlighted = highlighted.replace(/(\s+)"([^"]*)"(?=\s*[,\]\}]|$)/g, '$1<span class="text-accent whitespace-break-spaces">"$2"</span>');

    // 🎨 Nombres
    highlighted = highlighted.replace(/:\s*(-?\d+(?:\.\d+)?)/g, ': <span class="text-green-light">$1</span>');

    // 🎨 Booléens
    highlighted = highlighted.replace(/:\s*(true|false)/g, ': <span class="text-blue">$1</span>');

    // 🎨 null
    highlighted = highlighted.replace(/:\s*(null)/g, ': <span class="text-blue">$1</span>');

    // 🎯 Cas spécial pour "active"
    highlighted = highlighted.replace(/"active"/g, '<span class="text-green-light font-bold">"active"</span>');

    return highlighted;
  }

  /**
   * Open a URL in a new tab or navigate internally
   * @param url
   */
  public openUrl(url: string): void {
    if (url.startsWith('http')) {
      window.open(url, '_blank');

      return;
    }
    this.router.navigate([Path.PREVIEW, url]).then();
  }
}
