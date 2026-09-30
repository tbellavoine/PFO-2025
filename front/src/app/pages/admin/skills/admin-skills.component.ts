import { Component, inject, signal } from '@angular/core';
import { HttpClient, httpResource } from '@angular/common/http';
import { KeyValuePipe } from '@angular/common';
import { SkillApiModel, SkillCategoryEntity, SkillCategoryEntryApiModel } from '@models/api/skill-catalog.model';
import { SkillLevel } from '@enums/skill-level.enum';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-admin-skills',
  imports: [KeyValuePipe],
  templateUrl: './admin-skills.component.html',
})
export class AdminSkillsComponent {
  private readonly http = inject(HttpClient);

  protected readonly SkillLevel = SkillLevel;
  protected readonly skillsResource = httpResource<SkillApiModel[]>(
    () => `${environment.apiBaseUrl}/v1/admin/skills`,
  );
  protected readonly categoriesResource = httpResource<SkillCategoryEntity[]>(
    () => `${environment.apiBaseUrl}/v1/admin/skills/categories`,
  );
  protected readonly selectedCategoryId = signal<string | null>(null);
  protected readonly entriesResource = httpResource<SkillCategoryEntryApiModel[]>(() => {
    const categoryId = this.selectedCategoryId();

    return categoryId ? `${environment.apiBaseUrl}/v1/admin/skills/categories/${categoryId}/entries` : undefined;
  });

  protected readonly newSkillName = signal('');
  protected readonly entrySkillId = signal('');
  protected readonly entryLevel = signal<SkillLevel>(SkillLevel.ACQUIRED);
  protected readonly entryOrder = signal(0);

  protected selectCategory(categoryId: string): void {
    this.selectedCategoryId.set(categoryId);
  }

  protected addSkill(): void {
    const name = this.newSkillName().trim();
    if (!name) {
      return;
    }

    this.http.post(`${environment.apiBaseUrl}/v1/admin/skills`, { name }).subscribe(() => {
      this.newSkillName.set('');
      this.skillsResource.reload();
    });
  }

  protected deleteSkill(id: string): void {
    this.http.delete(`${environment.apiBaseUrl}/v1/admin/skills/${id}`).subscribe(() => {
      this.skillsResource.reload();
    });
  }

  protected upsertEntry(): void {
    const categoryId = this.selectedCategoryId();
    const skillId = this.entrySkillId();
    if (!categoryId || !skillId) {
      return;
    }

    this.http
      .put(`${environment.apiBaseUrl}/v1/admin/skills/categories/${categoryId}/entries`, {
        skillId,
        level: this.entryLevel(),
        order: this.entryOrder(),
      })
      .subscribe(() => {
        this.entrySkillId.set('');
        this.entryOrder.set(0);
        this.entriesResource.reload();
      });
  }

  protected deleteEntry(skillId: string): void {
    const categoryId = this.selectedCategoryId();
    if (!categoryId) {
      return;
    }

    this.http
      .delete(`${environment.apiBaseUrl}/v1/admin/skills/categories/${categoryId}/entries/${skillId}`)
      .subscribe(() => this.entriesResource.reload());
  }
}
