import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
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
  private currentUrl: string;
  private breadcrumbs: IMenuLink[] = [];
  private menuLink: IMenuLink[];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
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

  private initBreadcrumbs( currentUrl: string ) {
    if ( _.size( _.chain( currentUrl ).split( '/' ).value() ) === 4 ) {
      _.each( this.menuLink, link => {
        if ( link.url === _.chain( currentUrl ).split( '/' ).take( 3 ).join( '/' ).value() ) {
          this.breadcrumbs = _.take( this.breadcrumbs, 3 );
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
              url: currentUrl,
              title: link.title,
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

    this.breadcrumbs = _.chain( this.breadcrumbs )
      .reverse()
      .uniqBy( 'title' )
      .reverse()
      .value();
    localStorage.setItem( 'breadcrumbs', JSON.stringify( this.breadcrumbs ) );
  }

  private getBreadcrumbs() {
    this.router.events
      .pipe(
        takeWhile( _ => this.isActive ),
        filter( event => event instanceof NavigationEnd )
      )
      .subscribe( ( event: NavigationEnd ) => {
        this.currentUrl = '';
        this.currentUrl = event.url;
        this.initBreadcrumbs( this.currentUrl );
      } );
    this.route.queryParams
      .pipe( takeWhile( _ => this.isActive ) )
      .subscribe( _ => {
        this.currentUrl = '';
        this.currentUrl = this.router.url;
        this.initBreadcrumbs( this.currentUrl );
      } );
  }

  ngOnDestroy(): void {
    this.isActive = false;
  }

}
