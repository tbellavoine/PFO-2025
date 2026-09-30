import { Component, effect, inject, input, output, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { form, required, FormField } from '@angular/forms/signals';
import { ContactApiModel } from '@models/api/contact.model';
import { environment } from '../../../environments/environment';

interface ContactFormModel {
  site: string;
  email: string;
  linkedin: string;
}

@Component({
  selector: 'app-contact-edit-form',
  imports: [FormField],
  templateUrl: './contact-edit-form.component.html',
})
export class ContactEditFormComponent {
  public readonly contact = input.required<ContactApiModel>();
  public readonly saved = output<void>();
  public readonly cancelled = output<void>();
  private readonly http = inject(HttpClient);

  protected readonly model = signal<ContactFormModel>({ site: '', email: '', linkedin: '' });
  protected readonly contactForm = form(this.model, (path) => {
    required(path.site);
    required(path.email);
    required(path.linkedin);
  });
  protected readonly saving = signal(false);
  protected readonly errorMessage = signal<string | null>(null);

  constructor() {
    effect(() => {
      const contact = this.contact();
      this.model.set({ site: contact.site, email: contact.email, linkedin: contact.linkedin });
    });
  }

  protected onSubmit(event: Event): void {
    event.preventDefault();
    if (!this.contactForm().valid()) {
      return;
    }

    this.saving.set(true);
    this.errorMessage.set(null);
    this.http.put(`${environment.apiBaseUrl}/v1/admin/contact`, this.model()).subscribe({
      next: () => {
        this.saving.set(false);
        this.saved.emit();
      },
      error: () => {
        this.saving.set(false);
        this.errorMessage.set("Erreur lors de l'enregistrement.");
      },
    });
  }
}
