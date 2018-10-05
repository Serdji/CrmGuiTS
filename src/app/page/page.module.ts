import { NgModule } from '@angular/core';
import { LoginModule } from './login/login.module';
import { EntranceModule } from './entrance/entrance.module';
import { UsersModule } from './users/users.module';
import { ProfilesModule } from './profiles/profiles.module';
import { SettingsModule } from './settings/settings.module';
import { SegmentationModule } from './segmentation/segmentation.module';
import { SpecialGroupsModule } from './special-groups/special-groups.module';
import { ErrorPageModule } from './error-page/error-page.module';

@NgModule({
  imports: [
    LoginModule,
    ProfilesModule,
    EntranceModule,
    UsersModule,
    SettingsModule,
    SegmentationModule,
    SpecialGroupsModule,
    ErrorPageModule,
  ],
  declarations: []
})
export class PageModule { }
