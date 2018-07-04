import { NgModule } from '@angular/core';
import { LoginModule } from './login/login.module';
import { ProfileSearchModule } from './profile-search/profile-search.module';
import { CompanyModule } from './company/company.module';
import { AddUserModule } from './add-user/add-user.module';
import { UsersSearchModule } from './users-search/users-search.module';
import { EntranceModule } from './entrance/entrance.module';

@NgModule({
  imports: [
    LoginModule,
    ProfileSearchModule,
    CompanyModule,
    AddUserModule,
    UsersSearchModule,
    EntranceModule,
  ],
  declarations: []
})
export class PageModule { }
