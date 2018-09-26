import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutModule } from './layout/layout.module';
import { DialogModule } from './dialog/dialog.module';
import { DialogComponent } from './dialog/dialog.component';
import { MaterialModule } from './material/material.module';

@NgModule({
  exports: [
    CommonModule,
    LayoutModule,
    DialogModule,
    MaterialModule,
  ],
  entryComponents: [ DialogComponent ],
  declarations: []
})
export class SharedModule {
  static forRoot(): ModuleWithProviders {
    return { ngModule: SharedModule };
  }
}
