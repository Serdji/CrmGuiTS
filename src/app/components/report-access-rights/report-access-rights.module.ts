import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportAccessRightsComponent } from './report-access-rights.component';
import { SharedModule } from '../../shared/shared.module';

@NgModule( {
  imports: [
    CommonModule,
    SharedModule,
  ],
  declarations: [ ReportAccessRightsComponent ],
  exports: [ ReportAccessRightsComponent ],
} )
export class ReportAccessRightsModule {
}
