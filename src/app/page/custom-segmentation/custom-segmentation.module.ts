import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomSegmentationComponent } from './custom-segmentation.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { ComponentsModule } from '../../components/components.module';
import { TranslateModule } from '@ngx-translate/core';
import { CustomSegmentationService } from './custom-segmentation.service';
import { CustomSegmentationRoutes } from './custom-segmentation-reportrouting';


@NgModule( {
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedModule,
    ComponentsModule,
    CustomSegmentationRoutes,
    ComponentsModule,
    TranslateModule,
  ],
  declarations: [ CustomSegmentationComponent ],
  providers: [ CustomSegmentationService ]
} )
export class CustomSegmentationModule {
}
