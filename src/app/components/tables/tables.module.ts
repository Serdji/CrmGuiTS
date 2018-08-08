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

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    DirectivesModule,
  ],
  declarations: [
    TableExampleComponent,
    TableAsyncComponent,
    TableAsyncProfileComponent,
    TableExampleContactComponent,
    TabletExampleProfileNamesComponent,
  ],
  exports: [
    TableExampleComponent,
    TableAsyncComponent,
    TableAsyncProfileComponent,
    TableExampleContactComponent,
    TabletExampleProfileNamesComponent,
  ],
  providers: [
    TableAsyncService,
    TableAsyncProfileService,
  ]
})
export class TablesModule { }
