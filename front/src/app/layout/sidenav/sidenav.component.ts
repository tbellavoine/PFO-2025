import { Component, inject, PLATFORM_ID, signal } from '@angular/core';
import { SidenavBottom } from './sidenav.const';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { ExplorerComponent } from '@components/explorer/explorer.component';
import { MenuKey } from '@enums/menu-key.enum';
import { isPlatformBrowser, NgClass } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { filter } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ClickOutsideDirective } from '@directive/click-outside.directive';
import { AuthService } from '@services/auth.service';
import { Path } from '@enums/path.enum';

@Component({
  selector: 'sidenav',
  imports: [
    FaIconComponent,
    RouterLink,
    RouterLinkActive,
    ExplorerComponent,
    NgClass,
    ClickOutsideDirective,
    TranslatePipe
  ],
  templateUrl: './sidenav.component.html',
  host: {
    class: 'h-full',
    '(window:resize)': 'checkMobile()',
  },
})
export class SidenavComponent {
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  protected readonly SidenavBottom = SidenavBottom;
  protected isExplorerOpen = signal<boolean>(false);
  protected readonly MenuKey = MenuKey;
  protected readonly admin = this.authService.admin;
  protected readonly Path = Path;
  private mobileSizeLimit = 768;
  public isMobile = signal(this.isBrowser && window.innerWidth < this.mobileSizeLimit);

  constructor() {
    this.checkMobile();
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      takeUntilDestroyed()
    ).subscribe(() => {
      if (this.isMobile()) {
        this.isExplorerOpen.set(false);
      }
    });
  }

  /**
   * Log out when the power icon is clicked while connected
   * @protected
   */
  protected onPowerClick(): void {
    this.authService.logout().subscribe();
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
  protected checkMobile(): void {
    if (!this.isBrowser) return;
    const mobile = window.innerWidth < this.mobileSizeLimit;
    this.isMobile.set(mobile);
    if (mobile) {
      this.isExplorerOpen.set(false);
    }
  }
}
