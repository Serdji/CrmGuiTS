import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../../shared/shared.module';
import { ProfileComponent } from './profile.component';

@NgModule( {
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedModule,
  ],
  declarations: [ ProfileComponent ]
} )
export class ProfileModule {
}
