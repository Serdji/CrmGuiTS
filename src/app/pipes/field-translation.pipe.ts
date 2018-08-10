import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fieldTranslation'
})
export class FieldTranslationPipe implements PipeTransform {

  transform(value: string): string {
    switch ( value ) {
      case  'firstName': return 'Имя';
      case  'lastName': return 'Фамилия';
      case  'secondName': return 'Второе имя';
      case  'prefix': return 'Префикс';
      case  'gender': return 'Пол';
      case  'dob': return 'Дата';
      case  'm': return 'M';
      case  'f': return 'Ж';
    }
  }
}