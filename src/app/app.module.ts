import { BrowserModule } from '@angular/platform-browser';
import { NgModule, enableProdMode } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { MaterialModule } from './material.module';
import { LoginComponent } from './page/login/login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from './services/auth.service';
import { LocalStorageModule } from '@ngx-pwa/local-storage';
import { AdminComponent } from './page/admin/admin.component';
import { UsersComponent } from './components/users/users.component';
import { UsersService } from './components/users/users.service';
import { AuthGuard } from './auth.guard';
import { ActivityUserService } from './services/activity-user.service';
import { HttpQueryService } from './services/http-query.service';
import { DialogComponent } from './shared/dialog/dialog.component';
import { UsersSearchComponent } from './components/users-search/users-search.component';
import { UsersSearchService } from './components/users-search/users-search.service';
import { TabletExampleComponent } from './shared/tablet-example/tablet-example.component';
import { CompanyComponent } from './components/company/company.component';
import { CompanyService } from './components/company/company.service';
import { environment } from '../environments/environment';
import { LoginService } from './page/login/login.service';
import { LayoutComponent } from './shared/layout/layout.component';
import { ToolbarComponent } from './shared/layout/toolbar/toolbar.component';
import { SidenavComponent } from './shared/layout/sidenav/sidenav.component';
import { LayoutService } from './shared/layout/layout.service';


if ( environment.production ) {
  enableProdMode();
}

@NgModule( {
  declarations: [
    AppComponent,
    LoginComponent,
    AdminComponent,
    UsersComponent,
    DialogComponent,
    UsersSearchComponent,
    TabletExampleComponent,
    CompanyComponent,
    LayoutComponent,
    ToolbarComponent,
    SidenavComponent,
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
    LocalStorageModule,
  ],
  providers: [
    AuthService,
    AuthGuard,
    UsersService,
    ActivityUserService,
    HttpQueryService,
    UsersSearchService,
    CompanyService,
    LoginService,
    LayoutService,
  ],
  bootstrap: [ AppComponent ],
} )
export class AppModule {
}
