import { Pipe, PipeTransform } from '@angular/core';
import construct = Reflect.construct;

@Pipe({
  name: 'fieldTranslation'
})
export class FieldTranslationPipe implements PipeTransform {


  transform(value: string | number): string {

    enum EmailStatusDistribution {
      None,
      Created,
      Active,
      SendingFinished,
      Completed,
      Cancelled,
      Finished,
      Error,
    }

    enum SmsStatusDistribution {
      None,
      Created,
      Active,
      SendingFinished,
      Cancelled,
      Error,
    }

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

    enum SmsStatusMessages {
      None,
      NotSent,
      Error,
      SendCustomer,
    }



    switch ( value ) {
      case  'firstName': return 'PAGE.PROFILES.SEARCH_PROFILE.TABLE.FIRST_NAME';
      case  'lastName': return 'PAGE.PROFILES.SEARCH_PROFILE.TABLE.LAST_NAME';
      case  'secondName': return 'PAGE.PROFILES.SEARCH_PROFILE.TABLE.MIDDLE_NAME';
      case  'prefix': return 'Префикс';
      case  'gender': return 'PAGE.PROFILES.SEARCH_PROFILE.TABLE.GENDER';
      case  'dob': return 'PAGE.PROFILES.SEARCH_PROFILE.TABLE.DATE_OF_BIRTH';
      case  'customerIds': return 'PAGE.PROFILES.SEARCH_PROFILE.TABLE.PROFILE';
      case  'Active': return 'PAGE.PROFILES.TABS_PROFILE.ORDER.EXPANSION.PANEL_HEADER.STATUS.ACTIVE';
      case  'Cancelled': return 'PAGE.PROFILES.TABS_PROFILE.ORDER.EXPANSION.PANEL_HEADER.STATUS.CANCELLED';
      case  'Amount': return 'PAGE.PROMOTIONS.ADD_PROMOTIONS_CODE.FIELD.PROMOTIONS_CODE_VAL.AMOUNT';
      case  'Percent': return 'PAGE.PROMOTIONS.ADD_PROMOTIONS_CODE.FIELD.PROMOTIONS_CODE_VAL.PERCENT';
      case  'm': return 'PAGE.PROFILES.SEARCH_PROFILE.FORM.GENDER.M';
      case  'f': return 'PAGE.PROFILES.SEARCH_PROFILE.FORM.GENDER.F';
      case  'M': return 'PAGE.PROFILES.SEARCH_PROFILE.FORM.GENDER.M';
      case  'F': return 'PAGE.PROFILES.SEARCH_PROFILE.FORM.GENDER.F';

      // -------------------------------------------------Email статуы рассылки-----------------------------------------------
      case EmailStatusDistribution.Created: return 'PAGE.DISTRIBUTION.LIST_DISTRIBUTION.TABLE.EMAIL_STATUSES.CREATED';
      case EmailStatusDistribution.Active: return 'PAGE.DISTRIBUTION.LIST_DISTRIBUTION.TABLE.EMAIL_STATUSES.ACTIVE';
      case EmailStatusDistribution.SendingFinished: return 'PAGE.DISTRIBUTION.LIST_DISTRIBUTION.TABLE.EMAIL_STATUSES.SENDING_FINISHED';
      case EmailStatusDistribution.Completed: return 'PAGE.DISTRIBUTION.LIST_DISTRIBUTION.TABLE.EMAIL_STATUSES.COMPLETED';
      case EmailStatusDistribution.Cancelled: return 'PAGE.DISTRIBUTION.LIST_DISTRIBUTION.TABLE.EMAIL_STATUSES.CANCELLED';
      case EmailStatusDistribution.Finished: return 'PAGE.DISTRIBUTION.LIST_DISTRIBUTION.TABLE.EMAIL_STATUSES.FINISHED';
      case EmailStatusDistribution.Error: return 'PAGE.DISTRIBUTION.LIST_DISTRIBUTION.TABLE.EMAIL_STATUSES.ERROR';

      // -------------------------------------------------SMS статуы рассылки-------------------------------------------------
      case SmsStatusDistribution.Created: return 'PAGE.DISTRIBUTION.LIST_DISTRIBUTION.TABLE.EMAIL_STATUSES.CREATED';
      case SmsStatusDistribution.Active: return 'PAGE.DISTRIBUTION.LIST_DISTRIBUTION.TABLE.EMAIL_STATUSES.ACTIVE';
      case SmsStatusDistribution.SendingFinished: return 'PAGE.DISTRIBUTION.LIST_DISTRIBUTION.TABLE.EMAIL_STATUSES.SENDING_FINISHED';
      case SmsStatusDistribution.Cancelled: return 'PAGE.DISTRIBUTION.LIST_DISTRIBUTION.TABLE.EMAIL_STATUSES.CANCELLED';
      case SmsStatusDistribution.Error: return 'PAGE.DISTRIBUTION.LIST_DISTRIBUTION.TABLE.EMAIL_STATUSES.ERROR';

      // -------------------------------------------------Email статуы сообщения-----------------------------------------------
      case EmailStatusMessages.NotSent: return 'PAGE.DISTRIBUTION.PROFILE_EMAIL_DISTRIBUTION.TABLE.STATUSES.NOT_SENT';
      case EmailStatusMessages.SentGateway: return 'PAGE.DISTRIBUTION.PROFILE_EMAIL_DISTRIBUTION.TABLE.STATUSES.SENT_GATEWAY';
      case EmailStatusMessages.SendCustomer: return 'PAGE.DISTRIBUTION.PROFILE_EMAIL_DISTRIBUTION.TABLE.STATUSES.SEND_CUSTOMER';
      case EmailStatusMessages.Delivered: return 'PAGE.DISTRIBUTION.PROFILE_EMAIL_DISTRIBUTION.TABLE.STATUSES.DELIVERED';
      case EmailStatusMessages.Read: return 'PAGE.DISTRIBUTION.PROFILE_EMAIL_DISTRIBUTION.TABLE.STATUSES.READ';
      case EmailStatusMessages.ClickedLink: return 'PAGE.DISTRIBUTION.PROFILE_EMAIL_DISTRIBUTION.TABLE.STATUSES.CLICKED_LINK';
      case EmailStatusMessages.Bounced: return 'PAGE.DISTRIBUTION.PROFILE_EMAIL_DISTRIBUTION.TABLE.STATUSES.BOUNCED';
      case EmailStatusMessages.Unsubscribed: return 'PAGE.DISTRIBUTION.PROFILE_EMAIL_DISTRIBUTION.TABLE.STATUSES.UNSUBSCRIBED';
      case EmailStatusMessages.Error: return 'PAGE.DISTRIBUTION.PROFILE_EMAIL_DISTRIBUTION.TABLE.STATUSES.ERROR';

      // -------------------------------------------------SMS статуы сообщения-----------------------------------------------
      case SmsStatusMessages.NotSent: return 'PAGE.DISTRIBUTION.PROFILE_SMS_DISTRIBUTION.TABLE.STATUSES.NOT_SENT';
      case SmsStatusMessages.SendCustomer: return 'PAGE.DISTRIBUTION.PROFILE_SMS_DISTRIBUTION.TABLE.STATUSES.SEND_CUSTOMER';
      case SmsStatusMessages.Error: return 'PAGE.DISTRIBUTION.PROFILE_SMS_DISTRIBUTION.TABLE.STATUSES.ERROR';
    }
  }
}
