import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmEqualValidatorDirective } from './confirm-equal-validator.directive';
import { AccessRightsDirective } from './access-rights.directive';
import { OneRequiredDirective } from './one-required.directive';
import { DownloadFileDirective } from './download-file.directive';

@NgModule( {
  imports: [
    CommonModule
  ],
  declarations: [
    ConfirmEqualValidatorDirective,
    AccessRightsDirective,
    OneRequiredDirective,
    DownloadFileDirective,
  ],
  exports: [
    ConfirmEqualValidatorDirective,
    AccessRightsDirective,
    OneRequiredDirective,
    DownloadFileDirective,
  ]
} )
export class DirectivesModule {
}
