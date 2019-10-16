import { Routes, RouterModule } from '@angular/router';
import { ListEmailComponent } from './list-email.component';

const routes: Routes = [
  { path: '', component: ListEmailComponent },
];

export const ListEmailRoutes = RouterModule.forChild(routes);
