import { APP_INITIALIZER, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ActivityUserService } from './activity-user.service';
import { AuthInterceptor } from './auth-interceptor';
import { AuthService } from './auth.service';
import { AuthGuard } from '../guards/auth.guard';
import { ParsTokenService } from './pars-token.service';
import { ConfigService } from './config-service.service';
import { RetryRequestService } from './retry-request.service';
import { CurrencyDefaultService } from './currency-default.service';
import { TableAsyncService } from './table-async.service';
import { SaveUrlServiceService } from './save-url-service.service';
import { TitleService } from './title.service';

const appInitializerFn = ( appConfig: ConfigService ) => {
  return () => {
    return appConfig.loadAppConfig();
  };
};

@NgModule( {
  imports: [
    CommonModule
  ],
  declarations: [],
  providers: [
    AuthService,
    AuthGuard,
    ActivityUserService,
    RetryRequestService,
    CurrencyDefaultService,
    TableAsyncService,
    TitleService,
    ParsTokenService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    ConfigService,
    {
      provide: APP_INITIALIZER,
      useFactory: appInitializerFn,
      multi: true,
      deps: [ ConfigService ]
    },
    SaveUrlServiceService,
  ],
} )
export class ServicesModule {
}
