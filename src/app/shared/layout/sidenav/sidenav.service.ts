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
        icon: 'person',
        link: [
          { url: '/crm/adduser', title: 'Добавить пользователя' },
          { url: '/crm/listusers', title: 'Список пользователей' }
        ]
      },
      {
        name: 'Пассажиры',
        icon: 'airline_seat_recline_extra',
        link: [
          { url: '/crm/profilesearch', title: 'Поиск пассажира' },
          { url: '/crm/addprofile', title: 'Добавить пассажира' }
        ]
      },
      {
        name: 'Сегментация',
        icon: 'group',
        link: [
          { url: '/crm/addsegmentation', title: 'Создать' },
        ]
      },
      {
        name: 'Настройки',
        icon: 'settings',
        link: [
          { url: '/crm/form-table-async-profile-settings', title: 'Таблицы пассажиров' },
          { url: '/crm/restart', title: 'Перезагрузка' },
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
