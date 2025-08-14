import { Component, DOCUMENT, inject, OnInit, signal } from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { TabsService } from '@services/tabs.service';
import { Tab } from '../../models/tab.model';
import { TabKey } from '../../enums/tab-key.enum';
import { Path } from '../../enums/path.enum';
import { JsonCardComponent } from '@components/json-card/json-card.component';

@Component({
  selector: 'profile',
  imports: [
    FaIconComponent,
    JsonCardComponent
  ],
  templateUrl: './profile.component.html',
  host: {
    class: 'w-full'
  }
})
export class ProfileComponent implements OnInit {
  public softSkillsObject = signal<unknown>('');
  private readonly tabsService = inject(TabsService);
  private profileTab: Tab = new Tab(TabKey.PROFILE, ['fab', 'html5'], 'text-orange-500', 'EXPLORER.ME_FILE', [Path.PROFILE]);
  private readonly document = inject(DOCUMENT);

  ngOnInit() {
    this.initSoftSkillsObject();
    this.tabsService.addTab(this.profileTab);
  }

  public openCV(): void {
    const link = this.document.createElement('a');
    link.href = '/assets/pdf/CV-Thomas-BELLAVOINE.pdf';
    link.target = '_blank';
    link.click();
  }

  private initSoftSkillsObject(): void {
    this.softSkillsObject.set(
      {
        teamwork: '✓',
        proactive: '✓',
        adaptability: '✓',
        creativity: '✓',
        'critical thinking': '✓',
        autonomy: '✓',
      }
    );
  }
}
