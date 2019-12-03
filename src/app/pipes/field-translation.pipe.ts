import { Pipe, PipeTransform } from '@angular/core';
import construct = Reflect.construct;

@Pipe({
  name: 'fieldTranslation'
})
export class FieldTranslationPipe implements PipeTransform {


  transform(value: string): string {

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
    }
  }
}
