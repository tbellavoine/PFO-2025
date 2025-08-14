import { Component, inject, OnInit } from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { TranslatePipe } from '@ngx-translate/core';
import { StartMenu } from './start-menu.const';
import { RouterLink } from '@angular/router';
import { LastPagesService } from '@services/last-pages.service';
import { AboutMenu } from './about-menu.const';
import { TabsService } from '@services/tabs.service';
import { Tab } from '../../models/tab.model';
import { TabKey } from '../../enums/tab-key.enum';
import { Path } from '../../enums/path.enum';

@Component({
  selector: 'home',
  imports: [
    FaIconComponent,
    TranslatePipe,
    RouterLink
  ],
  templateUrl: './home.component.html',
  host: {
    class: 'h-full'
  }
})
export class HomeComponent implements OnInit {
  protected readonly StartMenu = StartMenu;
  protected readonly AboutMenu = AboutMenu;
  private readonly tabsService = inject(TabsService);
  private contactTab: Tab = new Tab(TabKey.HOME, ['fas', 'house-chimney'], 'text-light', 'EXPLORER.HOME', [Path.HOME]);
  private readonly lastPagesService = inject(LastPagesService);
  protected readonly lastPages = this.lastPagesService.lastPages;

  ngOnInit() {
    this.tabsService.addTab(this.contactTab);
  }

  getPageName(url: string): string {
    const pageNames: Record<string, string> = {
      '/home': 'MENUS.HOME',
      '/contact': 'MENUS.CONTACT',
      '/works': 'MENUS.WORKS',
      '/about': 'MENUS.ABOUT',
      '/profile': 'MENUS.PROFILE',
    };

    return pageNames[url] || url.replace('/', '').replace('-', ' ') || 'Page';
  }

  getPageUrl(url: string): string {
    return url;
  }

  clearHistory(): void {
    this.lastPagesService.clearHistory();
  }
}
