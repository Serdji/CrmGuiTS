import { Routes, RouterModule } from '@angular/router';
import { AddPromotionsCodesComponent } from './add-promotions-codes.component';

const routes: Routes = [
  { path: '', component: AddPromotionsCodesComponent },
];

export const AddPromotionsCodesRoutes = RouterModule.forChild(routes);
