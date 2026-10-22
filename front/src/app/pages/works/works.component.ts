import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { httpResource } from '@angular/common/http';
import { TabsService } from '@services/tabs.service';
import { AuthService } from '@services/auth.service';
import { Tab } from '@models/tab.model';
import { TabKey } from '@enums/tab-key.enum';
import { Path } from '@enums/path.enum';
import { JsonCardComponent } from '@components/json-card/json-card.component';
import { EditButtonComponent } from '@components/edit-button/edit-button.component';
import { ModalComponent } from '@components/modal/modal.component';
import { ExperienceApiModel } from '@models/api/experience.model';
import { formatDateRange } from '@components/month-year-picker/format-date-range';
import { ExperienceEditFormComponent } from './experience-edit-form.component';
import { environment } from '../../../environments/environment';

export interface ExperienceCardView {
  id: string;
  title: string;
  published: boolean;
  data: {
    company: string;
    role: string;
    period: string;
    status: string;
    skills: Record<string, string[]>;
    achievements: string[];
  };
}

@Component({
  selector: 'app-works',
  imports: [
    JsonCardComponent,
    EditButtonComponent,
    ModalComponent,
    ExperienceEditFormComponent,
  ],
  templateUrl: './works.component.html',
})
export class WorksComponent implements OnInit {
  private readonly tabsService = inject(TabsService);
  private readonly authService = inject(AuthService);
  private worksTab: Tab = new Tab(TabKey.WORKS, ['fab', 'css3'], 'text-blue-500', 'EXPLORER.WORKS_FILE', [Path.WORKS]);
  protected readonly admin = this.authService.admin;
  // Admins see drafts too (via the admin endpoint); everyone else gets the
  // public, published-only view.
  protected readonly experiencesResource = httpResource<ExperienceApiModel[]>(() =>
    this.admin()
      ? `${environment.apiBaseUrl}/v1/admin/experiences`
      : `${environment.apiBaseUrl}/v1/experiences`,
  );
  public readonly experiences = computed<ExperienceCardView[]>(() =>
    (this.experiencesResource.value() ?? []).map((experience) => ({
      id: experience.id,
      title: `// ${experience.role} - ${experience.company}`,
      published: experience.published,
      data: {
        company: experience.company,
        role: experience.role,
        period: formatDateRange(experience.startDate, experience.endDate),
        status: experience.status,
        skills: this.groupSkillsByCategory(experience),
        achievements: experience.achievements
          .slice()
          .sort((a, b) => a.order - b.order)
          .map((achievement) => achievement.text),
      },
    })),
  );
  protected readonly editingId = signal<string | 'new' | null>(null);

  ngOnInit() {
    this.tabsService.addTab(this.worksTab);
  }

  protected editingExperience(): ExperienceApiModel | null {
    const id = this.editingId();
    if (id === null || id === 'new') {
      return null;
    }
    return this.experiencesResource.value()?.find((e) => e.id === id) ?? null;
  }

  protected onSaved(): void {
    this.editingId.set(null);
    this.experiencesResource.reload();
  }

  protected onDeleted(): void {
    this.editingId.set(null);
    this.experiencesResource.reload();
  }

  /**
   * Regroup an experience's flat skill entries by their category key
   * @param experience
   * @private
   */
  private groupSkillsByCategory(experience: ExperienceApiModel): Record<string, string[]> {
    const grouped: Record<string, string[]> = {};
    for (const entry of experience.skills) {
      (grouped[entry.category.key] ??= []).push(entry.skill.name);
    }

    return grouped;
  }
}
