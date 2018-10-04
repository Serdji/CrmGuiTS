import { NgModule } from '@angular/core';
import { LoginModule } from './login/login.module';
import { EntranceModule } from './entrance/entrance.module';
import { UsersModule } from './users/users.module';
import { ProfilesModule } from './profiles/profiles.module';
import { SettingsModule } from './settings/settings.module';
import { SegmentationModule } from './segmentation/segmentation.module';
import { ProfileGroupModule } from './profile-group/profile-group.module';

@NgModule({
  imports: [
    LoginModule,
    ProfilesModule,
    EntranceModule,
    UsersModule,
    SettingsModule,
    SegmentationModule,
    ProfileGroupModule,
  ],
  declarations: []
})
export class PageModule { }
