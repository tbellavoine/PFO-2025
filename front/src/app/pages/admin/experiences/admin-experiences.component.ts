import { Component, effect, inject, signal } from '@angular/core';
import { HttpClient, httpResource } from '@angular/common/http';
import { form, required, FormField } from '@angular/forms/signals';
import { ExperienceApiModel } from '@models/api/experience.model';
import { SkillApiModel, SkillCategoryEntity } from '@models/api/skill-catalog.model';
import { environment } from '../../../../environments/environment';

interface ExperienceFormModel {
  slug: string;
  company: string;
  role: string;
  periodLabel: string;
  status: string;
  order: number;
  published: boolean;
}

interface SkillAssignment {
  skillId: string;
  categoryId: string;
}

const EMPTY_MODEL: ExperienceFormModel = {
  slug: '',
  company: '',
  role: '',
  periodLabel: '',
  status: '',
  order: 0,
  published: false,
};

@Component({
  selector: 'app-admin-experiences',
  imports: [FormField],
  templateUrl: './admin-experiences.component.html',
})
export class AdminExperiencesComponent {
  private readonly http = inject(HttpClient);

  protected readonly experiencesResource = httpResource<ExperienceApiModel[]>(
    () => `${environment.apiBaseUrl}/v1/admin/experiences`,
  );
  protected readonly skillsResource = httpResource<SkillApiModel[]>(
    () => `${environment.apiBaseUrl}/v1/admin/skills`,
  );
  protected readonly categoriesResource = httpResource<SkillCategoryEntity[]>(
    () => `${environment.apiBaseUrl}/v1/admin/skills/categories`,
  );

  protected readonly editingId = signal<string | 'new' | null>(null);
  protected readonly model = signal<ExperienceFormModel>({ ...EMPTY_MODEL });
  protected readonly experienceForm = form(this.model, (path) => {
    required(path.slug);
    required(path.company);
    required(path.role);
    required(path.periodLabel);
    required(path.status);
  });
  protected readonly achievements = signal<string[]>([]);
  protected readonly skillAssignments = signal<SkillAssignment[]>([]);
  protected readonly newAchievement = signal('');
  protected readonly newSkillId = signal('');
  protected readonly newCategoryId = signal('');
  protected readonly saving = signal(false);
  protected readonly statusMessage = signal<string | null>(null);

  constructor() {
    effect(() => {
      const id = this.editingId();
      if (id === 'new' || id === null) {
        return;
      }
      const experience = this.experiencesResource.value()?.find((e) => e.id === id);
      if (experience) {
        this.model.set({
          slug: experience.slug,
          company: experience.company,
          role: experience.role,
          periodLabel: experience.periodLabel,
          status: experience.status,
          order: experience.order,
          published: experience.published,
        });
        this.achievements.set(experience.achievements.slice().sort((a, b) => a.order - b.order).map((a) => a.text));
        this.skillAssignments.set(experience.skills.map((s) => ({ skillId: s.skill.id, categoryId: s.category.id })));
      }
    });
  }

  protected startCreate(): void {
    this.model.set({ ...EMPTY_MODEL });
    this.achievements.set([]);
    this.skillAssignments.set([]);
    this.statusMessage.set(null);
    this.editingId.set('new');
  }

  protected startEdit(id: string): void {
    this.statusMessage.set(null);
    this.editingId.set(id);
  }

  protected cancelEdit(): void {
    this.editingId.set(null);
  }

  protected addAchievement(): void {
    const text = this.newAchievement().trim();
    if (!text) {
      return;
    }
    this.achievements.update((list) => [...list, text]);
    this.newAchievement.set('');
  }

  protected removeAchievement(index: number): void {
    this.achievements.update((list) => list.filter((_, i) => i !== index));
  }

  protected addSkillAssignment(): void {
    const skillId = this.newSkillId();
    const categoryId = this.newCategoryId();
    if (!skillId || !categoryId) {
      return;
    }
    if (this.skillAssignments().some((s) => s.skillId === skillId && s.categoryId === categoryId)) {
      return;
    }
    this.skillAssignments.update((list) => [...list, { skillId, categoryId }]);
  }

  protected removeSkillAssignment(skillId: string, categoryId: string): void {
    this.skillAssignments.update((list) =>
      list.filter((s) => !(s.skillId === skillId && s.categoryId === categoryId)),
    );
  }

  protected skillName(skillId: string): string {
    return this.skillsResource.value()?.find((s) => s.id === skillId)?.name ?? skillId;
  }

  protected categoryLabel(categoryId: string): string {
    return this.categoriesResource.value()?.find((c) => c.id === categoryId)?.label ?? categoryId;
  }

  protected onSubmit(event: Event): void {
    event.preventDefault();
    if (!this.experienceForm().valid()) {
      return;
    }

    const id = this.editingId();
    const payload = {
      ...this.model(),
      achievements: this.achievements(),
      skills: this.skillAssignments(),
    };

    this.saving.set(true);
    this.statusMessage.set(null);
    const request =
      id === 'new'
        ? this.http.post(`${environment.apiBaseUrl}/v1/admin/experiences`, payload)
        : this.http.put(`${environment.apiBaseUrl}/v1/admin/experiences/${id}`, payload);

    request.subscribe({
      next: () => {
        this.saving.set(false);
        this.experiencesResource.reload();
        this.editingId.set(null);
      },
      error: () => {
        this.saving.set(false);
        this.statusMessage.set("Erreur lors de l'enregistrement.");
      },
    });
  }

  protected deleteExperience(id: string): void {
    this.http.delete(`${environment.apiBaseUrl}/v1/admin/experiences/${id}`).subscribe(() => {
      this.experiencesResource.reload();
    });
  }
}
