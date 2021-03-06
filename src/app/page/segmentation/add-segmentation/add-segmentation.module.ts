import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddSegmentationComponent } from './add-segmentation.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../../shared/shared.module';
import { DirectivesModule } from '../../../directives/directives.module';
import { AddSegmentationService } from './add-segmentation.service';
import { ComponentsModule } from '../../../components/components.module';
import { AddSegmentationRoutes } from './add-segmentation.routing';
import { TranslateModule } from '@ngx-translate/core';
import { NgxMaskModule } from 'ngx-mask';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedModule,
    DirectivesModule,
    ComponentsModule,
    AddSegmentationRoutes,
    TranslateModule,
    NgxMaskModule
  ],
  declarations: [ AddSegmentationComponent ],
  providers: [ AddSegmentationService ],
})
export class AddSegmentationModule { }
