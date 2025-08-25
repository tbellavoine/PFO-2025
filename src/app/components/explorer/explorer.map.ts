import { MenuItem } from '@models/menu-item.model';
import { MenuKey } from '@enums/menu-key.enum';
import { Path } from '@enums/path.enum';

const AboutMenu: MenuItem[] = [
  new MenuItem(MenuKey.PROFILE, ['fab', 'html5'], 'EXPLORER.ME_FILE', Path.PROFILE, undefined, 'text-orange-500'),
  new MenuItem(MenuKey.WORKS, ['fab', 'css3'], 'EXPLORER.WORKS_FILE', Path.WORKS, undefined, 'text-blue-500'),
  new MenuItem(MenuKey.SKILLS, ['fab', 'js'], 'EXPLORER.SKILLS_FILE', Path.SKILLS, undefined, 'text-yellow-500'),
  new MenuItem(MenuKey.PROJECTS, ['fas', 'code'], 'EXPLORER.PROJECTS_FILE', Path.PROJECTS, undefined, 'text-blue-500'),
];

const GamesMenu: MenuItem[] = [
  new MenuItem(MenuKey.TICTACTOE_V2, ['fas', 'folder'], 'EXPLORER.TICTACTOE_V2', Path.TICTACTOE_V2, undefined, 'text-light'),
  new MenuItem(MenuKey.SNAKE, ['fas', 'folder'], 'EXPLORER.SNAKE', Path.SNAKE, undefined, 'text-light'),
  new MenuItem(MenuKey.TWENTY_FORTY_EIGHT, ['fas', 'folder'], 'EXPLORER.TWENTY_FORTY_EIGHT', Path.TWENTY_FORTY_EIGHT, undefined, 'text-light'),
];

const ContactMenu: MenuItem[] = [
  new MenuItem(MenuKey.CONTACT, ['fas', 'envelope'], 'EXPLORER.CONTACT_FILE', Path.CONTACT, undefined, 'text-accent')
];

export const ExplorerMap: Map<string, MenuItem[]> = new Map([
  ['MENUS.ABOUT', AboutMenu],
  ['MENUS.GAMES', GamesMenu],
  ['MENUS.CONTACT', ContactMenu]
]);



