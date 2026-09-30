import { ApplicationConfig, importProvidersFrom, inject, PLATFORM_ID, provideAppInitializer, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
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
import { TranslateService, provideTranslateService } from '@ngx-translate/core';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';
import { provideClientHydration } from '@angular/platform-browser';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    importProvidersFrom(FontAwesomeModule),
    provideHttpClient(withFetch()),
    provideTranslateService({
      loader: provideTranslateHttpLoader({ prefix: './assets/translates/', suffix: '.json' }),
      fallbackLang: 'fr'
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
      const savedLanguage = isPlatformBrowser(inject(PLATFORM_ID))
        ? localStorage.getItem('selectedLanguage')
        : null;
      inject(TranslateService).use(savedLanguage || 'fr');
    }), provideClientHydration(),
  ]
};
