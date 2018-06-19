import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutComponent } from './layout/layout.component';
import { DialogComponent } from './dialog/dialog.component';
import { TableExampleComponent } from './tablet-example/table-example.component';
import { LayoutService } from './layout/layout.service';
import { TableAsyncService } from './table-async/table-async.service';
import { ToolbarComponent } from './layout/toolbar/toolbar.component';
import { SidenavComponent } from './layout/sidenav/sidenav.component';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../material.module';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    RouterModule,
    MaterialModule
  ],
  declarations: [
    LayoutComponent,
    ToolbarComponent,
    SidenavComponent,
    TableExampleComponent,
    DialogComponent,
  ],
  providers: [
    LayoutService,
    TableAsyncService,
  ],
})
export class SharedModule {
  static forRoot(): ModuleWithProviders {
    return { ngModule: SharedModule };
  }
}
