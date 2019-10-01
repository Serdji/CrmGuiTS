import { Routes, RouterModule } from '@angular/router';
import { EventComponent } from './event.component';

const routes: Routes = [
  { path: '', component: EventComponent },
];

export const EventRoutes = RouterModule.forChild(routes);
