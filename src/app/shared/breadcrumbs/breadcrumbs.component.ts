import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter, takeWhile } from 'rxjs/operators';
import * as _ from 'lodash';
import { SidenavService } from '../layout/sidenav/sidenav.service';
import { IMenuLink } from '../../interface/imenu-link';

import { untilDestroyed } from 'ngx-take-until-destroy';

@Component( {
  selector: 'app-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styleUrls: [ './breadcrumbs.component.styl' ]
} )
export class BreadcrumbsComponent implements OnInit, OnDestroy {

  public breadcrumbs: IMenuLink[] = [];


  private currentUrl: string;
  private menuLink: IMenuLink[];
  private counter: number;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private sidenavService: SidenavService
  ) { }

  ngOnInit(): void {

    this.menuLink = this.sidenavService.menuLink;
    this.counter = 0;
    this.setMenuLink();
    this.initCurrentUrl();
    this.getBreadcrumbs();
  }

  private setMenuLink() {
    _( this.menuLink )
      .push( { url: '/crm/entrance', title: 'BREADCRUMBS.HOME' } )
      .push( { url: '/crm/profile-email-distribution', title: 'BREADCRUMBS.EMAIL_DISTRIBUTION' } )
      .push( { url: '/crm/profile-sms-distribution', title: 'BREADCRUMBS.SMS_DISTRIBUTION' } )
      .push( { url: '/crm/profile', title: 'BREADCRUMBS.CUSTOMER' } )
      .push( { url: '/crm/user', title: 'BREADCRUMBS.USER' } )
      .push( { url: '/crm/event', title: 'BREADCRUMBS.EVENT' } )
      .push( { url: '/crm/edit-segmentation', title: 'BREADCRUMBS.EDIT_SEGMENTATION' } )
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
          // this.breadcrumbs = _.take( this.breadcrumbs, 3 );
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
          // this.breadcrumbs = _.take( this.breadcrumbs, 1 );
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
          // this.breadcrumbs = _.take( this.breadcrumbs, 1 );
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
      .takeRight(10)
      .value();
    localStorage.setItem( 'breadcrumbs', JSON.stringify( this.breadcrumbs ) );
  }

  private getBreadcrumbs() {
    this.router.events
      .pipe(
        untilDestroyed(this),
        filter( event => event instanceof NavigationEnd )
      )
      .subscribe( ( event: NavigationEnd ) => {
        this.currentUrl = '';
        this.currentUrl = event.url;
        this.initBreadcrumbs( this.currentUrl );
      } );
    this.route.queryParams
      .pipe( untilDestroyed(this) )
      .subscribe( _ => {
        this.currentUrl = '';
        this.currentUrl = this.router.url;
        this.initBreadcrumbs( this.currentUrl );
      } );
  }

  breadcrumbTake( title: string ): void {
    _.each( this.breadcrumbs, breadcrumbs => {
      this.counter++;
      if ( breadcrumbs.title === title ) {
        this.breadcrumbs = _.take( this.breadcrumbs, this.counter );
      }
    } );
    this.counter = 0;
  }

  ngOnDestroy(): void {}

}
