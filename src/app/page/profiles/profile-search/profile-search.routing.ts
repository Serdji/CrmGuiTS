import { Routes, RouterModule } from '@angular/router';
import { ProfileSearchComponent } from './profile-search.component';

const routes: Routes = [
  { path: '', component: ProfileSearchComponent },
];

export const ProfileSearchRoutes = RouterModule.forChild(routes);
