import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsComponent } from './settings.component';
import { SharedModule } from '../../shared/shared.module';

@NgModule( {
  imports: [
    CommonModule,
    SharedModule,
  ],
  declarations: [ SettingsComponent ]
} )
export class SettingsModule {
}
