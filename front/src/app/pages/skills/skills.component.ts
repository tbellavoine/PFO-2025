import { Component, computed, inject, OnInit } from '@angular/core';
import { httpResource } from '@angular/common/http';
import { TabsService } from '@services/tabs.service';
import { Tab } from '@models/tab.model';
import { TabKey } from '@enums/tab-key.enum';
import { Path } from '@enums/path.enum';
import { JsonCardComponent } from '@components/json-card/json-card.component';
import { SkillCategoryApiModel } from '@models/api/skill-category.model';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-skills',
  imports: [
    JsonCardComponent
  ],
  templateUrl: './skills.component.html',
})
export class SkillsComponent implements OnInit {
  protected readonly categories = httpResource<SkillCategoryApiModel[]>(
    () => `${environment.apiBaseUrl}/v1/skills`,
  );
  public readonly frontObject = computed(() => this.categorySkills('front_end'));
  public readonly backObject = computed(() => this.categorySkills('back_end'));
  public readonly uxUiObject = computed(() => this.categorySkills('ux_ui'));
  public readonly devOpsObject = computed(() => this.categorySkills('dev_ops'));
  public readonly toolsObject = computed(() => this.categorySkills('tools'));
  public readonly qualityObject = computed(() => this.categorySkills('quality'));
  public moreSkills: string[] = ['material-design', 'responsive-design', 'seo', 'wordpress', 'twig', 'salesForce-commerce-cloud', 'office'];
  private readonly tabsService = inject(TabsService);
  private skillsTab: Tab = new Tab(TabKey.SKILLS, ['fab', 'js'], 'text-yellow-500', 'EXPLORER.SKILLS_FILE', [Path.SKILLS]);

  ngOnInit() {
    this.tabsService.addTab(this.skillsTab);
  }

  /**
   * Reshape a category's {name, level}[] entries into a plain object for json-card
   * @param key
   * @private
   */
  private categorySkills(key: string): Record<string, string> {
    const category = (this.categories.value() ?? []).find((c) => c.key === key);
    return Object.fromEntries((category?.skills ?? []).map((s) => [s.name, s.level]));
  }
}
