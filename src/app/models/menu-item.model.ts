import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { MenuKey } from '@enums/menu-key.enum';

export class MenuItem {
  private readonly _key: MenuKey;
  private readonly _icon: IconProp | undefined;
  private readonly _label: string | undefined;
  private readonly _route: string | (string | number)[] | undefined;
  private readonly _link: string | undefined;
  private readonly _theme: string | undefined;

  constructor(key: MenuKey, icon: IconProp | undefined, label: string | undefined, route: string | (string | number)[] | undefined, link?: string | undefined, theme?: string | undefined) {
    this._key = key;
    this._icon = icon;
    this._label = label;
    this._route = route;
    this._link = link;
    this._theme = theme;
  }

  get key(): MenuKey {
    return this._key;
  }

  get icon(): IconProp | undefined {
    return this._icon;
  }

  get label(): string | undefined {
    return this._label;
  }

  get route(): string | (string | number)[] | undefined {
    return this._route;
  }

  get link(): string | undefined {
    return this._link;
  }

  get theme(): string | undefined {
    return this._theme;
  }
}
