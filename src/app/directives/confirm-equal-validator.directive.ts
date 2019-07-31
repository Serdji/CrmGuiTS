import { Validator, AbstractControl, NG_VALIDATORS } from '@angular/forms';
import { Directive, Input } from '@angular/core';

@Directive( {
  selector: '[appConfirmEqualValidator]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: ConfirmEqualValidatorDirective,
      multi: true
    }
  ]
} )
export class ConfirmEqualValidatorDirective implements Validator {
  @Input() appConfirmEqualValidator: string;

  validate( control: AbstractControl ): { [ key: string ]: { [ key: string ]: string } } | null {
    const controlToCompare = control.parent.get( this.appConfirmEqualValidator );
    const isError = controlToCompare && controlToCompare.value !== control.value;
    return isError ? { ConfirmPassword: { mesConfirmPassword: 'Пароль не совпал' } } : null;
  }
}

