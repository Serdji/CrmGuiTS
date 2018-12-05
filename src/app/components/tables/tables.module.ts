import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { DirectivesModule } from '../../directives/directives.module';
import { TableExampleComponent } from './tablet-example/table-example.component';
import { TableAsyncProfileComponent } from './table-async-profile/table-async-profile.component';
import { TableExampleContactComponent } from './tablet-example-contact/table-example-contact.component';
import { TabletExampleProfileNamesComponent } from './tablet-example-profile-names/tablet-example-profile-names.component';
import { TabletExampleDocumentComponent } from './tablet-example-document/tablet-example-document.component';
import { PipesModule } from '../../pipes/pipes.module';
import { TabletExampleSegmentationComponent } from './tablet-example-segmentation/tablet-example-segmentation.component';
import { TabletAsyncSegmentationProfileComponent } from './tablet-async-segmentation-profile/tablet-async-segmentation-profile.component';
import { TabletExampleProfileGroupComponent } from './tablet-example-profile-group/tablet-example-profile-group.component';
import { EditorsModule } from '../editors/editors.module';
import { TabletExampleDistributionComponent } from './tablet-example-distribution/tablet-example-distribution.component';
import { TabletAsyncDistributionProfileComponent } from './tablet-async-distribution-profile/tablet-async-distribution-profile.component';
import { TabletAsyncPromotionsComponent } from './tablet-async-promotions/tablet-async-promotions.component';
import { PromoCodModule } from '../promo-cod/promo-cod.module';
import { TableAsyncService } from '../../services/table-async.service';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    DirectivesModule,
    PipesModule,
    EditorsModule,
    PromoCodModule,
  ],
  declarations: [
    TableExampleComponent,
    TableAsyncProfileComponent,
    TableExampleContactComponent,
    TabletExampleProfileNamesComponent,
    TabletExampleDocumentComponent,
    TabletExampleSegmentationComponent,
    TabletAsyncSegmentationProfileComponent,
    TabletExampleProfileGroupComponent,
    TabletExampleDistributionComponent,
    TabletAsyncDistributionProfileComponent,
    TabletAsyncPromotionsComponent,
  ],
  exports: [
    TableExampleComponent,
    TableAsyncProfileComponent,
    TableExampleContactComponent,
    TabletExampleProfileNamesComponent,
    TabletExampleDocumentComponent,
    TabletExampleSegmentationComponent,
    TabletAsyncSegmentationProfileComponent,
    TabletExampleProfileGroupComponent,
    TabletExampleDistributionComponent,
    TabletAsyncDistributionProfileComponent,
    TabletAsyncPromotionsComponent,
  ],
  providers: [
    TableAsyncService
  ]
})
export class TablesModule { }
