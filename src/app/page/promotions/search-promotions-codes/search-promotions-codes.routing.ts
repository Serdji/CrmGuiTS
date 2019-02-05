import { Routes, RouterModule } from '@angular/router';
import { SearchPromotionsCodesComponent } from './search-promotions-codes.component';

const routes: Routes = [
  { path: '', component: SearchPromotionsCodesComponent },
];

export const SearchPromotionsCodesRoutes = RouterModule.forChild(routes);
