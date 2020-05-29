import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { LayoutComponent } from './shared/layout/layout.component';
import { AccessRightsUserGuard } from './guards/access-rights-user.guard';
import { AccessRightsProfileGuard } from './guards/access-rights-profile.guard';
import { AccessRightsDistributionGuard } from './guards/access-rights-distribution.guard';

const routes: Routes = [
    { path: '', loadChildren: () => import('./page/login/login.module').then(m => m.LoginModule) , data: { title: 'Авторизация' } },
    {
      path: 'crm',
      component: LayoutComponent,
      canActivate: [ AuthGuard ],
      children: [
        { path: 'entrance', loadChildren: () => import('./page/entrance/entrance.module').then(m => m.EntranceModule), data: { title: 'BREADCRUMBS.HOME' } },
        { path: 'call-center/search-contact-phone/:contactPhone', loadChildren: () => import('./page/entrance/entrance.module').then(m => m.EntranceModule), data: { title: 'BREADCRUMBS.HOME' } },
        { path: 'add-user', loadChildren: () => import('./page/users/add-user/add-user.module').then(m => m.AddUserModule), data: { title: 'MENU.USERS.ADD_USERS' } },
        { path: 'list-users', loadChildren: () => import('./page/users/list-users/list-users.module').then(m => m.ListUsersModule), data: { title: 'MENU.USERS.LIST_USERS' } },
        { path: 'user/:id', loadChildren: () => import('./page/users/user/user.module').then(m => m.UserModule), canActivate: [ AccessRightsUserGuard ], data: { title: 'BREADCRUMBS.USER' } },
        { path: 'profile-search', loadChildren: () => import('./page/profiles/profile-search/profile-search.module').then(m => m.ProfileSearchModule), data: { title: 'MENU.CUSTOMER.SEARCH_CUSTOMER' } },
        { path: 'profile/:id', loadChildren: () => import('./page/profiles/tabs-profile/tabs-profile.module').then(m => m.TabsProfileModule), canActivate: [ AccessRightsProfileGuard ], data: { title: 'BREADCRUMBS.CUSTOMER' } },
        { path: 'add-profile', loadChildren: () => import('./page/profiles/add-profile/add-profile.module').then(m => m.AddProfileModule), data: { title: 'MENU.CUSTOMER.ADD_CUSTOMER' } },
        { path: 'list-segmentation', loadChildren: () => import('./page/segmentation/list-segmentation/list-segmentation.module').then(m => m.ListSegmentationModule), data: { title: 'MENU.SEGMENTATION.LIST_SEGMENTATION' } },
        { path: 'add-segmentation', loadChildren: () => import('./page/segmentation/add-segmentation/add-segmentation.module').then(m => m.AddSegmentationModule), data: { title: 'MENU.SEGMENTATION.ADD_SEGMENTATION' } },
        { path: 'edit-segmentation', loadChildren: () => import('./page/segmentation/add-segmentation/add-segmentation.module').then(m => m.AddSegmentationModule), data: { title: 'BREADCRUMBS.EDIT_SEGMENTATION' } },
        { path: 'complex-segmentation', loadChildren: () => import('./page/segmentation/complex-segmentation/complex-segmentation.module').then(m => m.ComplexSegmentationModule), data: { title: 'MENU.SEGMENTATION.AGGREGATION_SEGMENTATION' } },
        { path: 'add-custom-segmentation', loadChildren: () => import('./page/segmentation/add-custom-segmentation/add-custom-segmentation.module').then(m => m.AddCustomSegmentationModule), data: { title: 'MENU.SEGMENTATION.CUSTOM_SEGMENTATION'} },
        { path: 'profile-group', loadChildren: () => import('./page/special-groups/profile-group/profile-group.module').then(m => m.ProfileGroupModule), data: { title: 'MENU.GROUP_CUSTOMER.LIST_GROUP_CUSTOMER' } },
        { path: 'list-email', loadChildren: () => import('./page/distribution/list-email/list-email.module').then(m => m.ListEmailModule), data: { title: 'MENU.DISTRIBUTIONS.LIST_EMAIL' } },
        { path: 'list-sms', loadChildren: () => import('./page/distribution/list-sms/list-sms.module').then(m => m.ListSmsModule), data: { title: 'MENU.DISTRIBUTIONS.LIST_SMS' } },
        { path: 'profile-email-distribution/:id', loadChildren: () => import('./page/distribution/profile-email-distribution/profile-email-distribution.module').then(m => m.ProfileEmailDistributionModule), canActivate: [ AccessRightsDistributionGuard ], data: { title: 'BREADCRUMBS.EMAIL_DISTRIBUTION' } },
        { path: 'profile-sms-distribution/:id', loadChildren: () => import('./page/distribution/profile-sms-distribution/profile-sms-distribution.module').then(m => m.ProfileSmsDistributionModule), canActivate: [ AccessRightsDistributionGuard ], data: { title: 'BREADCRUMBS.SMS_DISTRIBUTION' } },
        { path: 'add-promotions', loadChildren: () => import('./page/promotions/add-promotions/add-promotions.module').then(m => m.AddPromotionsModule), data: { title: 'MENU.PROMOTIONS_CODES.ADD_PROMOTIONS_CODES' } },
        { path: 'add-promotions-codes', loadChildren: () => import('./page/promotions/add-promotions-codes/add-promotions-codes.module').then(m => m.AddPromotionsCodesModule), data: { title: 'MENU.PROMOTIONS_CODES.ADD_PROMOTIONS' } },
        { path: 'search-promotions-codes', loadChildren: () => import('./page/promotions/search-promotions-codes/search-promotions-codes.module').then(m => m.SearchPromotionsCodesModule), data: { title: 'MENU.PROMOTIONS_CODES.SEARCH_PROMOTIONS_CODES' } },
        { path: 'statistics-report', loadChildren: () => import('./page/reports/statistics-report/statistics-report.module').then(m => m.StatisticsReportModule), data: { title: 'MENU.REPORTS.LIST_REPORTS' } },
        { path: 'add-event', loadChildren: () => import('./page/events/add-event/add-event.module').then(m => m.AddEventModule), data: { title: 'MENU.EVENT.ADD_EVENT' } },
        { path: 'event/:id', loadChildren: () => import('./page/events/event/event.module').then(m => m.EventModule), data: { title: 'BREADCRUMBS.EVENT' } },
        { path: 'list-event', loadChildren: () => import('./page/events/list-event/list-event.module').then(m => m.ListEventModule), data: { title: 'MENU.EVENT.LIST_EVENT' } },
        { path: 'form-table-async-profile-settings', loadChildren: () => import('./page/settings/form-table-async-profile-settings/form-table-async-profile-settings.module').then(m => m.FormTableAsyncProfileSettingsModule), data: { title: 'MENU.SETTINGS.TABLE_CUSTOMERS' } },
        { path: 'index', loadChildren: () => import('./page/settings/index/index.module').then(m => m.IndexModule), data: { title: 'MENU.SETTINGS.INDEX' } },
        { path: 'age-interval', loadChildren: () => import('./page/settings/age-interval/age-interval.module').then(m => m.AgeIntervalModule), data: { title: 'MENU.SETTINGS.AGE_INTERVAL' } },
        { path: 'restart', loadChildren: () => import('./page/settings/restart/restart.module').then(m => m.RestartModule), data: { title: 'MENU.SETTINGS.RESTART' } },
      ],
    },
  { path: '404', loadChildren: () => import('./page/error-page/error-page.module').then(m => m.ErrorPageModule), data: { title: '404' } },
  { path: '**', redirectTo: '404', pathMatch: 'full' }
  ]
;

@NgModule( {
  imports: [ RouterModule.forRoot( routes, { useHash: true } ) ],
  exports: [ RouterModule ],
} )
export class AppRoutingModule {
}

















