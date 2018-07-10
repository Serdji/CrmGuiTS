import { NgModule } from '@angular/core';
import { LoginModule } from './login/login.module';
import { ProfileSearchModule } from './profile-search/profile-search.module';
import { CompanyModule } from './company/company.module';
import { EntranceModule } from './entrance/entrance.module';
import { UsersModule } from './users/users.module';

@NgModule({
  imports: [
    LoginModule,
    ProfileSearchModule,
    CompanyModule,
    EntranceModule,
    UsersModule
  ],
  declarations: []
})
export class PageModule { }
