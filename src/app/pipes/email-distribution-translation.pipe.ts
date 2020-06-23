import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'emailDistributionTranslation'
})
export class EmailDistributionTranslationPipe implements PipeTransform {

  transform(value: string | number): string {
    enum EmailStatusDistribution {
      None,
      Created,
      Active,
      SendingFinished,
      Cancelled,
      Completed,
      Finished,
      Error,
    }

    switch ( value ) {
      case EmailStatusDistribution.Created: return 'PAGE.DISTRIBUTION.LIST_DISTRIBUTION.TABLE.EMAIL_STATUSES.CREATED';
      case EmailStatusDistribution.Active: return 'PAGE.DISTRIBUTION.LIST_DISTRIBUTION.TABLE.EMAIL_STATUSES.ACTIVE';
      case EmailStatusDistribution.SendingFinished: return 'PAGE.DISTRIBUTION.LIST_DISTRIBUTION.TABLE.EMAIL_STATUSES.SENDING_FINISHED';
      case EmailStatusDistribution.Cancelled: return 'PAGE.DISTRIBUTION.LIST_DISTRIBUTION.TABLE.EMAIL_STATUSES.CANCELLED';
      case EmailStatusDistribution.Completed: return 'PAGE.DISTRIBUTION.LIST_DISTRIBUTION.TABLE.EMAIL_STATUSES.COMPLETED';
      case EmailStatusDistribution.Finished: return 'PAGE.DISTRIBUTION.LIST_DISTRIBUTION.TABLE.EMAIL_STATUSES.FINISHED';
      case EmailStatusDistribution.Error: return 'PAGE.DISTRIBUTION.LIST_DISTRIBUTION.TABLE.EMAIL_STATUSES.ERROR';

    }
  }
}
