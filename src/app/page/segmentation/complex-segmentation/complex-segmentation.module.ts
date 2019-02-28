import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComplexSegmentationComponent } from './complex-segmentation.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../../shared/shared.module';
import { DirectivesModule } from '../../../directives/directives.module';
import { ComponentsModule } from '../../../components/components.module';
import { ComplexSegmentationRoutes } from './complex-segmentation.routing';
import { ListSegmentationService } from '../list-segmentation/list-segmentation.service';

@NgModule( {
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedModule,
    DirectivesModule,
    ComponentsModule,
    ComplexSegmentationRoutes,
  ],
  declarations: [ ComplexSegmentationComponent ],
  providers: [ ListSegmentationService ],
} )
export class ComplexSegmentationModule {
}
