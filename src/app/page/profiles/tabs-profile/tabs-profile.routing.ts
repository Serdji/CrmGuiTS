import { Routes, RouterModule } from '@angular/router';
import { TabsProfileComponent } from './tabs-profile.component';

const routes: Routes = [
  { path: '', component: TabsProfileComponent },
];

export const TabsProfileRoutes = RouterModule.forChild(routes);
