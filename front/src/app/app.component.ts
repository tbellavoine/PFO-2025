import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter, map } from 'rxjs';
import { TitleBarComponent } from './layout/title-bar/title-bar.component';
import { SidenavComponent } from './layout/sidenav/sidenav.component';
import { StatusBarComponent } from './layout/status-bar/status-bar.component';
import { TabsComponent } from '@components/tabs/tabs.component';
import { Path } from '@enums/path.enum';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, TitleBarComponent, SidenavComponent, StatusBarComponent, TabsComponent],
  templateUrl: './app.component.html',
})
export class AppComponent {
  private readonly router = inject(Router);

  // The admin back office is a plain app, not the public site's "code
  // editor" chrome (titlebar/explorer/tabs/status bar) — it gets the bare
  // router-outlet instead.
  protected readonly isAdminRoute = toSignal(
    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      map((event) => event.urlAfterRedirects.startsWith(`/${Path.ADMIN}`)),
    ),
    { initialValue: this.router.url.startsWith(`/${Path.ADMIN}`) },
  );
}
