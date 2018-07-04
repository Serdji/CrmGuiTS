import {FormControl} from '@angular/forms';

export function emailValidator(formControl: FormControl) {
  if (formControl.value === '') return null;
  const re =  /^([a-z0-9_\.-]+)@([a-z0-9_\.-]+)\.([a-z\.]{2,6})$/;
  if (re.test(formControl.value)) {
    return null;
  }
  return { emailValidator: {message: 'Некорректный email'} };
}
