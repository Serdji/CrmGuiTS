import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { TableExampleComponent } from './tablet-example/table-example.component';
import { TableAsyncComponent } from './table-async/table-async.component';
import { TableAsyncService } from './table-async/table-async.service';
import { TableAsyncProfileComponent } from './table-async-profile/table-async-profile.component';
import { TableAsyncProfileService } from './table-async-profile/table-async-profile.service';

@NgModule({
  imports: [
    CommonModule,
    SharedModule
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
export class ComponentsModule {
  static forRoot(): ModuleWithProviders {
    return { ngModule: SharedModule };
  }
}
