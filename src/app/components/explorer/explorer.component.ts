import { Component, computed, signal } from '@angular/core';
import { ExplorerMap } from '@components/explorer/explorer.map';
import { NgClass, UpperCasePipe } from '@angular/common';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { Path } from '@enums/path.enum';
import { ImageAssetsMap } from '@components/explorer/assets-images.const';
import { MenuItem } from '@models/menu-item.model';
import { MenuKey } from '@enums/menu-key.enum';

@Component({
  selector: 'explorer',
  imports: [
    UpperCasePipe,
    FaIconComponent,
    RouterLink,
    RouterLinkActive,
    TranslatePipe,
    NgClass
  ],
  templateUrl: './explorer.component.html'
})
export class ExplorerComponent {
  protected explorerMap = computed(() => {
    ExplorerMap.set('MENUS.ASSETS', Array.from(ImageAssetsMap).map((imageAsset) => new MenuItem(MenuKey.PREVIEW, ['fas', 'image'], imageAsset[1], [Path.PREVIEW, imageAsset[0]], undefined, 'text-blue-300')));
    return Array.from(ExplorerMap.entries());
  });
  public openCategories = signal<Set<string>>(new Set(this.explorerMap().map(category => category[0])));
  protected readonly Path = Path;

  /**
   * Toggle the open state of a category
   * @param categoryName
   */
  public toggleCategory(categoryName: string): void {
    const current: Set<string> = this.openCategories();
    const newSet = new Set(current);

    if (newSet.has(categoryName)) {
      newSet.delete(categoryName);
    } else {
      newSet.add(categoryName);
    }

    this.openCategories.set(newSet);
  }

  /**
   * Check if a category is open
   * @param categoryName
   * @returns boolean
   */
  public isCategoryOpen(categoryName: string): boolean {
    return this.openCategories().has(categoryName);
  }
}
