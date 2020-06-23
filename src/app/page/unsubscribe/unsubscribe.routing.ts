import { Routes, RouterModule } from '@angular/router';
import { UnsubscribeComponent } from './unsubscribe.component';

const routes: Routes = [
  { path: '', component: UnsubscribeComponent },
];

export const UnsubscribeRoutes = RouterModule.forChild(routes);
