import { ModuleWithProviders, NgModule } from '@angular/core';
import { TablesModule } from './tables/tables.module';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [
    CommonModule,
    TablesModule,
  ],
  exports: [ TablesModule ],
})
export class ComponentsModule {
  static forRoot(): ModuleWithProviders {
    return { ngModule: ComponentsModule };
  }}
