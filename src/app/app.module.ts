import { BrowserModule } from '@angular/platform-browser';
import { NgModule, enableProdMode } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { MaterialModule } from './material.module';
import { LoginComponent } from './page/login/login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AuthService } from './services/auth.service';
import { AuthGuard } from './auth.guard';
import { ActivityUserService } from './services/activity-user.service';
import { DialogComponent } from './shared/dialog/dialog.component';
import { TableExampleComponent } from './shared/tablet-example/table-example.component';
import { environment } from '../environments/environment';
import { LoginService } from './page/login/login.service';
import { LayoutComponent } from './shared/layout/layout.component';
import { ToolbarComponent } from './shared/layout/toolbar/toolbar.component';
import { SidenavComponent } from './shared/layout/sidenav/sidenav.component';
import { LayoutService } from './shared/layout/layout.service';
import { ProfileComponent } from './page/profile/profile.component';
import { ProfileSearchComponent } from './components/profile-search/profile-search.component';
import { ProfileSearchService } from './components/profile-search/profile-search.service';
import { AuthInterceptor } from './services/auth-interceptor';
import { TableAsyncComponent } from './shared/table-async/table-async.component';
import { TableAsyncService } from './shared/table-async/table-async.service';


if ( environment.production ) {
  enableProdMode();
}

@NgModule( {
  declarations: [
    AppComponent,
    LoginComponent,
    DialogComponent,
    TableExampleComponent,
    LayoutComponent,
    ToolbarComponent,
    SidenavComponent,
    ProfileComponent,
    ProfileSearchComponent,
    TableAsyncComponent,
  ],
  entryComponents: [
    DialogComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    ReactiveFormsModule,
    HttpClientModule,
  ],
  providers: [
    AuthService,
    AuthGuard,
    ActivityUserService,
    LoginService,
    LayoutService,
    ProfileSearchService,
    TableAsyncService,
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
