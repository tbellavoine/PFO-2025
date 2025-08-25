import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { TabsService } from '@services/tabs.service';
import { Tab } from '@models/tab.model';
import { TabKey } from '@enums/tab-key.enum';
import { Path } from '@enums/path.enum';
import { JsonCardComponent } from '@components/json-card/json-card.component';
import { Projects } from './projets.const';
import { Project } from '@models/project.model';
import { ProjectCategory } from '@enums/project-category.enum';
import { KeyValuePipe, NgClass } from '@angular/common';

@Component({
  selector: 'app-projects',
  imports: [
    JsonCardComponent,
    KeyValuePipe,
    NgClass
  ],
  templateUrl: './projects.component.html',
})
export class ProjectsComponent implements OnInit {
  public selectedCategory = signal<string>('');
  protected readonly projects: Project[] = Projects;
  protected readonly ProjectCategory = ProjectCategory;
  protected readonly filteredProjects = computed(() => {
    return this.selectedCategory() ? [...this.projects].filter(project => this.selectedCategory() === project.category) : this.projects;
  });
  private readonly tabsService = inject(TabsService);
  private projectsTab: Tab = new Tab(TabKey.PROJECTS, ['fas', 'code'], 'text-blue-500', 'EXPLORER.PROJECTS_FILE', [Path.PROJECTS]);

  ngOnInit(): void {
    this.tabsService.addTab(this.projectsTab);
  }

  /**
   * Filter projects by category
   * @param category
   */
  filterProjectsByCategory(category: string): void {
    this.selectedCategory.set(category);
  }
}
