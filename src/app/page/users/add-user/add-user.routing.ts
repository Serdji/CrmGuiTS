import { Routes, RouterModule } from '@angular/router';
import { AddUserComponent } from './add-user.component';

const routes: Routes = [
  { path: '', component: AddUserComponent },
];

export const AddUserRoutes = RouterModule.forChild(routes);
