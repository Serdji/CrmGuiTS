import { Routes, RouterModule } from '@angular/router';
import { ProfileDistributionComponent } from './profile-distribution.component';

const routes: Routes = [
  { path: '', component: ProfileDistributionComponent },
];

export const ProfileDistributionRoutes = RouterModule.forChild(routes);
