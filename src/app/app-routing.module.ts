import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { AuthGuard } from './auth.guard';
import { ProfileSearchComponent } from './components/profile-search/profile-search.component';
import { LayoutComponent } from './shared/layout/layout.component';

const routes: Routes = [
    { path: '', component: LoginComponent },
    {
      path: 'profile',
      component: LayoutComponent,
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
