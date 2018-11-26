import { Injectable } from '@angular/core';
import { IMenu } from '../../../interface/imenu';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ParsTokenService } from '../../../services/pars-token.service';
import { Itoken } from '../../../interface/itoken';
import * as _ from 'lodash';
import { IMenuLink } from '../../../interface/imenu-link';

@Injectable( {
  providedIn: 'root'
} )
export class SidenavService {

  public subjectOpenAccord = new Subject();
  public subjectClosesAccord = new Subject();

  private token: Itoken = JSON.parse( localStorage.getItem( 'paramsToken' ) );

  constructor(
    private http: HttpClient,
    private parsTokenService: ParsTokenService
  ) { }

  get menu(): IMenu[] {

    let menu = [
      {
        name: 'Пользователи',
        icon: 'person',
        claims: 'users:read',
        link: [
          { url: '/crm/listusers', title: 'Список пользователей' },
          { url: '/crm/adduser', title: 'Добавить пользователя' }
        ]
      },
      {
        name: 'Пассажиры',
        icon: 'airline_seat_recline_extra',
        claims: 'customers:read',
        link: [
          { url: '/crm/profilesearch', title: 'Поиск пассажира' },
          { url: '/crm/addprofile', title: 'Добавить пассажира' }
        ]
      },
      {
        name: 'Сегментация',
        icon: 'group',
        claims: 'analytics:read',
        link: [
          { url: '/crm/listsegmentation', title: 'Список сегментаций' },
          { url: '/crm/addsegmentation', title: 'Добавить сегментацию' }
        ]
      },
      {
        name: 'Группы пассажиров',
        icon: 'group_add',
        claims: 'analytics:read',
        link: [
          { url: '/crm/profilegroup', title: 'Список групп' },
        ]
      },
      {
        name: 'Рассылки',
        icon: 'email',
        claims: 'distributions:read',
        link: [
          { url: '/crm/list-distribution', title: 'Список рассылок' },
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


    this.parsTokenService.parsToken = this.token.accessToken;
    if ( this.parsTokenService.parsToken.Claims ) {
      const claims = this.parsTokenService.parsToken.Claims;
      _.each( menu, value => {
        if ( !_.includes( claims, value.claims ) ) menu = _.reject( menu, { claims: value.claims } );
      } );
    }

    return menu;
  }

  get menuLink(): IMenuLink[] {
    const menuLink = [];

    _.each( this.menu, menu => {
      _.each( menu.link, link => menuLink.push( link ) );
    } );
    return menuLink;
  }

  getVersion(): Observable<string> {
    return this.http.get( 'assets/version.txt', { responseType: 'text' } );
  }

  openAccord() {
    this.subjectOpenAccord.next();
  }

  closesAccord() {
    this.subjectClosesAccord.next();
  }

}
