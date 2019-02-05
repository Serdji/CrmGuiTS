import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './page/login/login.component';
import { AuthGuard } from './guards/auth.guard';
import { ProfileSearchComponent } from './page/profiles/profile-search/profile-search.component';
import { LayoutComponent } from './shared/layout/layout.component';
import { AddUserComponent } from './page/users/add-user/add-user.component';
import { EntranceComponent } from './page/entrance/entrance.component';
import { ListUsersComponent } from './page/users/list-users/list-users.component';
import { UserComponent } from './page/users/user/user.component';
import { AddProfileComponent } from './page/profiles/add-profile/add-profile.component';
import { AccessRightsUserGuard } from './guards/access-rights-user.guard';
import { AccessRightsProfileGuard } from './guards/access-rights-profile.guard';
import { FormTableAsyncProfileSettingsComponent } from './page/settings/form-table-async-profile-settings/form-table-async-profile-settings.component';
import { TabsProfileComponent } from './page/profiles/tabs-profile/tabs-profile.component';
import { RestartComponent } from './page/settings/restart/restart.component';
import { AddSegmentationComponent } from './page/segmentation/add-segmentation/add-segmentation.component';
import { ListSegmentationComponent } from './page/segmentation/list-segmentation/list-segmentation.component';
import { ProfileGroupComponent } from './page/special-groups/profile-group/profile-group.component';
import { ErrorPageComponent } from './page/error-page/error-page.component';
import { ListDistributionComponent } from './page/distribution/list-distribution/list-distribution.component';
import { ProfileDistributionComponent } from './page/distribution/profile-distribution/profile-distribution.component';
import { AccessRightsDistributionGuard } from './guards/access-rights-distribution.guard';
import { AddPromotionsComponent } from './page/promotions/add-promotions/add-promotions.component';
import { AddPromotionsCodesComponent } from './page/promotions/add-promotions-codes/add-promotions-codes.component';
import { SearchPromotionsCodesComponent } from './page/promotions/search-promotions-codes/search-promotions-codes.component';

const routes: Routes = [
    { path: '', loadChildren: './page/login/login.module#LoginModule' },
    {
      path: 'crm',
      component: LayoutComponent,
      canActivate: [ AuthGuard ],
      children: [
        { path: 'entrance', loadChildren: './page/entrance/entrance.module#EntranceModule' },
        { path: 'adduser', loadChildren: './page/users/add-user/add-user.module#AddUserModule' },
        { path: 'listusers', loadChildren: './page/users/list-users/list-users.module#ListUsersModule' },
        { path: 'user/:id', loadChildren: './page/users/user/user.module#UserModule', canActivate: [ AccessRightsUserGuard ] },
        { path: 'profilesearch', loadChildren: './page/profiles/profile-search/profile-search.module#ProfileSearchModule' },
        { path: 'profile/:id', loadChildren: './page/profiles/tabs-profile/tabs-profile.module#TabsProfileModule', canActivate: [ AccessRightsProfileGuard ] },
        { path: 'addprofile', loadChildren: './page/profiles/add-profile/add-profile.module#AddProfileModule' },
        { path: 'listsegmentation', loadChildren: './page/segmentation/list-segmentation/list-segmentation.module#ListSegmentationModule' },
        // { path: 'addsegmentation', component: AddSegmentationComponent },
        // { path: 'profilegroup', component: ProfileGroupComponent },
        // { path: 'list-distribution', component: ListDistributionComponent },
        // { path: 'profile-distribution/:id', component: ProfileDistributionComponent, canActivate: [ AccessRightsDistributionGuard ] },
        // { path: 'add-promotions', component: AddPromotionsComponent, },
        // { path: 'add-promotions-codes', component: AddPromotionsCodesComponent },
        // { path: 'search-promotions-codes', component: SearchPromotionsCodesComponent },
        // { path: 'form-table-async-profile-settings', component: FormTableAsyncProfileSettingsComponent },
        // { path: 'restart', component: RestartComponent },
      ],
    },
  // { path: '404', component: ErrorPageComponent },
  // { path: '**', redirectTo: '404', pathMatch: 'full' }
  ]
;

@NgModule( {
  imports: [ RouterModule.forRoot( routes, { useHash: true } ) ],
  exports: [ RouterModule ],
} )
export class AppRoutingModule {
}
