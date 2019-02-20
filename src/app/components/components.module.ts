import { ModuleWithProviders, NgModule } from '@angular/core';
import { TablesModule } from './tables/tables.module';
import { CommonModule } from '@angular/common';
import { EditorsModule } from './editors/editors.module';
import { PromoCodeModule } from './promo-code/promo-code.module';
import { DynamicFormModule } from './dynamic-form/dynamic-form.module';

@NgModule({
  imports: [
    CommonModule,
    TablesModule,
    EditorsModule,
    PromoCodeModule,
    DynamicFormModule,
  ],
  exports: [
    TablesModule,
    EditorsModule,
    PromoCodeModule,
    DynamicFormModule,
  ],
})
export class ComponentsModule {
  static forRoot(): ModuleWithProviders {
    return { ngModule: ComponentsModule };
  }}
