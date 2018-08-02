import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { DirectivesModule } from '../../directives/directives.module';
import { TableExampleComponent } from './tablet-example/table-example.component';
import { TableAsyncComponent } from './table-async/table-async.component';
import { TableAsyncProfileComponent } from './table-async-profile/table-async-profile.component';
import { TableAsyncService } from './table-async/table-async.service';
import { TableAsyncProfileService } from './table-async-profile/table-async-profile.service';

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
  ],
  exports: [
    TableExampleComponent,
    TableAsyncComponent,
    TableAsyncProfileComponent,
  ],
  providers: [
    TableAsyncService,
    TableAsyncProfileService,
  ]
})
export class TablesModule { }
