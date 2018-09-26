import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormTableAsyncProfileSettingsModule } from './form-table-async-profile-settings/form-table-async-profile-settings.module';
import { RestartModule } from './restart/restart.module';

@NgModule( {
  imports: [
    CommonModule,
    FormTableAsyncProfileSettingsModule,
    RestartModule,
  ],
  declarations: [],
  providers: []
} )
export class SettingsModule {

}
