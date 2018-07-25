import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsComponent } from './settings.component';
import { SharedModule } from '../../shared/shared.module';
import { SettingsService } from './settings.service';
import { ReactiveFormsModule } from '@angular/forms';
import { DragulaModule } from 'ng2-dragula';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule( {
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    PipesModule,
    DragulaModule.forRoot(),
  ],
  declarations: [ SettingsComponent ],
  providers: [ SettingsService ]
} )
export class SettingsModule {
}
