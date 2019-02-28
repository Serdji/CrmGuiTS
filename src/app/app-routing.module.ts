import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { LayoutComponent } from './shared/layout/layout.component';
import { AccessRightsUserGuard } from './guards/access-rights-user.guard';
import { AccessRightsProfileGuard } from './guards/access-rights-profile.guard';
import { AccessRightsDistributionGuard } from './guards/access-rights-distribution.guard';

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
        { path: 'addsegmentation', loadChildren: './page/segmentation/add-segmentation/add-segmentation.module#AddSegmentationModule' },
        { path: 'complexsegmentation', loadChildren: './page/segmentation/complex-segmentation/complex-segmentation.module#ComplexSegmentationModule' },
        { path: 'profilegroup', loadChildren: './page/special-groups/profile-group/profile-group.module#ProfileGroupModule' },
        { path: 'list-distribution', loadChildren: './page/distribution/list-distribution/list-distribution.module#ListDistributionModule' },
        { path: 'profile-distribution/:id', loadChildren: './page/distribution/profile-distribution/profile-distribution.module#ProfileDistributionModule', canActivate: [ AccessRightsDistributionGuard ] },
        { path: 'add-promotions', loadChildren: './page/promotions/add-promotions/add-promotions.module#AddPromotionsModule' },
        { path: 'add-promotions-codes', loadChildren: './page/promotions/add-promotions-codes/add-promotions-codes.module#AddPromotionsCodesModule' },
        { path: 'search-promotions-codes', loadChildren: './page/promotions/search-promotions-codes/search-promotions-codes.module#SearchPromotionsCodesModule' },
        { path: 'distribution-report', loadChildren: './page/reports/distribution-report/distribution-report.module#DistributionReportModule' },
        { path: 'form-table-async-profile-settings', loadChildren: './page/settings/form-table-async-profile-settings/form-table-async-profile-settings.module#FormTableAsyncProfileSettingsModule' },
        { path: 'restart', loadChildren: './page/settings/restart/restart.module#RestartModule' },
      ],
    },
  { path: '404', loadChildren: './page/error-page/error-page.module#ErrorPageModule' },
  { path: '**', redirectTo: '404', pathMatch: 'full' }
  ]
;

@NgModule( {
  imports: [ RouterModule.forRoot( routes, { useHash: true } ) ],
  exports: [ RouterModule ],
} )
export class AppRoutingModule {
}
