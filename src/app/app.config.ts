import { ApplicationConfig, importProvidersFrom, inject, provideAppInitializer, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faAddressCard, faCircle, faCopy, faFile, faFolderOpen, faMessage, faTrashCan } from '@fortawesome/free-regular-svg-icons';
import {
  faAngleDown,
  faAppleWhole,
  faBars,
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
import { TranslateLoader, TranslateService, provideTranslateService } from '@ngx-translate/core';
import { provideHttpClient, HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    importProvidersFrom(FontAwesomeModule),
    provideHttpClient(),
    provideTranslateService({
      loader: {
        provide: TranslateLoader,
        useFactory: (http: HttpClient) => new TranslateHttpLoader(http, './assets/translates/', '.json'),
        deps: [HttpClient],
      },
      defaultLanguage: 'fr'
    }),
    provideAppInitializer(() => {
      inject(FaIconLibrary).addIcons(
        faAddressCard,
        faAngleDown,
        faAngular,
        faAppleWhole,
        faBars,
        faBell,
        faCircle,
        faCode,
        faCodeBranch,
        faCodeCommit,
        faCopy,
        faCss3,
        faEnvelope,
        faFile,
        faFileArrowDown,
        faFlask,
        faFolder,
        faFolderOpen,
        faGear,
        faGithub,
        faHouseChimney,
        faHtml5,
        faImage,
        faJs,
        faLinkedin,
        faMessage,
        faPaperPlane,
        faPlus,
        faTrashCan,
        faWrench,
        faXmark,
      );
      inject(TranslateService).use(localStorage?.getItem('selectedLanguage') || 'fr');
    }),
  ]
};
