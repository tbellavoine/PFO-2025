import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { TabKey } from '@enums/tab-key.enum';

export class Tab {
  private readonly _key: TabKey | string | undefined;
  private readonly _icon: IconProp | undefined;
  private readonly _iconTheme: string | undefined;
  private readonly _label: string | undefined;
  private readonly _route: any[];

  constructor(key: TabKey | string | undefined, icon: IconProp | undefined, iconTheme: string | undefined, label: string | undefined, route: any[]) {
    this._key = key;
    this._icon = icon;
    this._iconTheme = iconTheme;
    this._label = label;
    this._route = route;
  }

  get key(): TabKey | string | undefined {
    return this._key;
  }

  get icon(): IconProp | undefined {
    return this._icon;
  }

  get iconTheme(): string | undefined {
    return this._iconTheme;
  }

  get label(): string | undefined {
    return this._label;
  }

  get route(): any[] {
    return this._route;
  }
}
