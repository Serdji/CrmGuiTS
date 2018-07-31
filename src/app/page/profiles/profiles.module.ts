import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileSearchModule } from './profile-search/profile-search.module';
import { AddProfileModule } from './add-profile/add-profile.module';
import { TabsModule } from './profile/tabs.module';

@NgModule({
  imports: [
    CommonModule,
    ProfileSearchModule,
    TabsModule,
    AddProfileModule,
  ],
  declarations: []
})
export class ProfilesModule { }
