import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PipesModule } from '../../../pipes/pipes.module';
import { ReactiveFormsModule } from '@angular/forms';
import { DragulaModule } from 'ng2-dragula';
import { SharedModule } from '../../../shared/shared.module';
import { SettingsService } from '../settings.service';
import { FormTableAsyncProfileSettingsComponent } from './form-table-async-profile-settings.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    PipesModule,
    DragulaModule.forRoot(),
  ],
  declarations: [ FormTableAsyncProfileSettingsComponent ],
  providers: [ SettingsService ]
})
export class FormTableAsyncProfileSettingsModule { }
