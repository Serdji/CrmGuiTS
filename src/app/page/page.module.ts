import { NgModule } from '@angular/core';
import { LoginModule } from './login/login.module';
import { EntranceModule } from './entrance/entrance.module';
import { UsersModule } from './users/users.module';
import { ProfilesModule } from './profiles/profiles.module';

@NgModule({
  imports: [
    LoginModule,
    ProfilesModule,
    EntranceModule,
    UsersModule
  ],
  declarations: []
})
export class PageModule { }
