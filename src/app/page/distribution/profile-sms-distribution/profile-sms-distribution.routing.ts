import { Routes, RouterModule } from '@angular/router';
import { ProfileSmsDistributionComponent } from './profile-sms-distribution.component';

const routes: Routes = [
  { path: '', component: ProfileSmsDistributionComponent },
];

export const ProfileSmsDistributionRoutes = RouterModule.forChild(routes);
