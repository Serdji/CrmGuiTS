import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ErrorPageComponent } from './error-page.component';
import { SharedModule } from '../../shared/shared.module';
import { MaterialModule } from '../../shared/material';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    MaterialModule,
  ],
  declarations: [ErrorPageComponent]
})
export class ErrorPageModule { }
