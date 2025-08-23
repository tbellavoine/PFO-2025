import { ApplicationConfig, importProvidersFrom, inject, provideAppInitializer, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faAddressCard, faCircle, faCopy, faFile, faFolderOpen, faMessage, faTrashCan } from '@fortawesome/free-regular-svg-icons';
import {
  faAngleDown,
  faBell,
  faCode,
  faCodeBranch,
  faCodeCommit,
  faEnvelope,
  faFileArrowDown,
  faFlask,
  faFolder,
  faGear,
  faHouseChimney,
  faImage,
  faPaperPlane,
  faPlus,
  faWrench,
  faXmark,
} from '@fortawesome/free-solid-svg-icons';
import { faAngular, faCss3, faGithub, faHtml5, faJs, faLinkedin } from '@fortawesome/free-brands-svg-icons';
import { provideTranslateService, TranslateService } from '@ngx-translate/core';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';
import { provideHttpClient } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    importProvidersFrom(FontAwesomeModule),
    provideHttpClient(),
    provideTranslateService({
      defaultLanguage: 'fr'
    }),
    provideTranslateHttpLoader({
      prefix: './assets/translates/',
      suffix: '.json'
    }),
    provideAppInitializer(() => {
      inject(FaIconLibrary).addIcons(faCircle, faImage, faHouseChimney, faXmark, faWrench, faAngular, faBell, faCodeBranch, faPaperPlane, faTrashCan, faLinkedin, faGithub, faMessage, faFile, faFolderOpen, faAngleDown, faAddressCard, faEnvelope, faCopy, faPlus, faCodeCommit, faCode, faGear, faFileArrowDown, faHtml5, faCss3, faFlask, faJs, faFolder);
      inject(TranslateService).use(localStorage?.getItem('selectedLanguage') || 'fr');
    }),
  ]
};
