import { Component, inject, input, output, signal } from '@angular/core';
import { HttpClient, httpResource } from '@angular/common/http';
import { KeyValuePipe } from '@angular/common';
import { SkillApiModel, SkillCategoryEntryApiModel } from '@models/api/skill-catalog.model';
import { SkillLevel } from '@enums/skill-level.enum';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-skill-category-edit-form',
  imports: [KeyValuePipe],
  templateUrl: './skill-category-edit-form.component.html',
})
export class SkillCategoryEditFormComponent {
  public readonly categoryId = input.required<string>();
  public readonly categoryLabel = input.required<string>();
  public readonly closed = output<void>();
  private readonly http = inject(HttpClient);

  protected readonly SkillLevel = SkillLevel;
  protected readonly skillsResource = httpResource<SkillApiModel[]>(
    () => `${environment.apiBaseUrl}/v1/admin/skills`,
  );
  protected readonly entriesResource = httpResource<SkillCategoryEntryApiModel[]>(
    () => `${environment.apiBaseUrl}/v1/admin/skills/categories/${this.categoryId()}/entries`,
  );

  protected readonly newSkillName = signal('');
  protected readonly entrySkillId = signal('');
  protected readonly entryLevel = signal<SkillLevel>(SkillLevel.ACQUIRED);
  protected readonly entryOrder = signal(0);

  protected createSkill(): void {
    const name = this.newSkillName().trim();
    if (!name) {
      return;
    }

    this.http.post<SkillApiModel>(`${environment.apiBaseUrl}/v1/admin/skills`, { name }).subscribe((skill) => {
      this.newSkillName.set('');
      this.skillsResource.reload();
      this.entrySkillId.set(skill.id);
    });
  }

  protected upsertEntry(): void {
    const skillId = this.entrySkillId();
    if (!skillId) {
      return;
    }

    this.http
      .put(`${environment.apiBaseUrl}/v1/admin/skills/categories/${this.categoryId()}/entries`, {
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
    this.http
      .delete(`${environment.apiBaseUrl}/v1/admin/skills/categories/${this.categoryId()}/entries/${skillId}`)
      .subscribe(() => this.entriesResource.reload());
  }
}
