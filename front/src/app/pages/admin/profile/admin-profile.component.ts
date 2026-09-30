import { Component, effect, inject, signal } from '@angular/core';
import { HttpClient, httpResource } from '@angular/common/http';
import { form, required, FormField } from '@angular/forms/signals';
import { ProfileApiModel } from '@models/api/profile.model';
import { environment } from '../../../../environments/environment';

interface ProfileFormModel {
  name: string;
  title: string;
  cvUrl: string;
}

@Component({
  selector: 'app-admin-profile',
  imports: [FormField],
  templateUrl: './admin-profile.component.html',
})
export class AdminProfileComponent {
  private readonly http = inject(HttpClient);

  protected readonly profileResource = httpResource<ProfileApiModel>(
    () => `${environment.apiBaseUrl}/v1/profile`,
  );
  protected readonly model = signal<ProfileFormModel>({ name: '', title: '', cvUrl: '' });
  protected readonly profileForm = form(this.model, (path) => {
    required(path.name);
    required(path.title);
  });
  protected readonly bioParagraphs = signal<string[]>([]);
  protected readonly softSkills = signal<string[]>([]);
  protected readonly saving = signal(false);
  protected readonly statusMessage = signal<string | null>(null);

  constructor() {
    effect(() => {
      const profile = this.profileResource.value();
      if (profile) {
        this.model.set({ name: profile.name, title: profile.title, cvUrl: profile.cvUrl ?? '' });
        this.bioParagraphs.set([...profile.bioParagraphs]);
        this.softSkills.set([...profile.softSkills]);
      }
    });
  }

  protected updateBioParagraph(index: number, value: string): void {
    this.bioParagraphs.update((paragraphs) => paragraphs.map((p, i) => (i === index ? value : p)));
  }

  protected addBioParagraph(): void {
    this.bioParagraphs.update((paragraphs) => [...paragraphs, '']);
  }

  protected removeBioParagraph(index: number): void {
    this.bioParagraphs.update((paragraphs) => paragraphs.filter((_, i) => i !== index));
  }

  protected updateSoftSkill(index: number, value: string): void {
    this.softSkills.update((skills) => skills.map((s, i) => (i === index ? value : s)));
  }

  protected addSoftSkill(): void {
    this.softSkills.update((skills) => [...skills, '']);
  }

  protected removeSoftSkill(index: number): void {
    this.softSkills.update((skills) => skills.filter((_, i) => i !== index));
  }

  protected onSubmit(event: Event): void {
    event.preventDefault();
    if (!this.profileForm().valid()) {
      return;
    }

    this.saving.set(true);
    this.statusMessage.set(null);
    const { name, title, cvUrl } = this.model();
    this.http
      .put(`${environment.apiBaseUrl}/v1/admin/profile`, {
        name,
        title,
        cvUrl: cvUrl || undefined,
        bioParagraphs: this.bioParagraphs(),
        softSkills: this.softSkills(),
      })
      .subscribe({
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
