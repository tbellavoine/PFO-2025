import { Component, inject, OnInit, signal } from '@angular/core';
import { TabsService } from '@services/tabs.service';
import { Tab } from '@models/tab.model';
import { TabKey } from '@enums/tab-key.enum';
import { Path } from '@enums/path.enum';
import { JsonCardComponent } from '@components/json-card/json-card.component';

@Component({
  selector: 'app-skills',
  imports: [
    JsonCardComponent
  ],
  templateUrl: './skills.component.html',
})
export class SkillsComponent implements OnInit {
  public frontObject = signal<unknown>('');
  public backObject = signal<unknown>('');
  public uxUiObject = signal<unknown>('');
  public devOpsObject = signal<unknown>('');
  public toolsObject = signal<unknown>('');
  public qualityObject = signal<unknown>('');
  protected moreSkills: string[] = ['material-design', 'responsive-design', 'seo', 'wordpress', 'twig', 'salesForce-commerce-cloud', 'office'];
  private readonly tabsService = inject(TabsService);
  private skillsTab: Tab = new Tab(TabKey.SKILLS, ['fab', 'js'], 'text-yellow-500', 'EXPLORER.SKILLS_FILE', [Path.SKILLS]);

  ngOnInit() {
    this.initFrontObject();
    this.initBackObject();
    this.initUxUiObject();
    this.initDevOpsObject();
    this.initToolsObject();
    this.initQualityObject();
    this.tabsService.addTab(this.skillsTab);
  }

  /**
   * Initialize the front object
   * @private
   */
  private initFrontObject(): void {
    this.frontObject.set(
      {
        angular: '✓',
        typescript: '✓',
        html: '✓',
        css_scss_less: '✓',
        javascript: '✓',
        tailwindcss: '✓',
        bootstrap: '✓',
      }
    );
  }

  /**
   * Initialize the back object
   * @private
   */
  private initBackObject(): void {
    this.backObject.set({
        php: '~',
        symfony: '~',
        doctrine: '~',
        nodejs: '~',
        nestjs: '~',
        express: '~',
        phpmyadmin: '✓',
      }
    );
  }

  /**
   * Initialize the quality object
   * @private
   */
  private initQualityObject(): void {
    this.qualityObject.set(
      {
        sonarqube: '✓',
        tests: {
          jasmine: '✓',
          jest: '✓',
          phpunit: '~',
        }
      }
    );
  }

  /**
   * Initialize the UX/UI object
   * @private
   */
  private initUxUiObject(): void {
    this.uxUiObject.set(
      {
        material_ui: '✓',
        figma: '✓',
        adobexd: '✓',
        photoshop: '✓',
        illustator: '✓',
        powerpoint: '🛇'
      }
    );
  }

  /**
   * Initialize the DevOps object
   * @private
   */
  private initDevOpsObject(): void {
    this.devOpsObject.set(
      {
        github: '✓',
        gitlab: '✓',
        docker: '✓',
        aws: '~',
        firebase: '✓',
        ci_cd: '✓',
      }
    );
  }

  /**
   * Initialize the tools object
   * @private
   */
  private initToolsObject(): void {
    this.toolsObject.set(
      {
        jira: '✓',
        postman: '✓',
        webstorm: '✓',
        phpstorm: '~',
        visual_studio_code: '✓',
        cross_plateform: '✓',
      }
    );
  }
}
