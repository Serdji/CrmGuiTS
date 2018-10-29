import { ModuleWithProviders, NgModule } from '@angular/core';
import { TablesModule } from './tables/tables.module';
import { CommonModule } from '@angular/common';
import { EditorModule } from './editor/editor.module';

@NgModule({
  imports: [
    CommonModule,
    TablesModule,
    EditorModule,
  ],
  exports: [
    TablesModule,
    EditorModule,
  ],
})
export class ComponentsModule {
  static forRoot(): ModuleWithProviders {
    return { ngModule: ComponentsModule };
  }}
