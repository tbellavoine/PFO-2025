import { Component, computed, DOCUMENT, inject, OnInit } from '@angular/core';
import { httpResource } from '@angular/common/http';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { TabsService } from '@services/tabs.service';
import { Tab } from '@models/tab.model';
import { TabKey } from '@enums/tab-key.enum';
import { Path } from '@enums/path.enum';
import { JsonCardComponent } from '@components/json-card/json-card.component';
import { ProfileApiModel } from '@models/api/profile.model';
import { environment } from '../../../environments/environment';

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
  protected readonly profile = httpResource<ProfileApiModel>(
    () => `${environment.apiBaseUrl}/v1/profile`,
  );
  public readonly softSkillsObject = computed<Record<string, string>>(() =>
    Object.fromEntries((this.profile.value()?.softSkills ?? []).map((skill) => [skill, '✓'])),
  );
  private readonly tabsService = inject(TabsService);
  private profileTab: Tab = new Tab(TabKey.PROFILE, ['fab', 'html5'], 'text-orange-500', 'EXPLORER.ME_FILE', [Path.PROFILE]);
  private readonly document = inject(DOCUMENT);

  ngOnInit(): void {
    this.tabsService.addTab(this.profileTab);
  }

  /**
   * Open the CV in a new tab
   */
  public openCV(): void {
    const cvUrl = this.profile.value()?.cvUrl;
    if (!cvUrl) {
      return;
    }

    const link = this.document.createElement('a');
    link.href = cvUrl;
    link.target = '_blank';
    link.click();
  }
}
