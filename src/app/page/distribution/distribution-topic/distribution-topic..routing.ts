import { Routes, RouterModule } from '@angular/router';
import { DistributionTopicComponent } from './distribution-topic.component';

const routes: Routes = [
  { path: '', component: DistributionTopicComponent },
];

export const DistributionTopicRoutes = RouterModule.forChild(routes);
