import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsComponent } from './settings.component';
import { SharedModule } from '../../shared/shared.module';
import { SettingsService } from './settings.service';

@NgModule( {
  imports: [
    CommonModule,
    SharedModule,
  ],
  declarations: [ SettingsComponent ],
  providers: [ SettingsService ]
} )
export class SettingsModule {
}
