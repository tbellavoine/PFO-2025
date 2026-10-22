import { Component, effect, inject, input, output, signal } from '@angular/core';
import { HttpClient, httpResource } from '@angular/common/http';
import { KeyValuePipe } from '@angular/common';
import { form, required, FormField } from '@angular/forms/signals';
import { ExperienceApiModel } from '@models/api/experience.model';
import { SkillApiModel, SkillCategoryEntity } from '@models/api/skill-catalog.model';
import { ExperienceStatus } from '@enums/experience-status.enum';
import { MonthYearPickerComponent } from '@components/month-year-picker/month-year-picker.component';
import { environment } from '../../../environments/environment';

interface ExperienceFormModel {
  slug: string;
  company: string;
  role: string;
  startDate: string;
  endDate: string | null;
  status: ExperienceStatus;
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
  startDate: `${new Date().toISOString().slice(0, 7)}-01`,
  endDate: null,
  status: ExperienceStatus.IN_PROGRESS,
  order: 0,
  published: false,
};

@Component({
  selector: 'app-experience-edit-form',
  imports: [FormField, KeyValuePipe, MonthYearPickerComponent],
  templateUrl: './experience-edit-form.component.html',
})
export class ExperienceEditFormComponent {
  // null = create a new experience
  public readonly experience = input.required<ExperienceApiModel | null>();
  public readonly saved = output<void>();
  public readonly deleted = output<void>();
  public readonly cancelled = output<void>();
  private readonly http = inject(HttpClient);
  protected readonly ExperienceStatus = ExperienceStatus;

  protected readonly skillsResource = httpResource<SkillApiModel[]>(
    () => `${environment.apiBaseUrl}/v1/admin/skills`,
  );
  protected readonly categoriesResource = httpResource<SkillCategoryEntity[]>(
    () => `${environment.apiBaseUrl}/v1/admin/skills/categories`,
  );

  protected readonly model = signal<ExperienceFormModel>({ ...EMPTY_MODEL });
  protected readonly experienceForm = form(this.model, (path) => {
    required(path.slug);
    required(path.company);
    required(path.role);
    required(path.startDate);
    required(path.status);
  });
  protected readonly achievements = signal<string[]>([]);
  protected readonly skillAssignments = signal<SkillAssignment[]>([]);
  protected readonly newAchievement = signal('');
  protected readonly newSkillId = signal('');
  protected readonly newCategoryId = signal('');
  protected readonly saving = signal(false);
  protected readonly errorMessage = signal<string | null>(null);

  constructor() {
    effect(() => {
      const experience = this.experience();
      if (!experience) {
        this.model.set({ ...EMPTY_MODEL });
        this.achievements.set([]);
        this.skillAssignments.set([]);
        return;
      }
      this.model.set({
        slug: experience.slug,
        company: experience.company,
        role: experience.role,
        startDate: experience.startDate,
        endDate: experience.endDate,
        status: experience.status as ExperienceStatus,
        order: experience.order,
        published: experience.published,
      });
      this.achievements.set(experience.achievements.slice().sort((a, b) => a.order - b.order).map((a) => a.text));
      this.skillAssignments.set(experience.skills.map((s) => ({ skillId: s.skill.id, categoryId: s.category.id })));
    });
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

    const existing = this.experience();
    const payload = {
      ...this.model(),
      achievements: this.achievements(),
      skills: this.skillAssignments(),
    };

    this.saving.set(true);
    this.errorMessage.set(null);
    const request = existing
      ? this.http.put(`${environment.apiBaseUrl}/v1/admin/experiences/${existing.id}`, payload)
      : this.http.post(`${environment.apiBaseUrl}/v1/admin/experiences`, payload);

    request.subscribe({
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

  protected onDelete(): void {
    const existing = this.experience();
    if (!existing) {
      return;
    }
    this.http.delete(`${environment.apiBaseUrl}/v1/admin/experiences/${existing.id}`).subscribe(() => {
      this.deleted.emit();
    });
  }
}
