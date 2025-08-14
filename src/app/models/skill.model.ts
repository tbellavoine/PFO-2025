export class Skill {
  private readonly _key: string;
  private readonly _iconUrl: string;
  private readonly _label: string;
  private readonly _description: string;

  constructor(key: string, iconUrl: string, label: string, description: string) {
    this._key = key;
    this._iconUrl = iconUrl;
    this._label = label;
    this._description = description;
  }

  get key(): string {
    return this._key;
  }

  get iconUrl(): string {
    return this._iconUrl;
  }

  get label(): string {
    return this._label;
  }

  get description(): string {
    return this._description;
  }
}
