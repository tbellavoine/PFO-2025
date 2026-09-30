import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { AuthService } from '@services/auth.service';
import { TabsService } from '@services/tabs.service';
import { Tab } from '@models/tab.model';
import { TabKey } from '@enums/tab-key.enum';
import { Path } from '@enums/path.enum';

@Component({
  selector: 'app-admin-layout',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, FaIconComponent],
  templateUrl: './admin-layout.component.html',
})
export class AdminLayoutComponent implements OnInit {
  protected readonly Path = Path;
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly tabsService = inject(TabsService);
  private readonly adminTab = new Tab(TabKey.ADMIN, ['fas', 'wrench'], 'text-accent', 'EXPLORER.CONSOLE_FILE', [Path.ADMIN]);

  protected readonly admin = this.authService.admin;

  ngOnInit(): void {
    this.tabsService.addTab(this.adminTab);
  }

  protected logout(): void {
    this.authService.logout().subscribe(() => {
      this.router.navigate([Path.ADMIN, Path.ADMIN_LOGIN]).then();
    });
  }
}
