import { OwlDateTimeIntl } from 'ng-pick-datetime';
import { TranslateService } from '@ngx-translate/core';
import { Injectable } from '@angular/core';

export const FORMATS_DATE_TIME = {
  parseInput: 'DD.MM.YYYY | HH:mm',
  fullPickerInput: 'DD.MM.YYYY | HH:mm',
  datePickerInput: 'DD.MM.YYYY',
  timePickerInput: 'HH:mm',
  monthYearLabel: 'MMM YYYY',
  dateA11yLabel: 'LL',
  monthYearA11yLabel: 'MMMM YYYY',
};

@Injectable({
  providedIn: 'root'
})
export class DefaultIntl extends OwlDateTimeIntl {
  constructor( public translate: TranslateService ) {
    super();
    this.translate.stream( 'BUTTON' ).subscribe( ( BUTTON ) => {
      /** A label for the up second button (used by screen readers).  */
      this.upSecondLabel = 'Add a second';

        /** A label for the down second button (used by screen readers).  */
        this.downSecondLabel = 'Minus a second';

        /** A label for the up minute button (used by screen readers).  */
        this.upMinuteLabel = 'Add a minute';

        /** A label for the down minute button (used by screen readers).  */
        this.downMinuteLabel = 'Minus a minute';

        /** A label for the up hour button (used by screen readers).  */
        this.upHourLabel = 'Add a hour';

        /** A label for the down hour button (used by screen readers).  */
        this.downHourLabel = 'Minus a hour';

        /** A label for the previous month button (used by screen readers). */
        this.prevMonthLabel = 'Previous month';

        /** A label for the next month button (used by screen readers). */
        this.nextMonthLabel = 'Next month';

        /** A label for the previous year button (used by screen readers). */
        this.prevYearLabel = 'Previous year';

        /** A label for the next year button (used by screen readers). */
        this.nextYearLabel = 'Next year';

        /** A label for the previous multi-year button (used by screen readers). */
        this.prevMultiYearLabel = 'Previous 21 years';

        /** A label for the next multi-year button (used by screen readers). */
        this.nextMultiYearLabel = 'Next 21 years';

        /** A label for the 'switch to month view' button (used by screen readers). */
        this.switchToMonthViewLabel = 'Change to month view';

        /** A label for the 'switch to year view' button (used by screen readers). */
        this.switchToMultiYearViewLabel = 'Choose month and year';

        /** A label for the cancel button */
        this.cancelBtnLabel = BUTTON.CANCEL;

        /** A label for the set button */
        this.setBtnLabel = BUTTON.ADD;

        /** A label for the range 'from' in picker info */
        this.rangeFromLabel = 'From';

        /** A label for the range 'to' in picker info */
        this.rangeToLabel = 'To';

        /** A label for the hour12 button (AM) */
        this.hour12AMLabel = 'AM';

        /** A label for the hour12 button (PM) */
        this.hour12PMLabel = 'PM';
    });
  }
}
