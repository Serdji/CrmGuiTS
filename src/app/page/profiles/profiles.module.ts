import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileSearchModule } from './profile-search/profile-search.module';
import { ProfileModule } from './profile/profile.module';
import { AddProfileModule } from './add-profile/add-profile.module';

@NgModule({
  imports: [
    CommonModule,
    ProfileSearchModule,
    ProfileModule,
    AddProfileModule,
  ],
  declarations: []
})
export class ProfilesModule { }
