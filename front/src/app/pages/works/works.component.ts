import { Component, computed, inject, OnInit } from '@angular/core';
import { httpResource } from '@angular/common/http';
import { TabsService } from '@services/tabs.service';
import { Tab } from '@models/tab.model';
import { TabKey } from '@enums/tab-key.enum';
import { Path } from '@enums/path.enum';
import { JsonCardComponent } from '@components/json-card/json-card.component';
import { ExperienceApiModel } from '@models/api/experience.model';
import { environment } from '../../../environments/environment';

export interface ExperienceCardView {
  id: string;
  title: string;
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
    JsonCardComponent
  ],
  templateUrl: './works.component.html',
})
export class WorksComponent implements OnInit {
  protected readonly experiencesResource = httpResource<ExperienceApiModel[]>(
    () => `${environment.apiBaseUrl}/v1/experiences`,
  );
  public readonly experiences = computed<ExperienceCardView[]>(() =>
    (this.experiencesResource.value() ?? []).map((experience) => ({
      id: experience.id,
      title: `// ${experience.role} - ${experience.company}`,
      data: {
        company: experience.company,
        role: experience.role,
        period: experience.periodLabel,
        status: experience.status,
        skills: this.groupSkillsByCategory(experience),
        achievements: experience.achievements
          .slice()
          .sort((a, b) => a.order - b.order)
          .map((achievement) => achievement.text),
      },
    })),
  );
  private readonly tabsService = inject(TabsService);
  private worksTab: Tab = new Tab(TabKey.WORKS, ['fab', 'css3'], 'text-blue-500', 'EXPLORER.WORKS_FILE', [Path.WORKS]);

  ngOnInit() {
    this.tabsService.addTab(this.worksTab);
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
