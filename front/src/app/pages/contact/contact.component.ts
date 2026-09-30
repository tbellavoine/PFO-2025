import { Component, inject, OnInit, signal } from '@angular/core';
import { httpResource } from '@angular/common/http';
import { Tab } from '@models/tab.model';
import { TabKey } from '@enums/tab-key.enum';
import { Path } from '@enums/path.enum';
import { TabsService } from '@services/tabs.service';
import { AuthService } from '@services/auth.service';
import { JsonCardComponent } from '@components/json-card/json-card.component';
import { EditButtonComponent } from '@components/edit-button/edit-button.component';
import { ModalComponent } from '@components/modal/modal.component';
import { ContactApiModel } from '@models/api/contact.model';
import { ContactEditFormComponent } from './contact-edit-form.component';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-contact',
  imports: [
    JsonCardComponent,
    EditButtonComponent,
    ModalComponent,
    ContactEditFormComponent,
  ],
  templateUrl: './contact.component.html',
  host: {
    class: 'w-full'
  }
})
export class ContactComponent implements OnInit {
  private readonly tabsService = inject(TabsService);
  private readonly authService = inject(AuthService);
  private contactTab: Tab = new Tab(TabKey.CONTACT, ['fas', 'envelope'], 'text-accent', 'EXPLORER.CONTACT_FILE', [Path.CONTACT]);
  protected readonly contact = httpResource<ContactApiModel>(
    () => `${environment.apiBaseUrl}/v1/contact`,
  );
  protected readonly admin = this.authService.admin;
  protected readonly editing = signal(false);

  ngOnInit() {
    this.tabsService.addTab(this.contactTab);
  }

  protected onSaved(): void {
    this.editing.set(false);
    this.contact.reload();
  }
}
