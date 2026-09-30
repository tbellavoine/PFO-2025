import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { form, required, email as emailValidator, FormField } from '@angular/forms/signals';
import { AuthService } from '@services/auth.service';
import { Path } from '@enums/path.enum';

interface LoginFormModel {
  email: string;
  password: string;
}

@Component({
  selector: 'app-admin-login',
  imports: [FormField],
  templateUrl: './admin-login.component.html',
})
export class AdminLoginComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly model = signal<LoginFormModel>({ email: '', password: '' });
  protected readonly loginForm = form(this.model, (path) => {
    required(path.email);
    emailValidator(path.email);
    required(path.password);
  });
  protected readonly submitting = signal(false);
  protected readonly errorMessage = signal<string | null>(null);

  protected onSubmit(event: Event): void {
    event.preventDefault();
    if (!this.loginForm().valid()) {
      return;
    }

    this.submitting.set(true);
    this.errorMessage.set(null);
    const { email, password } = this.model();

    this.authService.login(email, password).subscribe({
      next: () => {
        this.submitting.set(false);
        this.router.navigate([Path.HOME]).then();
      },
      error: () => {
        this.submitting.set(false);
        this.errorMessage.set('Identifiants invalides.');
      },
    });
  }
}
