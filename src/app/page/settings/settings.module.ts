import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormTableAsyncProfileSettingsModule } from './form-table-async-profile-settings/form-table-async-profile-settings.module';

@NgModule( {
  imports: [
    CommonModule,
    FormTableAsyncProfileSettingsModule,
  ],
  declarations: [],
  providers: []
} )
export class SettingsModule {
}
