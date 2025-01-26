import {
  ApplicationConfig,
  LOCALE_ID,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideMomentDateAdapter } from '@angular/material-moment-adapter';
import { MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import localeFr from '@angular/common/locales/fr';
import { registerLocaleData } from '@angular/common';
import 'moment/locale/fr';
import { httpInterceptor } from './interceptors/http.interceptor';
import { providePrimeNG } from 'primeng/config';
import Material from '@primeng/themes/material';
import { HtmlDecodePipe } from './pipes/html-decode.pipe';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { FrenchPaginatorIntlService } from './services/french-paginator-intl.service';

registerLocaleData(localeFr);

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimationsAsync(),
    providePrimeNG({
      theme: {
        preset: Material,
      },
    }),
    provideHttpClient(withInterceptors([httpInterceptor])),
    provideMomentDateAdapter(),
    { provide: LOCALE_ID, useValue: 'fr-FR' },
    { provide: MAT_DATE_LOCALE, useValue: 'fr-FR' },
    {
      provide: MAT_DATE_FORMATS,
      useValue: {
        parse: {
          dateInput: 'DD/MM/YYYY',
        },
        display: {
          dateInput: 'DD/MM/YYYY',
          monthYearLabel: 'MMMM YYYY',
          dateA11yLabel: 'LL',
          monthYearA11yLabel: 'MMMM YYYY',
        },
      },
    },
    HtmlDecodePipe,
    { provide: MatPaginatorIntl, useClass: FrenchPaginatorIntlService },
  ],
};
