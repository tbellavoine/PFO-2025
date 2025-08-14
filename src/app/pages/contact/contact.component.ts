import { Component, inject, OnInit } from '@angular/core';
import { Tab } from '../../models/tab.model';
import { TabKey } from '../../enums/tab-key.enum';
import { Path } from '../../enums/path.enum';
import { TabsService } from '@services/tabs.service';

@Component({
  selector: 'app-contact',
  imports: [],
  templateUrl: './contact.component.html',
  host: {
    class: 'w-full'
  }
})
export class ContactComponent implements OnInit {
  private readonly tabsService = inject(TabsService);
  private contactTab: Tab = new Tab(TabKey.CONTACT, ['fas', 'envelope'], 'text-accent', 'EXPLORER.CONTACT_FILE', [Path.CONTACT]);

  ngOnInit() {
    this.tabsService.addTab(this.contactTab);
  }
}
