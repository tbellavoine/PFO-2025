import { Component, signal } from '@angular/core';
import { SidenavBottom } from './sidenav.const';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ExplorerComponent } from '@components/explorer/explorer.component';
import { MenuKey } from '../../enums/menu-key.enum';
import { NgClass } from '@angular/common';

@Component({
  selector: 'sidenav',
  imports: [
    FaIconComponent,
    RouterLink,
    RouterLinkActive,
    ExplorerComponent,
    NgClass
  ],
  templateUrl: './sidenav.component.html',
  host: {
    class: 'h-full',
  },
})
export class SidenavComponent {
  protected readonly SidenavBottom = SidenavBottom;

  protected isExplorerOpen = signal<boolean>(false);
  protected readonly MenuKey = MenuKey;

  protected toogleExplorer(menuItemKey: MenuKey): void {
    if (menuItemKey !== MenuKey.EXPLORER) {
      this.isExplorerOpen.set(false);

      return;
    }
    this.isExplorerOpen.set(!this.isExplorerOpen());
  }
}
