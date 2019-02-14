import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DistributionReportComponent } from './distribution-report.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../../shared/shared.module';
import { ComponentsModule } from '../../../components/components.module';
import { AddPromotionsRoutes } from '../../promotions/add-promotions/add-promotions.routing';
import { DistributionReportService } from './distribution-report.service';

@NgModule( {
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedModule,
    ComponentsModule,
    AddPromotionsRoutes
  ],
  declarations: [ DistributionReportComponent ],
  providers: [ DistributionReportService ]
} )
export class DistributionReportModule {
}
