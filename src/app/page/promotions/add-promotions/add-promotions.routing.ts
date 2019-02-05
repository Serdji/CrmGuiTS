import { Routes, RouterModule } from '@angular/router';
import { AddPromotionsComponent } from './add-promotions.component';

const routes: Routes = [
  { path: '', component: AddPromotionsComponent },
];

export const AddPromotionsRoutes = RouterModule.forChild(routes);
