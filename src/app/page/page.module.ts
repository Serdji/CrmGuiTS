import { NgModule } from '@angular/core';
import { LoginModule } from './login/login.module';
import { ProfileSearchModule } from './profile-search/profile-search.module';
import { CompanyModule } from './company/company.module';
import { UsersModule } from './users/users.module';
import { UsersSearchModule } from './users-search/users-search.module';

@NgModule({
  imports: [
    LoginModule,
    ProfileSearchModule,
    CompanyModule,
    UsersModule,
    UsersSearchModule
  ],
  declarations: []
})
export class PageModule { }
