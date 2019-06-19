import { ModuleWithProviders, NgModule } from '@angular/core';
import { TablesModule } from './tables/tables.module';
import { CommonModule } from '@angular/common';
import { EditorsModule } from './editors/editors.module';
import { PromoCodeModule } from './promo-code/promo-code.module';
import { DynamicFormModule } from './dynamic-form/dynamic-form.module';
import { MergeProfileModule } from './merge-profile/merge-profile.module';
import { ReportAccessRightsModule } from './report-access-rights/report-access-rights.module';

@NgModule({
  imports: [
    CommonModule,
    TablesModule,
    EditorsModule,
    PromoCodeModule,
    MergeProfileModule,
    DynamicFormModule,
    ReportAccessRightsModule,
  ],
  exports: [
    TablesModule,
    EditorsModule,
    PromoCodeModule,
    MergeProfileModule,
    DynamicFormModule,
    ReportAccessRightsModule,
  ],
})
export class ComponentsModule {
  static forRoot(): ModuleWithProviders {
    return { ngModule: ComponentsModule };
  }}
