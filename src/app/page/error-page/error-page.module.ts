import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ErrorPageComponent } from './error-page.component';
import { SharedModule } from '../../shared/shared.module';
import { MaterialModule } from '../../shared/material';
import { ErrorPageRoutes } from './error-page.routing';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    MaterialModule,
    ErrorPageRoutes
  ],
  declarations: [ErrorPageComponent]
})
export class ErrorPageModule { }
