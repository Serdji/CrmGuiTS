import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileSearchModule } from './profile-search/profile-search.module';
import { ProfileModule } from './profile/profile.module';

@NgModule({
  imports: [
    CommonModule,
    ProfileSearchModule,
    ProfileModule
  ],
  declarations: []
})
export class ProfilesModule { }
