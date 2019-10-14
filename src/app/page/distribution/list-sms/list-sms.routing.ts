import { Routes, RouterModule } from '@angular/router';
import { ListSmsComponent } from './list-sms.component';

const routes: Routes = [
  { path: '', component: ListSmsComponent },
];

export const ListSmsRoutes = RouterModule.forChild(routes);
