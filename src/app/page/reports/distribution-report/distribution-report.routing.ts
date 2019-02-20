import { Routes, RouterModule } from '@angular/router';
import { DistributionReportComponent } from './distribution-report.component';

const routes: Routes = [
  { path: '', component: DistributionReportComponent },
];

export const DistributionReportRoutes = RouterModule.forChild(routes);
