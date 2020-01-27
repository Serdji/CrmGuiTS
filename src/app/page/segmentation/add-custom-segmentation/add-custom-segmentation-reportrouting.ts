import { Routes, RouterModule } from '@angular/router';
import { AddCustomSegmentationComponent } from './add-custom-segmentation.component';

const routes: Routes = [
  { path: '', component: AddCustomSegmentationComponent },
];

export const AddCustomSegmentationRoutes = RouterModule.forChild(routes);
