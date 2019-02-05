import { Routes, RouterModule } from '@angular/router';
import { ErrorPageComponent } from './error-page.component';

const routes: Routes = [
  { path: '', component: ErrorPageComponent },
];

export const ErrorPageRoutes = RouterModule.forChild(routes);
