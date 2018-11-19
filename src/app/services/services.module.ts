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
    }
  ],
} )
export class ServicesModule {
}
