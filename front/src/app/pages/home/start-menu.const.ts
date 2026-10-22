import { MenuItem } from '@models/menu-item.model';
import { MenuKey } from '@enums/menu-key.enum';
import { Path } from '@enums/path.enum';

export const StartMenu: readonly MenuItem[] = [
  new MenuItem(MenuKey.WORKS, ['far', 'file'], 'MENUS.WORKS_START', '../' + Path.WORKS),
  new MenuItem(MenuKey.SKILLS, ['fas', 'code'], 'MENUS.SKILLS_START', '../' + Path.SKILLS),
  new MenuItem(MenuKey.PROJECTS, ['far', 'folder-open'], 'MENUS.PROJECTS_START', '../' + Path.PROJECTS),
  new MenuItem(MenuKey.CONTACT, ['far', 'message'], 'MENUS.CONTACT_START', '../' + Path.CONTACT),
];
