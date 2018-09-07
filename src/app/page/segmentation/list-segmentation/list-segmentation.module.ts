import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListSegmentationService } from './list-segmentation.service';
import { SharedModule } from '../../../shared/shared.module';
import { ListSegmentationComponent } from './list-segmentation.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
  ],
  declarations: [ ListSegmentationComponent],
  providers: [ ListSegmentationService ]
})
export class ListSegmentationModule { }
