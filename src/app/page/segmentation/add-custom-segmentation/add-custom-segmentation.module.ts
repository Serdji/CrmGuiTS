import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../../shared/shared.module';
import { ComponentsModule } from '../../../components/components.module';
import { TranslateModule } from '@ngx-translate/core';
import { AddCustomSegmentationRoutes } from './add-custom-segmentation-reportrouting';
import { AddCustomSegmentationComponent } from './add-custom-segmentation.component';
import { AddCustomSegmentationService } from './add-custom-segmentation.service';
import { ListSegmentationService } from '../list-segmentation/list-segmentation.service';


@NgModule( {
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedModule,
    ComponentsModule,
    ComponentsModule,
    TranslateModule,
    AddCustomSegmentationRoutes,
  ],
  declarations: [ AddCustomSegmentationComponent ],
  providers: [
    AddCustomSegmentationService,
    ListSegmentationService
  ]
} )
export class AddCustomSegmentationModule {
}
