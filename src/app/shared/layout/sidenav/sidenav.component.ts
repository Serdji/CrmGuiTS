import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivityUserService } from '../../../services/activity-user.service';
import { timer } from 'rxjs/observable/timer';
import { IMenuLink } from '../../../interface/imenu-link';
import { MatSidenav } from '@angular/material/sidenav';
import { LayoutService } from '../layout.service';
import { Router } from '@angular/router';
import { SidenavService } from './sidenav.service';
import { takeWhile } from 'rxjs/operators';

@Component( {
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: [ './sidenav.component.styl' ]
} )
export class SidenavComponent implements OnInit, OnDestroy {

  @ViewChild( 'sidenav' ) sidenav: MatSidenav;
  @ViewChild( 'accord' ) accord;

  public menu: IMenuLink[];

  private isActive: boolean;

  constructor(
    private activityUser: ActivityUserService,
    private layoutService: LayoutService,
    private router: Router,
    private sidenavService: SidenavService,
  ) { }

  ngOnInit(): void {
    this.isActive = true;
    this.activityUser.idleLogout();
    this.autoOpenAccord();
    this.autoOpenSidena();
    this.menu = this.sidenavService.menu;
    this.layoutService.subjectToggle.pipe( takeWhile( _ => this.isActive ) ).subscribe( _ => this.sidenav.toggle() );
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
