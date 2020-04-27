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
        name: 'MENU.USERS.GROUP_NAME',
        icon: 'person',
        claims: 'users:read',
        link: [
          { url: '/crm/list-users', title: 'MENU.USERS.LIST_USERS' },
          { url: '/crm/add-user', title: 'MENU.USERS.ADD_USERS' }
        ]
      },
      {
        name: 'MENU.CUSTOMER.GROUP_NAME',
        icon: 'airline_seat_recline_extra',
        claims: 'customers:read',
        link: [
          { url: '/crm/profile-search', title: 'MENU.CUSTOMER.SEARCH_CUSTOMER' },
          { url: '/crm/add-profile', title: 'MENU.CUSTOMER.ADD_CUSTOMER' }
        ]
      },
      {
        name: 'MENU.SEGMENTATION.GROUP_NAME',
        icon: 'group',
        claims: 'analytics:read',
        link: [
          { url: '/crm/list-segmentation', title: 'MENU.SEGMENTATION.LIST_SEGMENTATION' },
          { url: '/crm/add-segmentation', title: 'MENU.SEGMENTATION.ADD_SEGMENTATION' },
          { url: '/crm/complex-segmentation', title: 'MENU.SEGMENTATION.AGGREGATION_SEGMENTATION' },
          { url: '/crm/add-custom-segmentation', title: 'MENU.SEGMENTATION.CUSTOM_SEGMENTATION' },
        ]
      },
      {
        name: 'MENU.GROUP_CUSTOMER.GROUP_NAME',
        icon: 'group_add',
        claims: 'analytics:read',
        link: [
          { url: '/crm/profile-group', title: 'MENU.GROUP_CUSTOMER.LIST_GROUP_CUSTOMER' },
        ]
      },
      {
        name: 'MENU.DISTRIBUTIONS.GROUP_NAME',
        icon: 'email',
        claims: 'distributions:read',
        link: [
          { url: '/crm/list-email', title: 'MENU.DISTRIBUTIONS.LIST_EMAIL' },
          { url: '/crm/list-sms', title: 'MENU.DISTRIBUTIONS.LIST_SMS' },
        ]
      },
      {
        name: 'MENU.PROMOTIONS_CODES.GROUP_NAME',
        icon: 'receipt',
        claims: 'promotions:read',
        link: [
          { url: '/crm/search-promotions-codes', title: 'MENU.PROMOTIONS_CODES.SEARCH_PROMOTIONS_CODES' },
          { url: '/crm/add-promotions-codes', title: 'MENU.PROMOTIONS_CODES.ADD_PROMOTIONS_CODES' },
          { url: '/crm/add-promotions', title: 'MENU.PROMOTIONS_CODES.ADD_PROMOTIONS' },
        ]
      },
      {
        name: 'MENU.REPORTS.GROUP_NAME',
        icon: 'graphic_eq',
        claims: 'reports:read',
        link: [
          { url: '/crm/statistics-report', title: 'MENU.REPORTS.LIST_REPORTS' },
        ]
      },
      {
        name: 'MENU.EVENT.GROUP_NAME',
        icon: 'event',
        claims: 'tasks:read',
        link: [
          { url: '/crm/list-event', title: 'MENU.EVENT.LIST_EVENT' },
          { url: '/crm/add-event', title: 'MENU.EVENT.ADD_EVENT' },
        ]
      },
      {
        name: 'MENU.SETTINGS.GROUP_NAME',
        icon: 'settings',
        link: [
          { url: '/crm/form-table-async-profile-settings', title: 'MENU.SETTINGS.TABLE_CUSTOMERS' },
          // { url: '/crm/index', title: 'MENU.SETTINGS.INDEX' },
          { url: '/crm/restart', title: 'MENU.SETTINGS.RESTART' },
        ]
      }
    ];


    this.parsTokenService.parsToken = this.token.accessToken;
    if ( this.parsTokenService.parsToken.Claims ) {
      const claims = this.parsTokenService.parsToken.Claims;
      _.each( menu, value => {
        if ( !_.includes( claims, value.claims ) ) menu = _.reject( menu, { claims: value.claims } );
      } );
    } else {
      menu = _.reject( menu,  'claims' );
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
