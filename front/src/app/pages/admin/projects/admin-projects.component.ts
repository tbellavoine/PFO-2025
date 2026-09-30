import { Component, effect, inject, signal } from '@angular/core';
import { HttpClient, httpResource } from '@angular/common/http';
import { KeyValuePipe } from '@angular/common';
import { form, required, FormField } from '@angular/forms/signals';
import { ProjectApiModel } from '@models/api/project.model';
import { SkillApiModel } from '@models/api/skill-catalog.model';
import { MediaApiModel } from '@models/api/media.model';
import { Company } from '@enums/company.enum';
import { ProjectCategory } from '@enums/project-category.enum';
import { ProjectType } from '@enums/project-type.enum';
import { ProjectStatus } from '@enums/project-status.enum';
import { environment } from '../../../../environments/environment';

interface ProjectFormModel {
  date: string;
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
  date: '',
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
  selector: 'app-admin-projects',
  imports: [FormField, KeyValuePipe],
  templateUrl: './admin-projects.component.html',
})
export class AdminProjectsComponent {
  private readonly http = inject(HttpClient);

  protected readonly Company = Company;
  protected readonly ProjectCategory = ProjectCategory;
  protected readonly ProjectType = ProjectType;
  protected readonly ProjectStatus = ProjectStatus;

  protected readonly projectsResource = httpResource<ProjectApiModel[]>(
    () => `${environment.apiBaseUrl}/v1/admin/projects`,
  );
  protected readonly skillsResource = httpResource<SkillApiModel[]>(
    () => `${environment.apiBaseUrl}/v1/admin/skills`,
  );

  protected readonly editingId = signal<string | 'new' | null>(null);
  protected readonly model = signal<ProjectFormModel>({ ...EMPTY_MODEL });
  protected readonly projectForm = form(this.model, (path) => {
    required(path.date);
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
  protected readonly statusMessage = signal<string | null>(null);

  constructor() {
    effect(() => {
      const id = this.editingId();
      if (id === 'new' || id === null) {
        return;
      }
      const project = this.projectsResource.value()?.find((p) => p.id === id);
      if (project) {
        this.model.set({
          date: project.date,
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
      }
    });
  }

  protected startCreate(): void {
    this.model.set({ ...EMPTY_MODEL });
    this.links.set([]);
    this.skillIds.set([]);
    this.previewImage.set(null);
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
        this.statusMessage.set("Erreur lors de l'upload de l'image.");
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

    const id = this.editingId();
    const payload = {
      ...this.model(),
      links: this.links(),
      skillIds: this.skillIds(),
      previewImageId: this.previewImage()?.id,
    };

    this.saving.set(true);
    this.statusMessage.set(null);
    const request =
      id === 'new'
        ? this.http.post(`${environment.apiBaseUrl}/v1/admin/projects`, payload)
        : this.http.put(`${environment.apiBaseUrl}/v1/admin/projects/${id}`, payload);

    request.subscribe({
      next: () => {
        this.saving.set(false);
        this.projectsResource.reload();
        this.editingId.set(null);
      },
      error: () => {
        this.saving.set(false);
        this.statusMessage.set("Erreur lors de l'enregistrement.");
      },
    });
  }

  protected deleteProject(id: string): void {
    this.http.delete(`${environment.apiBaseUrl}/v1/admin/projects/${id}`).subscribe(() => {
      this.projectsResource.reload();
    });
  }
}
