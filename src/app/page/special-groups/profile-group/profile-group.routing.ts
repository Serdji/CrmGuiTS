import { Routes, RouterModule } from '@angular/router';
import { ProfileGroupComponent } from './profile-group.component';

const routes: Routes = [
  { path: '', component: ProfileGroupComponent },
];

export const ProfileGroupRoutes = RouterModule.forChild(routes);
