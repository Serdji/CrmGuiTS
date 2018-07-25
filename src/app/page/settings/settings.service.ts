import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  constructor() { }

  get defaultFieldTableAsyncProfiledTable(): string[] {
    return [
      'firstName',
      'lastName',
      'middleName',
      'prefix',
      'gender',
      'dob',
    ];
  }
}
