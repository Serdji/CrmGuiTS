import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileSearchModule } from './profile-search/profile-search.module';
import { AddProfileModule } from './add-profile/add-profile.module';
import { TabsProfileModule } from './tabs-profile/tabs-profile.module';

@NgModule({
  imports: [
    CommonModule,
    ProfileSearchModule,
    TabsProfileModule,
    AddProfileModule,
  ],
  declarations: []
})
export class ProfilesModule { }
