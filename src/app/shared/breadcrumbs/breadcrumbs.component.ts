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
      .value();
  }

  private initCurrentUrl() {
    if ( JSON.parse( localStorage.getItem( 'currentUrlArr' ) ) ) {
      this.currentUrlArr = JSON.parse( localStorage.getItem( 'currentUrlArr' ) );
      this.initBreadcrumbs( this.currentUrlArr );
    }
  }

  private initBreadcrumbs( currentUrlArr: string[] ) {
    _.each( currentUrlArr, currentUrl => {
      console.log(currentUrl);
      this.breadcrumbs.push( _.find( this.menuLink, [ 'url', currentUrl ] ) );
    } );
    console.log( this.breadcrumbs );
  }

  private getBreadcrumbs() {
    this.router.events.pipe(
      takeWhile( _ => this.isActive ),
      filter( event => event instanceof NavigationEnd )
    ).subscribe( ( event: NavigationEnd ) => {
      this.breadcrumbs = [];
      this.currentUrlArr.push( event.url );
      this.currentUrlArr = _.uniq( this.currentUrlArr );
      localStorage.setItem( 'currentUrlArr', JSON.stringify( this.currentUrlArr ) );
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
