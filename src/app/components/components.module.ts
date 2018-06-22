import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { TableExampleComponent } from './tablet-example/table-example.component';
import { TableAsyncComponent } from './table-async/table-async.component';
import { TableAsyncService } from './table-async/table-async.service';

@NgModule({
  imports: [
    CommonModule,
    SharedModule
  ],
  declarations: [
    TableExampleComponent,
    TableAsyncComponent,
  ],
  exports: [
    TableExampleComponent,
    TableAsyncComponent
  ],
  providers: [TableAsyncService]
})
export class ComponentsModule {
  static forRoot(): ModuleWithProviders {
    return { ngModule: SharedModule };
  }
}
