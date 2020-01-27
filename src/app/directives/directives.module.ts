import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmEqualValidatorDirective } from './confirm-equal-validator.directive';
import { AccessRightsDirective } from './access-rights.directive';
import { OneRequiredDirective } from './one-required.directive';
import { NumbersOnlyDirective } from './numbers-only.directive';

@NgModule( {
  imports: [
    CommonModule
  ],
  declarations: [
    ConfirmEqualValidatorDirective,
    AccessRightsDirective,
    OneRequiredDirective,
    NumbersOnlyDirective,
  ],
  exports: [
    ConfirmEqualValidatorDirective,
    AccessRightsDirective,
    OneRequiredDirective,
    NumbersOnlyDirective,
  ]
} )
export class DirectivesModule {
}
