import { ModuleWithProviders, NgModule } from '@angular/core';
import { TablesModule } from './tables/tables.module';
import { CommonModule } from '@angular/common';
import { EditorsModule } from './editors/editors.module';
import { PromoCodeModule } from './promo-code/promo-code.module';

@NgModule({
  imports: [
    CommonModule,
    TablesModule,
    EditorsModule,
    PromoCodeModule,
  ],
  exports: [
    TablesModule,
    EditorsModule,
    PromoCodeModule,
  ],
})
export class ComponentsModule {
  static forRoot(): ModuleWithProviders {
    return { ngModule: ComponentsModule };
  }}
