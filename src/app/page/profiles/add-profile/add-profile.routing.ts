import { Routes, RouterModule } from '@angular/router';
import { AddProfileComponent } from './add-profile.component';

const routes: Routes = [
  { path: '', component: AddProfileComponent },
];

export const AddProfileRoutes = RouterModule.forChild(routes);
