import { Directive, Input } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, Validator } from '@angular/forms';

@Directive( {
  selector: '[appOneRequired]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: OneRequiredDirective,
      multi: true
    }
  ]
} )


export class OneRequiredDirective implements Validator {
  @Input() appOneRequired: boolean;
  validate( control: AbstractControl ): { [ key: string ]: any } | null {
    if ( this.appOneRequired ) {
      return { 'notEqual': true };
    }
    return null;
  }


}
