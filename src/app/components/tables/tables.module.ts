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
import { TableExampleDistributionComponent } from './table-example-distribution/table-example-distribution.component';
import { TableAsyncDistributionProfileComponent } from './table-async-distribution-profile/table-async-distribution-profile.component';
import { TableAsyncPromotionsComponent } from './table-async-promotions/table-async-promotions.component';
import { PromoCodeModule } from '../promo-code/promo-code.module';
import { TableAsyncService } from '../../services/table-async.service';
import { TableAsyncPromoCodeProfileComponent } from './table-async-promo-code-profile/table-async-promo-code-profile.component';
import { TableAsyncSearchPromoCodeComponent } from './table-async-search-promo-code/table-async-search-promo-code.component';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    DirectivesModule,
    PipesModule,
    EditorsModule,
    PromoCodeModule,
    RouterModule,
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
    TableExampleDistributionComponent,
    TableAsyncDistributionProfileComponent,
    TableAsyncPromotionsComponent,
    TableAsyncPromoCodeProfileComponent,
    TableAsyncSearchPromoCodeComponent,
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
    TableExampleDistributionComponent,
    TableAsyncDistributionProfileComponent,
    TableAsyncPromotionsComponent,
    TableAsyncPromoCodeProfileComponent,
    TableAsyncSearchPromoCodeComponent,
  ],
  providers: [
    TableAsyncService
  ]
})
export class TablesModule { }
