import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ProfileModule } from './profile/profile.module';
import { SharedModule } from '../../../shared/shared.module';

@NgModule( {
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedModule,
    ProfileModule
  ],
  declarations: [ ],
  providers: [ ]
} )
export class TabsModule {
}
