import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DistributionReportComponent } from './distribution-report.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../../shared/shared.module';
import { ComponentsModule } from '../../../components/components.module';
import { DistributionReportService } from './distribution-report.service';
import { DistributionReportRoutes } from './distribution-report.routing';

@NgModule( {
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedModule,
    ComponentsModule,
    DistributionReportRoutes
  ],
  declarations: [ DistributionReportComponent ],
  providers: [ DistributionReportService ]
} )
export class DistributionReportModule {
}
