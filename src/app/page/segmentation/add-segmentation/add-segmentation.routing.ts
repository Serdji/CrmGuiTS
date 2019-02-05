import { Routes, RouterModule } from '@angular/router';
import { AddSegmentationComponent } from './add-segmentation.component';

const routes: Routes = [
  { path: '', component: AddSegmentationComponent },
];

export const AddSegmentationRoutes = RouterModule.forChild(routes);
