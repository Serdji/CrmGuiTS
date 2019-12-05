import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'emailMessagesTranslation'
})
export class EmailMessagesTranslationPipe implements PipeTransform {

  transform( value: string | number ): string {
    enum EmailStatusMessages {
      None,
      NotSent,
      SentGateway,
      SendCustomer,
      Delivered,
      Read,
      ClickedLink,
      Bounced,
      Unsubscribed,
      Error,
    }

    switch ( value ) {
      case EmailStatusMessages.NotSent: return 'PAGE.DISTRIBUTION.PROFILE_EMAIL_DISTRIBUTION.TABLE.STATUSES.NOT_SENT';
      case EmailStatusMessages.SentGateway: return 'PAGE.DISTRIBUTION.PROFILE_EMAIL_DISTRIBUTION.TABLE.STATUSES.SENT_GATEWAY';
      case EmailStatusMessages.SendCustomer: return 'PAGE.DISTRIBUTION.PROFILE_EMAIL_DISTRIBUTION.TABLE.STATUSES.SEND_CUSTOMER';
      case EmailStatusMessages.Delivered: return 'PAGE.DISTRIBUTION.PROFILE_EMAIL_DISTRIBUTION.TABLE.STATUSES.DELIVERED';
      case EmailStatusMessages.Read: return 'PAGE.DISTRIBUTION.PROFILE_EMAIL_DISTRIBUTION.TABLE.STATUSES.READ';
      case EmailStatusMessages.ClickedLink: return 'PAGE.DISTRIBUTION.PROFILE_EMAIL_DISTRIBUTION.TABLE.STATUSES.CLICKED_LINK';
      case EmailStatusMessages.Bounced: return 'PAGE.DISTRIBUTION.PROFILE_EMAIL_DISTRIBUTION.TABLE.STATUSES.BOUNCED';
      case EmailStatusMessages.Unsubscribed: return 'PAGE.DISTRIBUTION.PROFILE_EMAIL_DISTRIBUTION.TABLE.STATUSES.UNSUBSCRIBED';
      case EmailStatusMessages.Error: return 'PAGE.DISTRIBUTION.PROFILE_EMAIL_DISTRIBUTION.TABLE.STATUSES.ERROR';
    }

  }
}
