import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FieldTranslationPipe } from './field-translation.pipe';
import { SafeHtmlPipe } from './safe-html.pipe';
import { EmailDistributionTranslationPipe } from './email-distribution-translation.pipe';
import { SmsDistributionTranslationPipe } from './sms-distribution-translation.pipe';
import { EmailMessagesTranslationPipe } from './email-messages-translation.pipe';
import { SmsMessagesTranslationPipe } from './sms-messages-translation.pipe';

@NgModule( {
  imports: [
    CommonModule
  ],
  declarations: [
    FieldTranslationPipe,
    SafeHtmlPipe,
    EmailDistributionTranslationPipe,
    SmsDistributionTranslationPipe,
    EmailMessagesTranslationPipe,
    SmsMessagesTranslationPipe,
  ],
  exports: [
    FieldTranslationPipe,
    SafeHtmlPipe,
  ],
} )
export class PipesModule {
}
