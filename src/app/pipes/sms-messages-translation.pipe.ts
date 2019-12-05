import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'smsMessagesTranslation'
})
export class SmsMessagesTranslationPipe implements PipeTransform {

  transform(value: string | number): string {
    enum SmsStatusMessages {
      None,
      NotSent,
      Error,
      SendCustomer,
    }

    switch ( value ) {
      case SmsStatusMessages.NotSent: return 'PAGE.DISTRIBUTION.PROFILE_SMS_DISTRIBUTION.TABLE.STATUSES.NOT_SENT';
      case SmsStatusMessages.SendCustomer: return 'PAGE.DISTRIBUTION.PROFILE_SMS_DISTRIBUTION.TABLE.STATUSES.SEND_CUSTOMER';
      case SmsStatusMessages.Error: return 'PAGE.DISTRIBUTION.PROFILE_SMS_DISTRIBUTION.TABLE.STATUSES.ERROR';
    }
  }
}
