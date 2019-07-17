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
        { path: 'entrance', loadChildren: () => import('./page/entrance/entrance.module').then(m => m.EntranceModule), data: { title: 'Главная' } },
        { path: 'call-center/search-contact-phone/:contactPhone', loadChildren: () => import('./page/entrance/entrance.module').then(m => m.EntranceModule), data: { title: 'Главная' } },
        { path: 'adduser', loadChildren: () => import('./page/users/add-user/add-user.module').then(m => m.AddUserModule), data: { title: 'Добавить пользователя' } },
        { path: 'listusers', loadChildren: () => import('./page/users/list-users/list-users.module').then(m => m.ListUsersModule), data: { title: 'Список пользователей' } },
        { path: 'user/:id', loadChildren: () => import('./page/users/user/user.module').then(m => m.UserModule), canActivate: [ AccessRightsUserGuard ], data: { title: 'Пользователь' } },
        { path: 'profilesearch', loadChildren: () => import('./page/profiles/profile-search/profile-search.module').then(m => m.ProfileSearchModule), data: { title: 'Поиск пассажира' } },
        { path: 'profile/:id', loadChildren: () => import('./page/profiles/tabs-profile/tabs-profile.module').then(m => m.TabsProfileModule), canActivate: [ AccessRightsProfileGuard ], data: { title: 'Пассажир' } },
        { path: 'addprofile', loadChildren: () => import('./page/profiles/add-profile/add-profile.module').then(m => m.AddProfileModule), data: { title: 'Добавить пассажира' } },
        { path: 'listsegmentation', loadChildren: () => import('./page/segmentation/list-segmentation/list-segmentation.module').then(m => m.ListSegmentationModule), data: { title: 'Список сегментаций' } },
        { path: 'addsegmentation', loadChildren: () => import('./page/segmentation/add-segmentation/add-segmentation.module').then(m => m.AddSegmentationModule), data: { title: 'Добавить сегментацию' } },
        { path: 'complexsegmentation', loadChildren: () => import('./page/segmentation/complex-segmentation/complex-segmentation.module').then(m => m.ComplexSegmentationModule), data: { title: 'Объединение сегментаций' } },
        { path: 'profilegroup', loadChildren: () => import('./page/special-groups/profile-group/profile-group.module').then(m => m.ProfileGroupModule), data: { title: 'Список групп' } },
        { path: 'list-distribution', loadChildren: () => import('./page/distribution/list-distribution/list-distribution.module').then(m => m.ListDistributionModule), data: { title: 'Список рассылок' } },
        { path: 'profile-distribution/:id', loadChildren: () => import('./page/distribution/profile-distribution/profile-distribution.module').then(m => m.ProfileDistributionModule), canActivate: [ AccessRightsDistributionGuard ], data: { title: 'Рассылка' } },
        { path: 'add-promotions', loadChildren: () => import('./page/promotions/add-promotions/add-promotions.module').then(m => m.AddPromotionsModule), data: { title: 'Добавить промоакцию' } },
        { path: 'add-promotions-codes', loadChildren: () => import('./page/promotions/add-promotions-codes/add-promotions-codes.module').then(m => m.AddPromotionsCodesModule), data: { title: 'Добавить промокод' } },
        { path: 'search-promotions-codes', loadChildren: () => import('./page/promotions/search-promotions-codes/search-promotions-codes.module').then(m => m.SearchPromotionsCodesModule), data: { title: 'Поиск промокода' } },
        { path: 'statistics-report', loadChildren: () => import('./page/reports/statistics-report/statistics-report.module').then(m => m.StatisticsReportModule), data: { title: 'Список отчетоветы' } },
        { path: 'form-table-async-profile-settings', loadChildren: () => import('./page/settings/form-table-async-profile-settings/form-table-async-profile-settings.module').then(m => m.FormTableAsyncProfileSettingsModule), data: { title: 'Таблицы пассажиров' } },
        { path: 'restart', loadChildren: () => import('./page/settings/restart/restart.module').then(m => m.RestartModule), data: { title: 'Перезагрузка' } },
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
