import { Component, inject, signal } from '@angular/core';
import { SidenavBottom } from './sidenav.const';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { ExplorerComponent } from '@components/explorer/explorer.component';
import { MenuKey } from '@enums/menu-key.enum';
import { NgClass } from '@angular/common';
import { filter } from 'rxjs';
import { ClickOutsideDirective } from '@directive/click-outside.directive';

@Component({
  selector: 'sidenav',
  imports: [
    FaIconComponent,
    RouterLink,
    RouterLinkActive,
    ExplorerComponent,
    NgClass,
    ClickOutsideDirective
  ],
  templateUrl: './sidenav.component.html',
  host: {
    class: 'h-full',
  },
})
export class SidenavComponent {
  private readonly router = inject(Router);
  protected readonly SidenavBottom = SidenavBottom;
  protected isExplorerOpen = signal<boolean>(false);
  protected readonly MenuKey = MenuKey;
  private mobileSizeLimit = 768;
  public isMobile = signal(window.innerWidth < this.mobileSizeLimit);

  constructor() {
    this.checkMobile();
    window.addEventListener('resize', () => this.checkMobile());
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      if (this.isMobile()) {
        this.isExplorerOpen.set(false);
      }
    });
  }

  /**
   * Close the explorer panel on mobile
   * @protected
   */
  protected closePanel(): void {
    if (this.isMobile()) {
      this.isExplorerOpen.set(false);
    }
  }

  /**
   * Toggle the explorer panel
   * @param menuItemKey
   * @protected
   */
  protected toogleExplorer(menuItemKey: MenuKey): void {
    if (menuItemKey !== MenuKey.EXPLORER) {
      this.isExplorerOpen.set(false);

      return;
    }
    this.isExplorerOpen.set(!this.isExplorerOpen());
  }

  /**
   * Check if the screen is mobile size and update the signal
   * @private
   */
  private checkMobile(): void {
    const mobile = window.innerWidth < 768;
    this.isMobile.set(mobile);
    if (mobile) {
      this.isExplorerOpen.set(false);
    }
  }
}
