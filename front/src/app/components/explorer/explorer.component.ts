import { Component, computed } from '@angular/core';
import { ExplorerMap } from '@components/explorer/explorer.map';
import { NgClass, UpperCasePipe } from '@angular/common';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { AccordionContent, AccordionGroup, AccordionPanel, AccordionTrigger } from '@angular/aria/accordion';
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
    NgClass,
    AccordionGroup,
    AccordionTrigger,
    AccordionPanel,
    AccordionContent
  ],
  templateUrl: './explorer.component.html'
})
export class ExplorerComponent {
  protected explorerMap = computed(() => {
    ExplorerMap.set('MENUS.ASSETS', Array.from(ImageAssetsMap).map((imageAsset) => new MenuItem(MenuKey.PREVIEW, ['fas', 'image'], imageAsset[1], [Path.PREVIEW, imageAsset[0]], undefined, 'text-blue-300')));
    return Array.from(ExplorerMap.entries());
  });
  protected readonly Path = Path;
}
