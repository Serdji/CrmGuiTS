import { Routes, RouterModule } from '@angular/router';
import { AgeIntervalComponent } from './age-interval.component';

const routes: Routes = [
  { path: '', component: AgeIntervalComponent },
];

export const AgeIntervalRoutes = RouterModule.forChild(routes);
