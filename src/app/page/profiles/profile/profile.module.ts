import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../../shared/shared.module';
import { ProfileComponent } from './profile.component';
import { ProfileService } from './profile.service';

@NgModule( {
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedModule,
  ],
  declarations: [ ProfileComponent ],
  providers: [ ProfileService ]
} )
export class ProfileModule {
}
