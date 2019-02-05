import { Routes, RouterModule } from '@angular/router';
import { ListSegmentationComponent } from './list-segmentation.component';

const routes: Routes = [
  { path: '', component: ListSegmentationComponent },
];

export const ListSegmentationRoutes = RouterModule.forChild(routes);
