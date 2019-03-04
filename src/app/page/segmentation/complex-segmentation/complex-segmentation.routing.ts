import { Routes, RouterModule } from '@angular/router';
import { ComplexSegmentationComponent } from './complex-segmentation.component';

const routes: Routes = [
  { path: '', component: ComplexSegmentationComponent },
];

export const ComplexSegmentationRoutes = RouterModule.forChild(routes);
