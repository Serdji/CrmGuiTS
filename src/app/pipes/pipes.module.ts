import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FieldTranslationPipe } from './field-translation.pipe';
import { SafeHtmlPipe } from './safe-html.pipe';

@NgModule( {
  imports: [
    CommonModule
  ],
  declarations: [
    FieldTranslationPipe,
    SafeHtmlPipe,
  ],
  exports: [
    FieldTranslationPipe,
    SafeHtmlPipe,
  ],
} )
export class PipesModule {
}
