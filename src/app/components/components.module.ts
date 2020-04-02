import { ModuleWithProviders, NgModule } from '@angular/core';
import { TablesModule } from './tables/tables.module';
import { CommonModule } from '@angular/common';
import { EditorsModule } from './editors/editors.module';
import { PromoCodeModule } from './promo-code/promo-code.module';
import { DynamicFormModule } from './dynamic-form/dynamic-form.module';
import { MergeProfileModule } from './merge-profile/merge-profile.module';
import { ReportAccessRightsModule } from './report-access-rights/report-access-rights.module';
import { SwitchLangModule } from './switch-lang/switch-lang.module';

@NgModule({
  imports: [
    CommonModule,
    TablesModule,
    EditorsModule,
    PromoCodeModule,
    MergeProfileModule,
    DynamicFormModule,
    ReportAccessRightsModule,
    SwitchLangModule
  ],
  exports: [
    TablesModule,
    EditorsModule,
    PromoCodeModule,
    MergeProfileModule,
    DynamicFormModule,
    ReportAccessRightsModule,
    SwitchLangModule
  ],
})
export class ComponentsModule {
  static forRoot(): ModuleWithProviders {
    return { ngModule: ComponentsModule };
  }}
