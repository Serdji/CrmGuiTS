import { FormControl } from '@angular/forms';

export const complexPasswordValidator = ( formControl: FormControl ): { [ key: string ]: { [ key: string ]: string } } | null => {
  if ( formControl.value === '' || formControl.value === null ) return null;
  const re = /(?=.*[0-9])(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z])/g;
  const approved = re.test( formControl.value );
  const messSymbolError = 'Пароль должен содержать символы: [0-9], [a-z], [A-Z], [!@#$%^&*]';
  return approved ? null : { complexPasswordValidator: { message: messSymbolError } };
};