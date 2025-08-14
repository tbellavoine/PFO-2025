import { computed, inject, Injectable, signal } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { LocalStorageKey } from '../enums/localstorage-key.enum';

@Injectable({
  providedIn: 'root'
})
export class LastPagesService {
  private readonly router = inject(Router);
  private readonly translateService = inject(TranslateService);
  private lastPagesSignal = signal<string[]>([]);
  public readonly lastPages = computed(() => this.lastPagesSignal());

  constructor() {
    this.loadFromStorage();
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        if (event.url === '/') return;
        this.addPage(event.url);
      });
  }

  public clearHistory(): void {
    this.lastPagesSignal.set([]);
    localStorage.removeItem(LocalStorageKey.LAST_PAGES);
  }

  private addPage(url: string): void {
    const currentPages = this.lastPagesSignal();

    if (currentPages[0] !== url) {
      const newPages = [url, ...currentPages];
      const limitedPages = newPages.slice(0, 4);
      this.lastPagesSignal.set(limitedPages);
      this.saveToStorage();
    }
  }

  private saveToStorage(): void {
    try {
      localStorage.setItem(LocalStorageKey.LAST_PAGES, JSON.stringify(this.lastPagesSignal()));
    } catch (error) {
      console.warn(this.translateService.instant('MESSAGES.ERROR.SAVE_HISTORY'), error);
    }
  }

  private loadFromStorage(): void {
    try {
      const saved = localStorage.getItem(LocalStorageKey.LAST_PAGES);
      if (saved) {
        const pages = JSON.parse(saved);
        this.lastPagesSignal.set(pages);
      }
    } catch (error) {
      console.warn(this.translateService.instant('MESSAGES.ERROR.LOAD_HISTORY'), error);
      this.lastPagesSignal.set([]);
    }
  }
}
