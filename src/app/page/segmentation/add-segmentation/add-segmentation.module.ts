import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddSegmentationComponent } from './add-segmentation.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../../shared/shared.module';
import { DirectivesModule } from '../../../directives/directives.module';
import { AddSegmentationService } from './add-segmentation.service';
import { ComponentsModule } from '../../../components/components.module';
import { AddSegmentationRoutes } from './add-segmentation.routing';
import { ProfileSearchService } from '../../profiles/profile-search/profile-search.service';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedModule,
    DirectivesModule,
    ComponentsModule,
    AddSegmentationRoutes
  ],
  declarations: [ AddSegmentationComponent ],
  providers: [
    AddSegmentationService,
    ProfileSearchService
  ],
})
export class AddSegmentationModule { }
