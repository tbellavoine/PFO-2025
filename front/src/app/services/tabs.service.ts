import { Injectable, signal } from '@angular/core';
import { Tab } from '@models/tab.model';

@Injectable({
  providedIn: 'root'
})
export class TabsService {
  public tabs = signal<Tab[]>([]);

  /**
   * Get the current tabs
   * @param tab
   */
  public addTab(tab: Tab) {
    const tabs: Tab[] = this.tabs();
    if (tabs.some(tabItem => tabItem.key === tab.key)) return;
    this.tabs.set([...tabs, tab]);
  }
}
