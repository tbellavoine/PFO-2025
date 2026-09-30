import { Component, inject, OnInit } from '@angular/core';
import { httpResource } from '@angular/common/http';
import { Tab } from '@models/tab.model';
import { TabKey } from '@enums/tab-key.enum';
import { Path } from '@enums/path.enum';
import { TabsService } from '@services/tabs.service';
import { JsonCardComponent } from '@components/json-card/json-card.component';
import { ContactApiModel } from '@models/api/contact.model';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-contact',
  imports: [
    JsonCardComponent
  ],
  templateUrl: './contact.component.html',
  host: {
    class: 'w-full'
  }
})
export class ContactComponent implements OnInit {
  private readonly tabsService = inject(TabsService);
  private contactTab: Tab = new Tab(TabKey.CONTACT, ['fas', 'envelope'], 'text-accent', 'EXPLORER.CONTACT_FILE', [Path.CONTACT]);
  protected readonly contact = httpResource<ContactApiModel>(
    () => `${environment.apiBaseUrl}/v1/contact`,
  );

  ngOnInit() {
    this.tabsService.addTab(this.contactTab);
  }
}
