import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './page/login/login.component';
import { AuthGuard } from './auth.guard';
import { ProfileSearchComponent } from './page/profiles/profile-search/profile-search.component';
import { LayoutComponent } from './shared/layout/layout.component';
import { AddUserComponent } from './page/users/add-user/add-user.component';
import { EntranceComponent } from './page/entrance/entrance.component';
import { ListUsersComponent } from './page/users/list-users/list-users.component';
import { UserComponent } from './page/users/user/user.component';
import { ProfileComponent } from './page/profiles/profile/profile.component';

const routes: Routes = [
    { path: '', component: LoginComponent },
    {
      path: 'crm',
      component: LayoutComponent,
      canActivate: [ AuthGuard ],
      children: [
        { path: 'entrance', component: EntranceComponent },
        { path: 'adduser', component: AddUserComponent },
        { path: 'listusers', component: ListUsersComponent },
        { path: 'user/:id', component: UserComponent },
        { path: 'profilesearch', component: ProfileSearchComponent },
        { path: 'profile/:id', component: ProfileComponent },
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
