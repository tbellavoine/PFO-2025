import { Component, computed, inject } from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { TranslatePipe } from '@ngx-translate/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { TabsService } from '@services/tabs.service';
import { Tab } from '@models/tab.model';
import { TabKey } from '@enums/tab-key.enum';

@Component({
  selector: 'tabs',
  imports: [
    FaIconComponent,
    TranslatePipe,
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './tabs.component.html',
})
export class TabsComponent {
  private readonly tabsService = inject(TabsService);
  public tabs = computed(() => this.tabsService.tabs());
  private readonly router = inject(Router);

  /**
   * Remove a tab and navigate to the appropriate tab
   * @param tab
   * @param event
   */
  public removeTab(tab: Tab, event?: Event): void {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    if (tab.key === TabKey.HOME && this.tabs().length === 1) return;

    const currentTabs: Tab[] = this.tabsService.tabs();
    const currentTabIndex: number = currentTabs.indexOf(tab);
    const previousTab: Tab = currentTabs[currentTabIndex - 1];
    const nextTab: Tab = currentTabs[currentTabIndex + 1];
    const newTabs: Tab[] = currentTabs.filter((_, index) => index !== currentTabIndex);

    this.tabsService.tabs.set(newTabs);

    if (newTabs.length === 0) {
      this.router.navigate(['/']).then();

      return;
    }

    if (previousTab) {
      console.log(previousTab);
      this.router.navigate(previousTab.route).then();

      return;
    }

    if (nextTab) {
      this.router.navigate(nextTab.route).then();

      return;
    }
  }
}
