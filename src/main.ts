import { importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import {
  RouteReuseStrategy,
  provideRouter,
  withPreloading,
  PreloadAllModules,
  withComponentInputBinding,
} from '@angular/router';
import {
  IonicRouteStrategy,
  provideIonicAngular,
} from '@ionic/angular/standalone';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { IonicStorageModule } from '@ionic/storage-angular';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { errorInterceptor } from '@shared/interceptors/error-interceptor';

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom([IonicStorageModule.forRoot()]),
    provideZoneChangeDetection(),
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideHttpClient(withInterceptors([errorInterceptor])),
    provideRouter(
      routes,
      withPreloading(PreloadAllModules),
      withComponentInputBinding(),
    ),
  ],
});
