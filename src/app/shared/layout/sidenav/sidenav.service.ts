import { Injectable } from '@angular/core';
import { IMenuLink } from '../../../interface/imenu-link';
import { Subject } from 'rxjs/Subject';

@Injectable( {
  providedIn: 'root'
} )
export class SidenavService {

  public subjectOpenAccord = new Subject();
  public subjectClosesAccord = new Subject();

  constructor() { }

  get menu(): IMenuLink[] {
    return [
      {
        name: 'Пользователи',
        icon: 'group',
        link: [
          { url: '/crm/adduser', title: 'Добавить пользователя' },
          { url: '/crm/listusers', title: 'Список пользователей' }
        ]
      },
      {
        name: 'Пассажиры',
        icon: 'airplanemode_active',
        link: [
          { url: '/crm/profilesearch', title: 'Поиск пассажира' }
        ]
      }
    ];
  }

  openAccord() {
    this.subjectOpenAccord.next();
  }

  closesAccord() {
    this.subjectClosesAccord.next();
  }

}
