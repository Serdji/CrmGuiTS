import { BrowserModule } from '@angular/platform-browser';
import { NgModule, enableProdMode } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { ReactiveFormsModule } from '@angular/forms';
import { environment } from '../environments/environment';
import { SharedModule } from './shared/shared.module';
import { ServicesModule } from './services/services.module';
import { ComponentsModule } from './components/components.module';
import { ServiceWorkerModule } from '@angular/service-worker';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { NgxMaskModule, IConfig } from 'ngx-mask';
import { ProfileSmsDistributionComponent } from './page/distribution/profile-sms-distribution/profile-sms-distribution.component';


if ( environment.production ) {
  enableProdMode();
}

export function createTranslateLoader( http: HttpClient ) {
  return new TranslateHttpLoader( http, 'assets/i18n/', '.json' );
}

export let options: Partial<IConfig> | (() => Partial<IConfig>);

@NgModule( {
  declarations: [ AppComponent ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ServicesModule,
    NgxMaskModule.forRoot(options),
    SharedModule.forRoot(),
    ComponentsModule.forRoot(),
    ServiceWorkerModule.register( 'ngsw-worker.js', { enabled: environment.production } ),
    TranslateModule.forRoot( {
      loader: {
        provide: TranslateLoader,
        useFactory: ( createTranslateLoader ),
        deps: [ HttpClient ]
      }
    } )
  ],
  bootstrap: [ AppComponent ],
} )
export class AppModule {
}
