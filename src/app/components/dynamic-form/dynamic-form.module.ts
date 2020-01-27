import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicFormComponent } from './dynamic-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { DirectivesModule } from '../../directives/directives.module';

@NgModule( {
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedModule,
    TranslateModule,
    DirectivesModule
  ],
  declarations: [ DynamicFormComponent ],
  exports: [ DynamicFormComponent ],
} )
export class DynamicFormModule {
}
