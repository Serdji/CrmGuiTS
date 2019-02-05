import { Routes, RouterModule } from '@angular/router';
import { RestartComponent } from './restart.component';

const routes: Routes = [
  { path: '', component: RestartComponent },
];

export const RestartRoutes = RouterModule.forChild(routes);
