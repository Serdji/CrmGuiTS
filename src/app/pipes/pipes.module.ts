import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FieldTranslationPipe } from './field-translation.pipe';

@NgModule( {
  imports: [
    CommonModule
  ],
  declarations: [ FieldTranslationPipe ],
  exports: [ FieldTranslationPipe ],
} )
export class PipesModule {
}
