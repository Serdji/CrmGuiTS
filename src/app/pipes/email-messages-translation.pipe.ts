import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'emailMessagesTranslation'
})
export class EmailMessagesTranslationPipe implements PipeTransform {

  transform( value: string | number ): string {


    enum SmsStatusDistribution {
      None,
      Created,
      Active,
      SendingFinished,
      Cancelled,
      Error,
    }


    switch ( value ) {
      case SmsStatusDistribution.Created: return 'PAGE.DISTRIBUTION.LIST_DISTRIBUTION.TABLE.EMAIL_STATUSES.CREATED';
      case SmsStatusDistribution.Active: return 'PAGE.DISTRIBUTION.LIST_DISTRIBUTION.TABLE.EMAIL_STATUSES.ACTIVE';
      case SmsStatusDistribution.SendingFinished: return 'PAGE.DISTRIBUTION.LIST_DISTRIBUTION.TABLE.EMAIL_STATUSES.SENDING_FINISHED';
      case SmsStatusDistribution.Cancelled: return 'PAGE.DISTRIBUTION.LIST_DISTRIBUTION.TABLE.EMAIL_STATUSES.CANCELLED';
      case SmsStatusDistribution.Error: return 'PAGE.DISTRIBUTION.LIST_DISTRIBUTION.TABLE.EMAIL_STATUSES.ERROR';
    }
  }
}
