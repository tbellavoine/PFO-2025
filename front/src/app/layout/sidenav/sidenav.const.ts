import { MenuItem } from '@models/menu-item.model';
import { MenuKey } from '@enums/menu-key.enum';
import { Path } from '@enums/path.enum';

export const SidenavBottom: readonly MenuItem[] = [
  new MenuItem(MenuKey.PROFILE, ['far', 'address-card'], undefined, Path.PROFILE),
];
