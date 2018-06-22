import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './page/login/login.component';
import { AuthGuard } from './auth.guard';
import { ProfileSearchComponent } from './page/profile-search/profile-search.component';
import { LayoutComponent } from './shared/layout/layout.component';
import { CompanyComponent } from './page/company/company.component';
import { UsersComponent } from './page/users/users.component';
import { UsersSearchComponent } from './page/users-search/users-search.component';

const routes: Routes = [
    { path: '', component: LoginComponent },
    {
      path: 'crm',
      component: LayoutComponent,
      canActivate: [ AuthGuard ],
      children: [
        { path: 'profilesearch', component: ProfileSearchComponent },
        { path: 'users', component: UsersComponent },
        { path: 'usersearch', component: UsersSearchComponent },
        { path: 'company', component: CompanyComponent },
      ],
    },
  ]
;

@NgModule( {
  imports: [ RouterModule.forRoot( routes, { useHash: true } ) ],
  exports: [ RouterModule ],
} )
export class AppRoutingModule {
}
