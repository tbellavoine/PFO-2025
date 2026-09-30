import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { Path } from '@enums/path.enum';

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
    loadComponent: () => import('./pages/profile/profile.component').then((m) => m.ProfileComponent)
  },
  {
    path: Path.WORKS,
    loadComponent: () => import('./pages/works/works.component').then((m) => m.WorksComponent)
  },
  {
    path: Path.SKILLS,
    loadComponent: () => import('./pages/skills/skills.component').then((m) => m.SkillsComponent)
  },
  {
    path: Path.PROJECTS,
    loadComponent: () => import('./pages/projects/projects.component').then((m) => m.ProjectsComponent)
  },
  {
    path: Path.CONTACT,
    loadComponent: () => import('./pages/contact/contact.component').then((m) => m.ContactComponent)
  },
  {
    path: `${Path.PREVIEW}/:imageName`,
    loadComponent: () => import('@components/image-viewer/image-viewer.component').then((m) => m.ImageViewerComponent)
  },
  {
    path: Path.TICTACTOE_V2,
    loadComponent: () => import('./pages/tic-tac-toe/tic-tac-toe.component').then((m) => m.TicTacToeComponent)
  },
  {
    path: Path.SNAKE,
    loadComponent: () => import('./pages/snake/snake.component').then((m) => m.SnakeComponent)
  },
  {
    path: Path.TWENTY_FORTY_EIGHT,
    loadComponent: () => import('./pages/twenty-forty-eight/twenty-forty-eight.component').then((m) => m.TwentyFortyEightComponent)
  },
  {
    path: '**',
    loadComponent: () => import('./pages/not-found/not-found.component').then((m) => m.NotFoundComponent)
  }
];
