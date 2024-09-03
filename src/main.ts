import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import {importProvidersFrom} from "@angular/core";
import {provideFirebaseApp, initializeApp} from "@angular/fire/app";
import {provideHttpClient} from "@angular/common/http";
import {IonicModule} from "@ionic/angular";
import {environment} from "./environments/environment";
import {getAuth, provideAuth} from "@angular/fire/auth";
import {FIREBASE_OPTIONS} from "@angular/fire/compat";

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideRouter(routes, withPreloading(PreloadAllModules)),
    provideHttpClient(),
    importProvidersFrom(IonicModule.forRoot()),
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
    provideAuth(() => getAuth()),
    { provide: FIREBASE_OPTIONS, useValue: environment.firebaseConfig },
  ],
});
