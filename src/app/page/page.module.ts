import { NgModule } from '@angular/core';
import { LoginModule } from './login/login.module';
import { ProfileSearchModule } from './profile-search/profile-search.module';
import { EntranceModule } from './entrance/entrance.module';
import { UsersModule } from './users/users.module';

@NgModule({
  imports: [
    LoginModule,
    ProfileSearchModule,
    EntranceModule,
    UsersModule
  ],
  declarations: []
})
export class PageModule { }
