import { Routes, RouterModule } from '@angular/router';
import { ListDistributionComponent } from './list-distribution.component';

const routes: Routes = [
  { path: '', component: ListDistributionComponent },
];

export const ListDistributionRoutes = RouterModule.forChild(routes);
