import { Injectable, signal } from '@angular/core';
import { Tab } from '../models/tab.model';

@Injectable({
  providedIn: 'root'
})
export class TabsService {
  public tabs = signal<Tab[]>([]);

  public addTab(tab: Tab) {
    const tabs: Tab[] = this.tabs();
    if (tabs.some(tabItem => tabItem.key === tab.key)) return;
    tabs.push(tab);
    this.tabs.set(tabs);
  }
}
