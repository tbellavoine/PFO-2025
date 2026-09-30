import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { Path } from '@enums/path.enum';

const TITLE_SUFFIX = 'Thomas BELLAVOINE';

export const routes: Routes = [
  {
    path: '',
    redirectTo: Path.HOME,
    pathMatch: 'full',
  },
  {
    path: Path.HOME,
    component: HomeComponent,
    title: TITLE_SUFFIX,
  },
  {
    path: Path.PROFILE,
    loadComponent: () => import('./pages/profile/profile.component').then((m) => m.ProfileComponent),
    title: `A propos · ${TITLE_SUFFIX}`,
  },
  {
    path: Path.WORKS,
    loadComponent: () => import('./pages/works/works.component').then((m) => m.WorksComponent),
    title: `Expériences · ${TITLE_SUFFIX}`,
  },
  {
    path: Path.SKILLS,
    loadComponent: () => import('./pages/skills/skills.component').then((m) => m.SkillsComponent),
    title: `Compétences · ${TITLE_SUFFIX}`,
  },
  {
    path: Path.PROJECTS,
    loadComponent: () => import('./pages/projects/projects.component').then((m) => m.ProjectsComponent),
    title: `Projets · ${TITLE_SUFFIX}`,
  },
  {
    path: Path.CONTACT,
    loadComponent: () => import('./pages/contact/contact.component').then((m) => m.ContactComponent),
    title: `Contact · ${TITLE_SUFFIX}`,
  },
  {
    path: `${Path.PREVIEW}/:imageName`,
    loadComponent: () => import('@components/image-viewer/image-viewer.component').then((m) => m.ImageViewerComponent),
    title: `Projet · ${TITLE_SUFFIX}`,
  },
  {
    path: Path.TICTACTOE_V2,
    loadComponent: () => import('./pages/tic-tac-toe/tic-tac-toe.component').then((m) => m.TicTacToeComponent),
    title: `Morpion · ${TITLE_SUFFIX}`,
  },
  {
    path: Path.SNAKE,
    loadComponent: () => import('./pages/snake/snake.component').then((m) => m.SnakeComponent),
    title: `Snake · ${TITLE_SUFFIX}`,
  },
  {
    path: Path.TWENTY_FORTY_EIGHT,
    loadComponent: () => import('./pages/twenty-forty-eight/twenty-forty-eight.component').then((m) => m.TwentyFortyEightComponent),
    title: `2048 · ${TITLE_SUFFIX}`,
  },
  {
    path: '**',
    loadComponent: () => import('./pages/not-found/not-found.component').then((m) => m.NotFoundComponent),
    title: `Page introuvable · ${TITLE_SUFFIX}`,
  }
];
