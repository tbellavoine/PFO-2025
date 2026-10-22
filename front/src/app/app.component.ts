import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TitleBarComponent } from './layout/title-bar/title-bar.component';
import { SidenavComponent } from './layout/sidenav/sidenav.component';
import { StatusBarComponent } from './layout/status-bar/status-bar.component';
import { TabsComponent } from '@components/tabs/tabs.component';
import { AuthService } from '@services/auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, TitleBarComponent, SidenavComponent, StatusBarComponent, TabsComponent],
  templateUrl: './app.component.html',
})
export class AppComponent {
  private readonly authService = inject(AuthService);

  constructor() {
    // Restore the admin session indicator (power icon, edit pencils) from
    // the httpOnly cookie, if any, on every fresh load.
    this.authService.checkSession().subscribe();
  }
}
