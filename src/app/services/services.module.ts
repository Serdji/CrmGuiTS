import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ActivityUserService } from './activity-user.service';
import { AuthInterceptor } from './auth-interceptor';
import { AuthService } from './auth.service';
import { AuthGuard } from '../auth.guard';
import { ParsTokenService } from './pars-token.service';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [],
  providers: [
    AuthService,
    AuthGuard,
    ActivityUserService,
    ParsTokenService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
})
export class ServicesModule { }
