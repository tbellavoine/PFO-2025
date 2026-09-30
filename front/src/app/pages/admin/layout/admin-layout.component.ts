import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '@services/auth.service';
import { Path } from '@enums/path.enum';

@Component({
  selector: 'app-admin-layout',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './admin-layout.component.html',
})
export class AdminLayoutComponent {
  protected readonly Path = Path;
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly admin = this.authService.admin;

  protected logout(): void {
    this.authService.logout().subscribe(() => {
      this.router.navigate([Path.ADMIN, Path.ADMIN_LOGIN]).then();
    });
  }
}
