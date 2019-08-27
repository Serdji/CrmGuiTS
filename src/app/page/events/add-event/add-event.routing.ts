import { Routes, RouterModule } from '@angular/router';
import { AddEventComponent } from './add-event.component';

const routes: Routes = [
  { path: '', component: AddEventComponent },
];

export const AddEventRoutes = RouterModule.forChild(routes);
