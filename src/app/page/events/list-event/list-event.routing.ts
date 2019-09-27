import { Routes, RouterModule } from '@angular/router';
import { ListEventComponent } from './list-event.component';

const routes: Routes = [
  { path: '', component: ListEventComponent },
];

export const ListEventRoutes = RouterModule.forChild(routes);
