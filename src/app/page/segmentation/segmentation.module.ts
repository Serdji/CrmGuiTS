import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddSegmentationModule } from './add-segmentation/add-segmentation.module';
import { ListSegmentationModule } from './list-segmentation/list-segmentation.module';

@NgModule({
  imports: [
    CommonModule,
    AddSegmentationModule,
    ListSegmentationModule,
  ],
  declarations: []
})
export class SegmentationModule { }
