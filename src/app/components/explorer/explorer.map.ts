import { MenuItem } from '../../models/menu-item.model';
import { MenuKey } from '../../enums/menu-key.enum';
import { Path } from '../../enums/path.enum';

const AboutMenu: MenuItem[] = [
  new MenuItem(MenuKey.PROFILE, ['fab', 'html5'], 'EXPLORER.ME_FILE', Path.PROFILE, undefined, 'text-orange-500'),
  new MenuItem(MenuKey.WORKS, ['fab', 'css3'], 'EXPLORER.WORKS_FILE', Path.WORKS, undefined, 'text-blue-500'),
  new MenuItem(MenuKey.SKILLS, ['fab', 'js'], 'EXPLORER.SKILLS_FILE', Path.SKILLS, undefined, 'text-yellow-500'),
  new MenuItem(MenuKey.PROJECTS, ['fas', 'code'], 'EXPLORER.PROJECTS_FILE', Path.PROJECTS, undefined, 'text-blue-500'),
];

const SideProjectsMenu: MenuItem[] = [
  new MenuItem(MenuKey.DASHBOARD, ['fas', 'folder'], 'EXPLORER.DASHBOARD', Path.DASHBOARD, undefined, 'text-light'),
  new MenuItem(MenuKey.MEMORY, ['fas', 'folder'], 'EXPLORER.MEMORY', Path.MEMORY, undefined, 'text-light'),
];

const ContactMenu: MenuItem[] = [
  new MenuItem(MenuKey.CONTACT, ['fas', 'envelope'], 'EXPLORER.CONTACT_FILE', Path.CONTACT, undefined, 'text-accent')
];

export const ExplorerMap: Map<string, MenuItem[]> = new Map([
  ['ABOUT', AboutMenu],
  ['SIDE_PROJETS', SideProjectsMenu],
  ['CONTACT', ContactMenu]
]);



