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
import { ProjectApiModel } from '@models/api/project.model';
import { ProjectEditFormComponent } from './project-edit-form.component';
import { formatDateRange } from '@components/month-year-picker/format-date-range';
import { ProjectCategory } from '@enums/project-category.enum';
import { KeyValuePipe, NgClass } from '@angular/common';
import { environment } from '../../../environments/environment';

export interface ProjectCardView {
  id: string;
  title: string;
  published: boolean;
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
    NgClass,
    EditButtonComponent,
    ModalComponent,
    ProjectEditFormComponent,
  ],
  templateUrl: './projects.component.html',
})
export class ProjectsComponent implements OnInit {
  public selectedCategory = signal<string>('');
  public readonly ProjectCategory = ProjectCategory;
  private readonly tabsService = inject(TabsService);
  private readonly authService = inject(AuthService);
  private projectsTab: Tab = new Tab(TabKey.PROJECTS, ['fas', 'code'], 'text-blue-500', 'EXPLORER.PROJECTS_FILE', [Path.PROJECTS]);
  protected readonly admin = this.authService.admin;
  // Admins see drafts too (via the admin endpoint); everyone else gets the
  // public, published-only view.
  protected readonly projects = httpResource<ProjectApiModel[]>(() =>
    this.admin() ? `${environment.apiBaseUrl}/v1/admin/projects` : `${environment.apiBaseUrl}/v1/projects`,
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
      published: project.published,
      jsonObject: {
        date: formatDateRange(project.startDate, project.endDate),
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
  protected readonly editingId = signal<string | 'new' | null>(null);

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

  protected editingProject(): ProjectApiModel | null {
    const id = this.editingId();
    if (id === null || id === 'new') {
      return null;
    }
    return this.projects.value()?.find((p) => p.id === id) ?? null;
  }

  protected onSaved(): void {
    this.editingId.set(null);
    this.projects.reload();
  }

  protected onDeleted(): void {
    this.editingId.set(null);
    this.projects.reload();
  }
}
