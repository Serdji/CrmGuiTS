import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportAccessRightsComponent } from './report-access-rights.component';
import { SharedModule } from '../../shared/shared.module';
import { ReportAccessRightsService } from './report-access-rights.service';

@NgModule( {
  imports: [
    CommonModule,
    SharedModule,
  ],
  declarations: [ ReportAccessRightsComponent ],
  exports: [ ReportAccessRightsComponent ],
  providers: [ ReportAccessRightsService ]
} )
export class ReportAccessRightsModule {
}
