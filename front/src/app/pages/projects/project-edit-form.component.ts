import { Component, effect, inject, input, output, signal } from '@angular/core';
import { HttpClient, httpResource } from '@angular/common/http';
import { KeyValuePipe } from '@angular/common';
import { form, required, FormField } from '@angular/forms/signals';
import { RichTextEditorComponent } from '@components/rich-text-editor/rich-text-editor.component';
import { MonthYearPickerComponent } from '@components/month-year-picker/month-year-picker.component';
import { ProjectApiModel } from '@models/api/project.model';
import { SkillApiModel } from '@models/api/skill-catalog.model';
import { MediaApiModel } from '@models/api/media.model';
import { Company } from '@enums/company.enum';
import { ProjectCategory } from '@enums/project-category.enum';
import { ProjectType } from '@enums/project-type.enum';
import { ProjectStatus } from '@enums/project-status.enum';
import { environment } from '../../../environments/environment';

interface ProjectFormModel {
  startDate: string;
  endDate: string | null;
  name: string;
  company: Company;
  category: ProjectCategory;
  type: ProjectType;
  status: ProjectStatus;
  description: string;
  order: number;
  published: boolean;
}

interface ProjectLinkModel {
  label: string;
  url: string;
}

const EMPTY_MODEL: ProjectFormModel = {
  startDate: `${new Date().toISOString().slice(0, 7)}-01`,
  endDate: null,
  name: '',
  company: Company.PERSO,
  category: ProjectCategory.WEBSITE,
  type: ProjectType.PERSO,
  status: ProjectStatus.IN_PROGRESS,
  description: '',
  order: 0,
  published: false,
};

@Component({
  selector: 'app-project-edit-form',
  imports: [FormField, KeyValuePipe, RichTextEditorComponent, MonthYearPickerComponent],
  templateUrl: './project-edit-form.component.html',
})
export class ProjectEditFormComponent {
  // null = create a new project
  public readonly project = input.required<ProjectApiModel | null>();
  public readonly saved = output<void>();
  public readonly deleted = output<void>();
  public readonly cancelled = output<void>();
  private readonly http = inject(HttpClient);

  protected readonly Company = Company;
  protected readonly ProjectCategory = ProjectCategory;
  protected readonly ProjectType = ProjectType;
  protected readonly ProjectStatus = ProjectStatus;

  protected readonly skillsResource = httpResource<SkillApiModel[]>(
    () => `${environment.apiBaseUrl}/v1/admin/skills`,
  );

  protected readonly model = signal<ProjectFormModel>({ ...EMPTY_MODEL });
  protected readonly projectForm = form(this.model, (path) => {
    required(path.startDate);
    required(path.name);
    required(path.description);
  });
  protected readonly links = signal<ProjectLinkModel[]>([]);
  protected readonly skillIds = signal<string[]>([]);
  protected readonly previewImage = signal<MediaApiModel | null>(null);
  protected readonly newLinkLabel = signal('');
  protected readonly newLinkUrl = signal('');
  protected readonly uploading = signal(false);
  protected readonly saving = signal(false);
  protected readonly errorMessage = signal<string | null>(null);

  constructor() {
    effect(() => {
      const project = this.project();
      if (!project) {
        this.model.set({ ...EMPTY_MODEL });
        this.links.set([]);
        this.skillIds.set([]);
        this.previewImage.set(null);
        return;
      }
      this.model.set({
        startDate: project.startDate,
        endDate: project.endDate,
        name: project.name,
        company: project.company as Company,
        category: project.category as ProjectCategory,
        type: project.type as ProjectType,
        status: project.status as ProjectStatus,
        description: project.description,
        order: project.order,
        published: project.published,
      });
      this.links.set(project.links.map((l) => ({ label: l.label, url: l.url })));
      this.skillIds.set(project.skills.map((s) => s.id));
      this.previewImage.set(
        project.previewImage ? { id: project.previewImage.id, filename: project.previewImage.filename, url: project.previewImage.url } : null,
      );
    });
  }

  protected addLink(): void {
    const label = this.newLinkLabel().trim();
    const url = this.newLinkUrl().trim();
    if (!label || !url) {
      return;
    }
    this.links.update((list) => [...list, { label, url }]);
    this.newLinkLabel.set('');
    this.newLinkUrl.set('');
  }

  protected removeLink(index: number): void {
    this.links.update((list) => list.filter((_, i) => i !== index));
  }

  protected toggleSkill(skillId: string, checked: boolean): void {
    this.skillIds.update((ids) => (checked ? [...ids, skillId] : ids.filter((id) => id !== skillId)));
  }

  protected onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) {
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    this.uploading.set(true);
    this.http.post<MediaApiModel>(`${environment.apiBaseUrl}/v1/admin/media`, formData).subscribe({
      next: (media) => {
        this.uploading.set(false);
        this.previewImage.set(media);
      },
      error: () => {
        this.uploading.set(false);
        this.errorMessage.set("Erreur lors de l'upload de l'image.");
      },
    });
  }

  protected skillName(skillId: string): string {
    return this.skillsResource.value()?.find((s) => s.id === skillId)?.name ?? skillId;
  }

  protected onSubmit(event: Event): void {
    event.preventDefault();
    if (!this.projectForm().valid()) {
      return;
    }

    const existing = this.project();
    const payload = {
      ...this.model(),
      links: this.links(),
      skillIds: this.skillIds(),
      previewImageId: this.previewImage()?.id,
    };

    this.saving.set(true);
    this.errorMessage.set(null);
    const request = existing
      ? this.http.put(`${environment.apiBaseUrl}/v1/admin/projects/${existing.id}`, payload)
      : this.http.post(`${environment.apiBaseUrl}/v1/admin/projects`, payload);

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
    const existing = this.project();
    if (!existing) {
      return;
    }
    this.http.delete(`${environment.apiBaseUrl}/v1/admin/projects/${existing.id}`).subscribe(() => {
      this.deleted.emit();
    });
  }
}
