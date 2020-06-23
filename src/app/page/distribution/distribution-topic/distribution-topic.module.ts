import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DistributionTopicComponent } from './distribution-topic.component';
import { DistributionTopicRoutes } from './distribution-topic..routing';
import { SharedModule } from '../../../shared/shared.module';
import { ComponentsModule } from '../../../components/components.module';
import { ReactiveFormsModule } from '@angular/forms';
import { DistributionTopicService } from './distribution-topic.service';
import { TranslateModule } from '@ngx-translate/core';



@NgModule({
  declarations: [DistributionTopicComponent],
  imports: [
    CommonModule,
    SharedModule,
    ComponentsModule,
    ReactiveFormsModule,
    TranslateModule,
    DistributionTopicRoutes
  ],
  providers: [ DistributionTopicService ]
})
export class DistributionTopicModule { }
