import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { DirectivesModule } from '../../directives/directives.module';
import { TableExampleComponent } from './tablet-example/table-example.component';
import { TableAsyncComponent } from './table-async/table-async.component';
import { TableAsyncProfileComponent } from './table-async-profile/table-async-profile.component';
import { TableAsyncService } from './table-async/table-async.service';
import { TableAsyncProfileService } from './table-async-profile/table-async-profile.service';
import { TableExampleContactComponent } from './tablet-example-contact/table-example-contact.component';
import { TabletExampleProfileNamesComponent } from './tablet-example-profile-names/tablet-example-profile-names.component';
import { TabletExampleDocumentComponent } from './tablet-example-document/tablet-example-document.component';
import { PipesModule } from '../../pipes/pipes.module';
import { TabletExampleSegmentationComponent } from './tablet-example-segmentation/tablet-example-segmentation.component';
import { TabletAsyncSegmentationProfileComponent } from './tablet-async-segmentation-profile/tablet-async-segmentation-profile.component';
import { TabletAsyncSegmentationProfileService } from './tablet-async-segmentation-profile/tablet-async-segmentation-profile.service';
import { TabletExampleProfileGroupComponent } from './tablet-example-profile-group/tablet-example-profile-group.component';
import { EditorsModule } from '../editors/editors.module';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    DirectivesModule,
    PipesModule,
    EditorsModule
  ],
  declarations: [
    TableExampleComponent,
    TableAsyncComponent,
    TableAsyncProfileComponent,
    TableExampleContactComponent,
    TabletExampleProfileNamesComponent,
    TabletExampleDocumentComponent,
    TabletExampleSegmentationComponent,
    TabletAsyncSegmentationProfileComponent,
    TabletExampleProfileGroupComponent,
  ],
  exports: [
    TableExampleComponent,
    TableAsyncComponent,
    TableAsyncProfileComponent,
    TableExampleContactComponent,
    TabletExampleProfileNamesComponent,
    TabletExampleDocumentComponent,
    TabletExampleSegmentationComponent,
    TabletAsyncSegmentationProfileComponent,
    TabletExampleProfileGroupComponent,
  ],
  providers: [
    TableAsyncService,
    TableAsyncProfileService,
    TabletAsyncSegmentationProfileService
  ]
})
export class TablesModule { }
