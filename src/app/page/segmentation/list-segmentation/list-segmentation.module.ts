import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListSegmentationService } from './list-segmentation.service';
import { SharedModule } from '../../../shared/shared.module';
import { ListSegmentationComponent } from './list-segmentation.component';
import { ComponentsModule } from '../../../components/components.module';
import { DirectivesModule } from '../../../directives/directives.module';
import { ListSegmentationRoutes } from './list-segmentation.routing';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    DirectivesModule,
    ComponentsModule,
    ListSegmentationRoutes
  ],
  declarations: [ ListSegmentationComponent],
  providers: [ ListSegmentationService ]
})
export class ListSegmentationModule { }
