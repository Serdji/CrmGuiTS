import { Routes, RouterModule } from '@angular/router';
import { ListUsersComponent } from './list-users.component';

const routes: Routes = [
  { path: '', component: ListUsersComponent },
];

export const ListUsersRoutes = RouterModule.forChild(routes);
