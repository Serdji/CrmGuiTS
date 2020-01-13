import { Routes, RouterModule } from '@angular/router';
import { CustomSegmentationComponent } from './custom-segmentation.component';

const routes: Routes = [
  { path: '', component: CustomSegmentationComponent },
];

export const CustomSegmentationRoutes = RouterModule.forChild(routes);
