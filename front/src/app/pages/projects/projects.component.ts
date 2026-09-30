import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { httpResource } from '@angular/common/http';
import { TabsService } from '@services/tabs.service';
import { Tab } from '@models/tab.model';
import { TabKey } from '@enums/tab-key.enum';
import { Path } from '@enums/path.enum';
import { JsonCardComponent } from '@components/json-card/json-card.component';
import { ProjectApiModel } from '@models/api/project.model';
import { ProjectCategory } from '@enums/project-category.enum';
import { KeyValuePipe, NgClass } from '@angular/common';
import { environment } from '../../../environments/environment';

export interface ProjectCardView {
  id: string;
  title: string;
  jsonObject: {
    date: string;
    name: string;
    company: string;
    category: string;
    type: string;
    status: string;
    description: string;
    skills: string[];
    links: { label: string; url: string }[];
  };
}

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
  public readonly ProjectCategory = ProjectCategory;
  protected readonly projects = httpResource<ProjectApiModel[]>(
    () => `${environment.apiBaseUrl}/v1/projects`,
  );
  public readonly filteredProjects = computed(() => {
    const projects = this.projects.value() ?? [];

    return this.selectedCategory() ? projects.filter(project => this.selectedCategory() === project.category) : projects;
  });
  // Reshaped for display: drops internal ids/order/published and flattens
  // skill/preview-image objects down to the plain, readable fields the
  // static site used to show — the raw API shape is too noisy as-is.
  public readonly projectCards = computed<ProjectCardView[]>(() =>
    this.filteredProjects().map((project) => ({
      id: project.id,
      title: `// ${project.name}`,
      jsonObject: {
        date: project.date,
        name: project.name,
        company: project.company,
        category: project.category,
        type: project.type,
        status: project.status,
        description: project.description,
        skills: project.skills.map((skill) => skill.name),
        links: [
          ...project.links.map((link) => ({ label: link.label, url: link.url })),
          ...(project.previewImage ? [{ label: 'Preview', url: project.previewImage.url }] : []),
        ],
      },
    })),
  );
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
