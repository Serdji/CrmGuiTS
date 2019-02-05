import { Routes, RouterModule } from '@angular/router';
import { EntranceComponent } from './entrance.component';

const routes: Routes = [
  { path: '', component: EntranceComponent },
];

export const EntranceRoutes = RouterModule.forChild(routes);
