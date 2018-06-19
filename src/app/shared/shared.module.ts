import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutModule } from './layout/layout.module';
import { DialogModule } from './dialog/dialog.module';
import { DialogComponent } from './dialog/dialog.component';

@NgModule({
  imports: [
    CommonModule,
    LayoutModule,
    DialogModule,
  ],
  entryComponents: [ DialogComponent ],
  declarations: []
})
export class SharedModule {
}
