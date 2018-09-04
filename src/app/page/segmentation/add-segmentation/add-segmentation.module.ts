import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddSegmentationComponent } from './add-segmentation.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../../shared/shared.module';
import { DirectivesModule } from '../../../directives/directives.module';
import { AddSegmentationService } from './add-segmentation.service';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedModule,
    DirectivesModule,
  ],
  declarations: [ AddSegmentationComponent ],
  providers: [ AddSegmentationService ],
})
export class AddSegmentationModule { }