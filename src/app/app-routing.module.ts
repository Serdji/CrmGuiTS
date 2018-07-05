import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './page/login/login.component';
import { AuthGuard } from './auth.guard';
import { ProfileSearchComponent } from './page/profile-search/profile-search.component';
import { LayoutComponent } from './shared/layout/layout.component';
import { CompanyComponent } from './page/company/company.component';
import { AddUserComponent } from './page/add-user/add-user.component';
import { EntranceComponent } from './page/entrance/entrance.component';
import { ListUsersComponent } from './page/list-users/list-users.component';

const routes: Routes = [
    { path: '', component: LoginComponent },
    {
      path: 'crm',
      component: LayoutComponent,
      canActivate: [ AuthGuard ],
      children: [
        { path: 'entrance', component: EntranceComponent },
        { path: 'profilesearch', component: ProfileSearchComponent },
        { path: 'adduser', component: AddUserComponent },
        { path: 'listusers', component: ListUsersComponent },
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
