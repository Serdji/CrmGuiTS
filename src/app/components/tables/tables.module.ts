import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { DirectivesModule } from '../../directives/directives.module';
import { TableExampleComponent } from './table-example/table-example.component';
import { TableAsyncProfileComponent } from './table-async-profile/table-async-profile.component';
import { TableExampleContactComponent } from './table-example-contact/table-example-contact.component';
import { TableExampleProfileNamesComponent } from './table-example-profile-names/table-example-profile-names.component';
import { TableExampleDocumentComponent } from './table-example-document/table-example-document.component';
import { PipesModule } from '../../pipes/pipes.module';
import { TableExampleSegmentationComponent } from './table-example-segmentation/table-example-segmentation.component';
import { TableAsyncSegmentationProfileComponent } from './table-async-segmentation-profile/table-async-segmentation-profile.component';
import { TableExampleProfileGroupComponent } from './table-example-profile-group/table-example-profile-group.component';
import { EditorsModule } from '../editors/editors.module';
import { TableAsyncPromotionsComponent } from './table-async-promotions/table-async-promotions.component';
import { PromoCodeModule } from '../promo-code/promo-code.module';
import { TableAsyncService } from '../../services/table-async.service';
import { TableAsyncPromoCodeProfileComponent } from './table-async-promo-code-profile/table-async-promo-code-profile.component';
import { TableAsyncSearchPromoCodeComponent } from './table-async-search-promo-code/table-async-search-promo-code.component';
import { RouterModule } from '@angular/router';
import { MergeProfileModule } from '../merge-profile/merge-profile.module';
import { TableExampleComplexSegmentationComponent } from './table-example-complex-segmentation/table-example-complex-segmentation.component';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { TableExampleTaskComponent } from './table-example-task/table-example-task.component';
import { TableAsyncEventProfileComponent } from './table-async-event-profile/table-async-event-profile.component';
import { TableAsyncSearchPromoCodeService } from './table-async-search-promo-code/table-async-search-promo-code.service';
import { TableAsyncEmailComponent } from './table-async-email/table-async-email.component';
import { TableAsyncSmsComponent } from './table-async-sms/table-async-sms.component';
import { TableAsyncEmailDistributionProfileComponent } from './table-async-email-distribution-profile/table-async-email-distribution-profile.component';
import { TableAsyncSmsDistributionProfileComponent } from './table-async-sms-distribution-profile/table-async-sms-distribution-profile.component';
import { TableExampleCustomSegmentationComponent } from './table-example-custom-segmentation/table-example-custom-segmentation.component';
import { TableExampleCompanionsComponent } from './table-example-companions/table-example-companions.component';
import { TableExampleDistributionTopicComponent } from './table-example-distribution-topic/table-example-distribution-topic.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    DirectivesModule,
    PipesModule,
    EditorsModule,
    PromoCodeModule,
    MergeProfileModule,
    RouterModule,
    ReactiveFormsModule,
    TranslateModule,
  ],
  declarations: [
    TableExampleComponent,
    TableAsyncProfileComponent,
    TableExampleContactComponent,
    TableExampleProfileNamesComponent,
    TableExampleDocumentComponent,
    TableExampleSegmentationComponent,
    TableAsyncSegmentationProfileComponent,
    TableExampleProfileGroupComponent,
    TableAsyncEmailComponent,
    TableAsyncSmsComponent,
    TableAsyncEmailDistributionProfileComponent,
    TableAsyncSmsDistributionProfileComponent,
    TableAsyncPromotionsComponent,
    TableAsyncPromoCodeProfileComponent,
    TableAsyncSearchPromoCodeComponent,
    TableExampleComplexSegmentationComponent,
    TableExampleCustomSegmentationComponent,
    TableExampleTaskComponent,
    TableAsyncEventProfileComponent,
    TableExampleCompanionsComponent,
    TableExampleDistributionTopicComponent,
  ],
  exports: [
    TableExampleComponent,
    TableAsyncProfileComponent,
    TableExampleContactComponent,
    TableExampleProfileNamesComponent,
    TableExampleDocumentComponent,
    TableExampleSegmentationComponent,
    TableAsyncSegmentationProfileComponent,
    TableExampleProfileGroupComponent,
    TableAsyncEmailComponent,
    TableAsyncSmsComponent,
    TableAsyncEmailDistributionProfileComponent,
    TableAsyncSmsDistributionProfileComponent,
    TableAsyncPromotionsComponent,
    TableAsyncPromoCodeProfileComponent,
    TableAsyncSearchPromoCodeComponent,
    TableExampleComplexSegmentationComponent,
    TableExampleCustomSegmentationComponent,
    TableExampleTaskComponent,
    TableAsyncEventProfileComponent,
    TableExampleCompanionsComponent,
    TableExampleDistributionTopicComponent,
  ],
  providers: [
    TableAsyncService,
    TableAsyncSearchPromoCodeService
  ]
})
export class TablesModule { }
