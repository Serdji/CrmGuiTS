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
      case  'm': return 'M';
      case  'f': return 'Ж';
      case  'M': return 'M';
      case  'F': return 'Ж';
    }
  }
}