import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  constructor() { }

  getDefaultFieldTableAsyncProfiledTable(params: string  = 'arr'): any {
    const defaultObj = {};
    const defaultArr = [
        'firstName',
        'lastName',
        'middleName',
        'prefix',
        'gender',
        'dob',
      ];
    for ( const key of defaultArr ) {
      defaultObj[key] = '';
    }
    switch ( params ) {
      case 'arr': return defaultArr;
      case 'obj': return defaultObj;
    }
  }
}
