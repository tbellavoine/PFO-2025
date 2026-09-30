import { Component, computed, inject, input } from '@angular/core';
import { NgClass } from '@angular/common';
import { Router } from '@angular/router';
import { Path } from '@enums/path.enum';

/**
 * JsonCardComponent renders arbitrary JSON-shaped data (a Project, an
 * Experience entry, a skills map, ...), so its input has no single common
 * shape. It narrows the two properties it reads itself (type, links) at
 * runtime instead of assuming a fixed interface every caller must match.
 */
@Component({
  selector: 'json-card',
  imports: [
    NgClass
  ],
  templateUrl: './json-card.component.html',
})
export class JsonCardComponent {
  public readonly jsonObject = input<object>();
  public readonly title = input<string>();
  public readonly type = computed<string | undefined>(() => {
    const value = this.jsonObject();
    return value && 'type' in value ? (value as { type: string }).type : undefined;
  });
  public readonly jsonLines = computed<string[]>(() => {
    const filteredJsonOject: Record<string, unknown> = { ...this.jsonObject() };
    delete filteredJsonOject['links'];

    return JSON.stringify(filteredJsonOject, null, 2).split('\n');
  });
  public readonly jsonLinks = computed<{ label: string, url: string }[]>(() => {
    const value = this.jsonObject();
    const links =
      value && 'links' in value
        ? (value as { links?: { label: string; url?: string }[] }).links
        : undefined;

    return (links ?? []).filter(
      (link): link is { label: string; url: string } => !!link.url,
    );
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
    highlighted = highlighted.replace(/(\s+)"(https?:\/\/[^"]*)"(?=\s*[,\]}]|$)/g, '$1<a href="$2" target="_blank" rel="noopener noreferrer" class="text-accent cursor-pointer">"$2"</a>');

    // 📧 Liens mailto dans les valeurs string
    highlighted = highlighted.replace(/(\s+)"(mailto:[^"]*)"(?=\s*[,\]}]|$)/g, '$1<a href="$2" target="_blank" class="text-accent cursor-pointer">"$2"</a>');

    // 🎨 Valeurs string dans les tableaux ou objets
    highlighted = highlighted.replace(/(\s+)"([^"]*)"(?=\s*[,\]}]|$)/g, '$1<span class="text-accent whitespace-break-spaces">"$2"</span>');

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
      window.open(url, '_blank', 'noopener,noreferrer');

      return;
    }
    this.router.navigate([Path.PREVIEW, url]).then();
  }
}
