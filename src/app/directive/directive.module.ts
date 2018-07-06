import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmEqualValidatorDirective } from './confirm-equal-validator.directive';

@NgModule( {
  imports: [
    CommonModule
  ],
  declarations: [ ConfirmEqualValidatorDirective ],
  exports: [ ConfirmEqualValidatorDirective ]
} )
export class DirectiveModule {
}
