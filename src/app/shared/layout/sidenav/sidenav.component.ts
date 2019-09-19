import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivityUserService } from '../../../services/activity-user.service';
import { timer } from 'rxjs/observable/timer';
import { IMenu } from '../../../interface/imenu';
import { MatSidenav } from '@angular/material/sidenav';
import { LayoutService } from '../layout.service';
import {  NavigationEnd, NavigationStart, Router } from '@angular/router';
import { SidenavService } from './sidenav.service';
import { takeWhile } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';

@Component( {
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: [ './sidenav.component.styl' ]
} )
export class SidenavComponent implements OnInit, OnDestroy {

  @ViewChild('sidenav', { static: true }) sidenav: MatSidenav;
  @ViewChild('accord', { static: true }) accord;

  public menu: IMenu[];
  public version: string;
  public AirlineCode: string;
  public loader: boolean;

  private isActive: boolean;

  constructor(
    private activityUser: ActivityUserService,
    private layoutService: LayoutService,
    private router: Router,
    private sidenavService: SidenavService,
    private translate: TranslateService,
  ) { }

  ngOnInit(): void {
    this.isActive = true;
    this.activityUser.idleLogout();
    this.autoOpenAccord();
    this.autoOpenSidena();
    this.louder();
    this.loader = false;
    this.menu = this.sidenavService.menu;
    this.layoutService.subjectToggle.pipe( takeWhile( _ => this.isActive ) ).subscribe( _ => this.sidenav.toggle() );
    this.sidenavService.getVersion().pipe( takeWhile( _ => this.isActive ) ).subscribe( value => this.version = `2.0.0.${value}` );
    this.AirlineCode = localStorage.getItem( 'AirlineCode' );
  }

  setLanguage(languageCode: string) {
    // устанавливаем выбранный язык
    this.translate.use(languageCode);
  }

  private louder() {
    this.router.events
      .pipe(
        takeWhile( _ => this.isActive ),
      )
      .subscribe( ( event ) => {
        if ( event instanceof NavigationStart ) this.loader = true;
        if ( event instanceof NavigationEnd ) this.loader = false;
      } );
  }

  private autoOpenSidena() {
    this.sidenavService.subjectClosesAccord.pipe( takeWhile( _ => this.isActive ) ).subscribe( _ => {
      timer( 0 ).pipe( takeWhile( _ => this.isActive ) ).subscribe( _ => this.sidenav.close() );
    } );
    this.sidenavService.subjectOpenAccord.pipe( takeWhile( _ => this.isActive ) ).subscribe( _ => {
      this.autoOpenAccord();
      timer( 0 ).pipe( takeWhile( _ => this.isActive ) ).subscribe( _ => this.sidenav.open() );
    } );
    timer( 0 ).pipe( takeWhile( _ => this.isActive ) ).subscribe( _ => this.sidenav.open() );
  }

  private autoOpenAccord() {
    timer( 0 ).pipe( takeWhile( _ => this.isActive ) ).subscribe( _ => {
      const aElement = this.accord.nativeElement.querySelectorAll( 'a' );
      const href = '#' + this.router.url.split( '?' )[ 0 ];
      for ( const a of aElement ) {
        if ( a.hash === href ) {
          const matExpPanel = a.closest( 'mat-expansion-panel' );
          const matExpPanelHeader = matExpPanel.querySelector( 'mat-expansion-panel-header' );
          matExpPanelHeader.click();
        }
      }
    } );
  }

  ngOnDestroy(): void {
    this.isActive = false;
  }

}
