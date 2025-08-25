import { Component, inject, OnInit } from '@angular/core';
import { TabsService } from '@services/tabs.service';
import { Tab } from '@models/tab.model';
import { TabKey } from '@enums/tab-key.enum';
import { Path } from '@enums/path.enum';
import { JsonCardComponent } from '@components/json-card/json-card.component';
import { Experiences } from './experiences.const';

@Component({
  selector: 'app-works',
  imports: [
    JsonCardComponent
  ],
  templateUrl: './works.component.html',
})
export class WorksComponent implements OnInit {
  protected readonly Experiences = Experiences;
  private readonly tabsService = inject(TabsService);
  private worksTab: Tab = new Tab(TabKey.WORKS, ['fab', 'css3'], 'text-blue-500', 'EXPLORER.WORKS_FILE', [Path.WORKS]);

  ngOnInit() {
    this.tabsService.addTab(this.worksTab);
  }
}
