import { Routes, RouterModule } from '@angular/router';
import { ProfileEmailDistributionComponent } from './profile-email-distribution.component';

const routes: Routes = [
  { path: '', component: ProfileEmailDistributionComponent },
];

export const ProfileEmailDistributionRoutes = RouterModule.forChild(routes);
