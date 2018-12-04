import { ModuleWithProviders, NgModule } from '@angular/core';
import { TablesModule } from './tables/tables.module';
import { CommonModule } from '@angular/common';
import { EditorsModule } from './editors/editors.module';
import { PromoCodModule } from './promo-cod/promo-cod.module';

@NgModule({
  imports: [
    CommonModule,
    TablesModule,
    EditorsModule,
    PromoCodModule,
  ],
  exports: [
    TablesModule,
    EditorsModule,
    PromoCodModule,
  ],
})
export class ComponentsModule {
  static forRoot(): ModuleWithProviders {
    return { ngModule: ComponentsModule };
  }}
