import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fieldTranslation'
})
export class FieldTranslationPipe implements PipeTransform {

  transform(value: string): string {
    switch ( value ) {
      case  'firstName': return 'Имя';
      case  'lastName': return 'Фамилия';
      case  'secondName': return 'Отчество';
      case  'prefix': return 'Префикс';
      case  'gender': return 'Пол';
      case  'dob': return 'Дата рождения';
      case  'customerIds': return '№ профиля';
      case  'Active': return 'Оформлен';
      case  'Cancelled': return 'Аннулирован';
      case  'Amount': return 'Сумма';
      case  'Percent': return 'Процент';
      case  'm': return 'PAGE.PROFILES.SEARCH_PROFILE.FORM.GENDER.M';
      case  'f': return 'PAGE.PROFILES.SEARCH_PROFILE.FORM.GENDER.F';
      case  'M': return 'PAGE.PROFILES.SEARCH_PROFILE.FORM.GENDER.M';
      case  'F': return 'PAGE.PROFILES.SEARCH_PROFILE.FORM.GENDER.F';
    }
  }
}