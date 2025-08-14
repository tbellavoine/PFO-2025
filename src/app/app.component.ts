import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TitleBarComponent } from './layout/title-bar/title-bar.component';
import { SidenavComponent } from './layout/sidenav/sidenav.component';
import { StatusBarComponent } from './layout/status-bar/status-bar.component';
import { TabsComponent } from '@components/tabs/tabs.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, TitleBarComponent, SidenavComponent, StatusBarComponent, TabsComponent],
  templateUrl: './app.component.html',
})
export class AppComponent {
  protected readonly title = signal('PFO-2025');
}
