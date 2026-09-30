import { Component, effect, inject, signal } from '@angular/core';
import { HttpClient, httpResource } from '@angular/common/http';
import { form, required, FormField } from '@angular/forms/signals';
import { ContactApiModel } from '@models/api/contact.model';
import { environment } from '../../../../environments/environment';

interface ContactFormModel {
  site: string;
  email: string;
  linkedin: string;
}

@Component({
  selector: 'app-admin-contact',
  imports: [FormField],
  templateUrl: './admin-contact.component.html',
})
export class AdminContactComponent {
  private readonly http = inject(HttpClient);

  protected readonly contactResource = httpResource<ContactApiModel>(
    () => `${environment.apiBaseUrl}/v1/contact`,
  );
  protected readonly model = signal<ContactFormModel>({ site: '', email: '', linkedin: '' });
  protected readonly contactForm = form(this.model, (path) => {
    required(path.site);
    required(path.email);
    required(path.linkedin);
  });
  protected readonly saving = signal(false);
  protected readonly statusMessage = signal<string | null>(null);

  constructor() {
    effect(() => {
      const contact = this.contactResource.value();
      if (contact) {
        this.model.set({ site: contact.site, email: contact.email, linkedin: contact.linkedin });
      }
    });
  }

  protected onSubmit(event: Event): void {
    event.preventDefault();
    if (!this.contactForm().valid()) {
      return;
    }

    this.saving.set(true);
    this.statusMessage.set(null);
    this.http.put(`${environment.apiBaseUrl}/v1/admin/contact`, this.model()).subscribe({
      next: () => {
        this.saving.set(false);
        this.statusMessage.set('Enregistré.');
      },
      error: () => {
        this.saving.set(false);
        this.statusMessage.set("Erreur lors de l'enregistrement.");
      },
    });
  }
}
