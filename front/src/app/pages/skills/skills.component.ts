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
import { SkillCategoryApiModel } from '@models/api/skill-category.model';
import { SkillCategoryEntity } from '@models/api/skill-catalog.model';
import { SkillCategoryEditFormComponent } from './skill-category-edit-form.component';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-skills',
  imports: [
    JsonCardComponent,
    EditButtonComponent,
    ModalComponent,
    SkillCategoryEditFormComponent,
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
  private readonly authService = inject(AuthService);
  private skillsTab: Tab = new Tab(TabKey.SKILLS, ['fab', 'js'], 'text-yellow-500', 'EXPLORER.SKILLS_FILE', [Path.SKILLS]);
  protected readonly admin = this.authService.admin;
  protected readonly editingCategoryKey = signal<string | null>(null);
  // Only fetched when connected: the public /v1/skills view has no ids,
  // but editing a category's entries needs its real id.
  protected readonly categoryIds = httpResource<SkillCategoryEntity[]>(() =>
    this.admin() ? `${environment.apiBaseUrl}/v1/admin/skills/categories` : undefined,
  );

  ngOnInit() {
    this.tabsService.addTab(this.skillsTab);
  }

  protected categoryIdFor(key: string): string | undefined {
    return this.categoryIds.value()?.find((c) => c.key === key)?.id;
  }

  protected categoryLabelFor(key: string): string {
    return this.categories.value()?.find((c) => c.key === key)?.label ?? key;
  }

  protected closeCategoryEditor(): void {
    this.editingCategoryKey.set(null);
    this.categories.reload();
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
