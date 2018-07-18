import { NgModule } from '@angular/core';
import { LoginModule } from './login/login.module';
import { EntranceModule } from './entrance/entrance.module';
import { UsersModule } from './users/users.module';
import { ProfileSearchModule } from './profiles/profile-search/profile-search.module';

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
