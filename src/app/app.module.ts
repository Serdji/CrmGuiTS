import { BrowserModule } from '@angular/platform-browser';
import { NgModule, enableProdMode } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { MaterialModule } from './material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AuthService } from './services/auth.service';
import { AuthGuard } from './auth.guard';
import { ActivityUserService } from './services/activity-user.service';
import { environment } from '../environments/environment';
import { ProfileSearchComponent } from './components/profile-search/profile-search.component';
import { ProfileSearchService } from './components/profile-search/profile-search.service';
import { AuthInterceptor } from './services/auth-interceptor';
import { SharedModule } from './shared/shared.module';
import { TableAsyncComponent } from './shared/table-async/table-async.component';
import { DialogComponent } from './shared/dialog/dialog.component';
import { ComponentsModule } from './components/components.module';


if ( environment.production ) {
  enableProdMode();
}

@NgModule( {
  declarations: [
    AppComponent,
    ProfileSearchComponent,
    TableAsyncComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ComponentsModule,
    MaterialModule,
    SharedModule.forRoot()
  ],
  entryComponents: [
    DialogComponent,
  ],
  providers: [
    AuthService,
    AuthGuard,
    ActivityUserService,
    ProfileSearchService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [ AppComponent ],
} )
export class AppModule {
}
