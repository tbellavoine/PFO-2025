import { MenuItem } from '../../models/menu-item.model';
import { MenuKey } from '../../enums/menu-key.enum';

export const AboutMenu: readonly MenuItem[] = [
  new MenuItem(MenuKey.LINKEDIN, ['fab', 'linkedin'], 'MENUS.LINKEDIN', undefined, 'https://www.linkedin.com/in/t-bellavoine/'),
  new MenuItem(MenuKey.GITHUB, ['fab', 'github'], 'MENUS.GITHUB', undefined, 'https://github.com/tbellavoine?tab=repositories'),
];
