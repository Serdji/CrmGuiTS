import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmEqualValidatorDirective } from './confirm-equal-validator.directive';
import { AccessRightsDirective } from './access-rights.directive';

@NgModule( {
  imports: [
    CommonModule
  ],
  declarations: [
    ConfirmEqualValidatorDirective,
    AccessRightsDirective,
  ],
  exports: [
    ConfirmEqualValidatorDirective,
    AccessRightsDirective,
  ]
} )
export class DirectivesModule {
}
