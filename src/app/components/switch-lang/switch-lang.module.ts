import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SwitchLangComponent } from './switch-lang.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module'
import { TranslateModule } from '@ngx-translate/core';
import { MaterialModule } from '../../shared/material';


@NgModule( {
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    MaterialModule,
  ],
  declarations: [ SwitchLangComponent ],
  exports: [ SwitchLangComponent ]
} )
export class SwitchLangModule {
}
