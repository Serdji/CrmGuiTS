import { FormControl } from '@angular/forms';

export const complexPasswordValidator = ( formControl: FormControl ): { [ key: string ]: { [ key: string ]: string } } | null => {
  if ( formControl.value === '' || formControl.value === null ) return null;
  const re = /(?=.*[0-9])(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z])/g;
  const approved = re.test( formControl.value );
  const messSymbolError = 'Пароль должен содержать символы: [a-z], [A-Z], [!@#$%^&*] и цифры [0-9]';
  return approved ? null : { complexPasswordValidator: { message: messSymbolError } };
};