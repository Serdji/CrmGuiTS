import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './page/login/login.component';
import { AppComponent } from './app.component';
import { AuthGuard } from './auth.guard';
import { ProfileComponent } from './page/profile/profile.component';
import { ProfileSearchComponent } from './components/profile-search/profile-search.component';

const routes: Routes = [
    { path: '', component: LoginComponent },
    {
      path: 'profile',
      component: ProfileComponent,
      canActivate: [ AuthGuard ],
      children: [
        { path: 'profilesearch', component: ProfileSearchComponent },
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
