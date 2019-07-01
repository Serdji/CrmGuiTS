import { Routes, RouterModule } from '@angular/router';
import { StatisticsReportComponent } from './statistics-report.component';

const routes: Routes = [
  { path: '', component: StatisticsReportComponent },
];

export const StatisticsReportRoutes = RouterModule.forChild(routes);
