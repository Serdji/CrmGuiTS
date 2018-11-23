import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter, takeWhile } from 'rxjs/operators';
import * as _ from 'lodash';
import { SidenavService } from '../layout/sidenav/sidenav.service';
import { IMenuLink } from '../../interface/imenu-link';

@Component( {
  selector: 'app-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styleUrls: [ './breadcrumbs.component.styl' ]
} )
export class BreadcrumbsComponent implements OnInit, OnDestroy {

  private isActive: boolean;
  private currentUrlArr: string[] = [];
  private breadcrumbs: any[] = [];
  private menuLink: IMenuLink[];

  constructor(
    private router: Router,
    private sidenavService: SidenavService
  ) { }

  ngOnInit(): void {
    this.isActive = true;
    this.menuLink = this.sidenavService.menuLink;
    this.setMenuLink();
    this.initCurrentUrl();
    this.getBreadcrumbs();
  }

  private setMenuLink() {
    _( this.menuLink )
      .push( { url: '/crm/entrance', title: 'Главная' } )
      .push( { url: '/crm/profile-distribution', title: 'Рассылка' } )
      .push( { url: '/crm/profile', title: 'Профиль' } )
      .push( { url: '/crm/user', title: 'Пользователь' } )
      .value();
  }

  private initCurrentUrl() {
    if ( JSON.parse( localStorage.getItem( 'breadcrumbs' ) ) ) {
      this.breadcrumbs = JSON.parse( localStorage.getItem( 'breadcrumbs' ) );
    }
  }

  private initBreadcrumbs( currentUrlArr: string[] ) {
    _.each( currentUrlArr, currentUrl => {
      if ( _.size( _.chain( currentUrl ).split( '/' ).value() ) === 4 ) {
        _.each( this.menuLink, link => {
          if ( link.url === _.chain( currentUrl ).split( '/' ).take( 3 ).join( '/' ).value() ) {
            this.breadcrumbs = _.take( this.breadcrumbs, 2 );
            this.breadcrumbs.push(
              {
                url: currentUrl,
                title: link.title,
              }
            );
          }
        } );
      } else if ( _.size( _.chain( currentUrl ).split( '?' ).value() ) === 2 ) {
        _.each( this.menuLink, link => {
          if ( link.url === _.chain( currentUrl ).split( '?' ).take( 1 ).join( '/' ).value() ) {
            this.breadcrumbs = _.take( this.breadcrumbs, 1 );
            this.breadcrumbs.push(
              {
                url: _.chain( currentUrl ).split( '?' ).head().value(),
                title: link.title,
                queryParams: _.chain( currentUrl ).split( '?' ).last().value()
              }
            );
          }
        } );
      } else {
        _.each( this.menuLink, link => {
          if ( link.url === currentUrl ) {
            this.breadcrumbs = _.take( this.breadcrumbs, 1 );
            this.breadcrumbs.push(
              {
                url: currentUrl,
                title: link.title
              }
            );
          }
        } );
      }
    } );
    console.log( this.breadcrumbs );
    localStorage.setItem( 'breadcrumbs', JSON.stringify( this.breadcrumbs ) );
  }

  private getBreadcrumbs() {
    this.router.events.pipe(
      takeWhile( _ => this.isActive ),
      filter( event => event instanceof NavigationEnd )
    ).subscribe( ( event: NavigationEnd ) => {
      this.currentUrlArr.push( event.url );
      this.initBreadcrumbs( this.currentUrlArr );
    } );
  }

  private urlSplit( url: string ): string {
    return _.chain( url )
      .split( '/' )
      .take( 3 )
      .join( '/' )
      .split( '?' )
      .head()
      .value();
  }

  ngOnDestroy(): void {
    this.isActive = false;
  }

}
