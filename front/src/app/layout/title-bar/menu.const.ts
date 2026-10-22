import { MenuItem } from '@models/menu-item.model';
import { MenuKey } from '@enums/menu-key.enum';
import { Path } from '@enums/path.enum';

export const Menu: readonly MenuItem[] = [
  new MenuItem(MenuKey.WORKS, undefined, 'MENUS.WORKS', Path.WORKS),
  new MenuItem(MenuKey.SKILLS, undefined, 'MENUS.SKILLS', Path.SKILLS),
  new MenuItem(MenuKey.PROJECTS, undefined, 'MENUS.PROJECTS', Path.PROJECTS),
  new MenuItem(MenuKey.CONTACT, undefined, 'MENUS.CONTACT', Path.CONTACT),
  new MenuItem(MenuKey.ABOUT, undefined, 'MENUS.ABOUT', Path.PROFILE),
];
