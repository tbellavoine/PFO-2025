import { Component, signal } from '@angular/core';
import { Menu } from './menu.const';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'titlebar',
  imports: [
    RouterLink,
    TranslatePipe
  ],
  templateUrl: './title-bar.component.html'
})
export class TitleBarComponent {
  public title = signal<string>('Thomas BELLAVOINE - Visual Studio Code');
  protected readonly Menu = Menu;
}
