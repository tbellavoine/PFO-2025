import { Routes } from '@angular/router';
import { ProfileComponent } from './pages/profile/profile.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { WorksComponent } from './pages/works/works.component';
import { HomeComponent } from './pages/home/home.component';
import { ContactComponent } from './pages/contact/contact.component';
import { SkillsComponent } from './pages/skills/skills.component';
import { ProjectsComponent } from './pages/projects/projects.component';
import { Path } from './enums/path.enum';
import { ImageViewerComponent } from '@components/image-viewer/image-viewer.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: Path.HOME,
    pathMatch: 'full',
  },
  {
    path: Path.HOME,
    component: HomeComponent,
  },
  {
    path: Path.PROFILE,
    component: ProfileComponent
  },
  {
    path: Path.WORKS,
    component: WorksComponent
  },
  {
    path: Path.SKILLS,
    component: SkillsComponent
  },
  {
    path: Path.PROJECTS,
    component: ProjectsComponent
  },
  {
    path: Path.CONTACT,
    component: ContactComponent
  },
  {
    path: Path.PREVIEW + '/:imageName',
    component: ImageViewerComponent
  },
  {
    path: '**',
    component: NotFoundComponent
  }
];
