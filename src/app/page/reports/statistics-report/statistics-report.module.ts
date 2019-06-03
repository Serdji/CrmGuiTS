import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../../shared/shared.module';
import { ComponentsModule } from '../../../components/components.module';
import { StatisticsReportComponent } from './statistics-report.component';
import { StatisticsReportService } from './statistics-report.service';
import { StatisticsReportRoutes } from './statistics-reportrouting';

@NgModule( {
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedModule,
    ComponentsModule,
    StatisticsReportRoutes
  ],
  declarations: [ StatisticsReportComponent ],
  providers: [ StatisticsReportService ]
} )
export class StatisticsReportModule {
}
