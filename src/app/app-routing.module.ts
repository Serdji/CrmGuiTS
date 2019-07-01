import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { LayoutComponent } from './shared/layout/layout.component';
import { AccessRightsUserGuard } from './guards/access-rights-user.guard';
import { AccessRightsProfileGuard } from './guards/access-rights-profile.guard';
import { AccessRightsDistributionGuard } from './guards/access-rights-distribution.guard';

const routes: Routes = [
    { path: '', loadChildren: './page/login/login.module#LoginModule' , data: { title: 'Авторизация' } },
    {
      path: 'crm',
      component: LayoutComponent,
      canActivate: [ AuthGuard ],
      children: [
        { path: 'entrance', loadChildren: './page/entrance/entrance.module#EntranceModule', data: { title: 'Главная' } },
        { path: 'adduser', loadChildren: './page/users/add-user/add-user.module#AddUserModule', data: { title: 'Добавить пользователя' } },
        { path: 'listusers', loadChildren: './page/users/list-users/list-users.module#ListUsersModule', data: { title: 'Список пользователей' } },
        { path: 'user/:id', loadChildren: './page/users/user/user.module#UserModule', canActivate: [ AccessRightsUserGuard ], data: { title: 'Пользователь' } },
        { path: 'profilesearch', loadChildren: './page/profiles/profile-search/profile-search.module#ProfileSearchModule', data: { title: 'Поиск пассажира' } },
        { path: 'profile/:id', loadChildren: './page/profiles/tabs-profile/tabs-profile.module#TabsProfileModule', canActivate: [ AccessRightsProfileGuard ], data: { title: 'Пассажир' } },
        { path: 'addprofile', loadChildren: './page/profiles/add-profile/add-profile.module#AddProfileModule', data: { title: 'Добавить пассажира' } },
        { path: 'listsegmentation', loadChildren: './page/segmentation/list-segmentation/list-segmentation.module#ListSegmentationModule', data: { title: 'Список сегментаций' } },
        { path: 'addsegmentation', loadChildren: './page/segmentation/add-segmentation/add-segmentation.module#AddSegmentationModule', data: { title: 'Добавить сегментацию' } },
        { path: 'complexsegmentation', loadChildren: './page/segmentation/complex-segmentation/complex-segmentation.module#ComplexSegmentationModule', data: { title: 'Сложная сегментация' } },
        { path: 'profilegroup', loadChildren: './page/special-groups/profile-group/profile-group.module#ProfileGroupModule', data: { title: 'Список групп' } },
        { path: 'list-distribution', loadChildren: './page/distribution/list-distribution/list-distribution.module#ListDistributionModule', data: { title: 'Список рассылок' } },
        { path: 'profile-distribution/:id', loadChildren: './page/distribution/profile-distribution/profile-distribution.module#ProfileDistributionModule', canActivate: [ AccessRightsDistributionGuard ], data: { title: 'Рассылка' } },
        { path: 'add-promotions', loadChildren: './page/promotions/add-promotions/add-promotions.module#AddPromotionsModule', data: { title: 'Добавить промоакцию' } },
        { path: 'add-promotions-codes', loadChildren: './page/promotions/add-promotions-codes/add-promotions-codes.module#AddPromotionsCodesModule', data: { title: 'Добавить промокод' } },
        { path: 'search-promotions-codes', loadChildren: './page/promotions/search-promotions-codes/search-promotions-codes.module#SearchPromotionsCodesModule', data: { title: 'Поиск промокода' } },
        { path: 'statistics-report', loadChildren: './page/reports/statistics-report/statistics-report.module#StatisticsReportModule', data: { title: 'Список отчетоветы' } },
        { path: 'form-table-async-profile-settings', loadChildren: './page/settings/form-table-async-profile-settings/form-table-async-profile-settings.module#FormTableAsyncProfileSettingsModule', data: { title: 'Таблицы пассажиров' } },
        { path: 'restart', loadChildren: './page/settings/restart/restart.module#RestartModule', data: { title: 'Перезагрузка' } },
      ],
    },
  { path: '404', loadChildren: './page/error-page/error-page.module#ErrorPageModule', data: { title: '404' } },
  { path: '**', redirectTo: '404', pathMatch: 'full' }
  ]
;

@NgModule( {
  imports: [ RouterModule.forRoot( routes, { useHash: true } ) ],
  exports: [ RouterModule ],
} )
export class AppRoutingModule {
}
