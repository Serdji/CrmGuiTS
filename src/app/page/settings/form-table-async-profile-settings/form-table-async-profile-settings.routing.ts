import { Routes, RouterModule } from '@angular/router';
import { FormTableAsyncProfileSettingsComponent } from './form-table-async-profile-settings.component';

const routes: Routes = [
  { path: '', component: FormTableAsyncProfileSettingsComponent },
];

export const FormTableAsyncProfileSettingsRoutes = RouterModule.forChild(routes);
