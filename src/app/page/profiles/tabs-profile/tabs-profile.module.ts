import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ProfileModule } from './profile/profile.module';
import { SharedModule } from '../../../shared/shared.module';
import { TabsProfileComponent } from './tabs-profile.component';
import { TabsProfileService } from './tabs-profile.service';
import { ContactModule } from './contact/contact.module';

@NgModule( {
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedModule,
    ProfileModule,
    ContactModule,
  ],
  declarations: [ TabsProfileComponent ],
  providers: [ TabsProfileService ]
} )
export class TabsProfileModule {
}
