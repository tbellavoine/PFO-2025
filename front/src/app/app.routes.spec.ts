import { Route } from '@angular/router';
import { routes } from './app.routes';
import { Path } from '@enums/path.enum';
import { ImageViewerComponent } from '@components/image-viewer/image-viewer.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { WorksComponent } from './pages/works/works.component';
import { SkillsComponent } from './pages/skills/skills.component';
import { ProjectsComponent } from './pages/projects/projects.component';
import { ContactComponent } from './pages/contact/contact.component';
import { TicTacToeComponent } from './pages/tic-tac-toe/tic-tac-toe.component';
import { SnakeComponent } from './pages/snake/snake.component';
import { TwentyFortyEightComponent } from './pages/twenty-forty-eight/twenty-forty-eight.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';

describe('routes', () => {
  const findRoute = (path: string): Route | undefined => routes.find((route) => route.path === path);

  it('should redirect the empty path to home', () => {
    expect(findRoute('')?.redirectTo).toBe(Path.HOME);
  });

  it.each([
    [Path.PROFILE, ProfileComponent],
    [Path.WORKS, WorksComponent],
    [Path.SKILLS, SkillsComponent],
    [Path.PROJECTS, ProjectsComponent],
    [Path.CONTACT, ContactComponent],
    [Path.TICTACTOE_V2, TicTacToeComponent],
    [Path.SNAKE, SnakeComponent],
    [Path.TWENTY_FORTY_EIGHT, TwentyFortyEightComponent],
    ['**', NotFoundComponent],
  ])('should lazy load the component for "%s"', async (path, component) => {
    expect(await findRoute(path)?.loadComponent?.()).toBe(component);
  });

  it('should lazy load the image viewer for preview/:imageName', async () => {
    expect(await findRoute(`${Path.PREVIEW}/:imageName`)?.loadComponent?.()).toBe(ImageViewerComponent);
  });

  it('should not match a preview without image name', () => {
    expect(findRoute(Path.PREVIEW)).toBeUndefined();
  });
});
