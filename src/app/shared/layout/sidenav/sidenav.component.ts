import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivityUserService } from '../../../services/activity-user.service';
import { timer } from 'rxjs/observable/timer';
import { IMenuLink } from '../../../interface/imenu-link';
import { MatSidenav } from '@angular/material/sidenav';
import { LayoutService } from '../layout.service';
import { Router } from '@angular/router';
import { SidenavService } from './sidenav.service';

@Component( {
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: [ './sidenav.component.styl' ]
} )
export class SidenavComponent implements OnInit {

  @ViewChild( 'sidenav' ) sidenav: MatSidenav;
  @ViewChild( 'accord' ) accord;

  public menu: IMenuLink[];

  constructor(
    private activityUser: ActivityUserService,
    private layoutService: LayoutService,
    private router: Router,
    private sidenavService: SidenavService,
  ) { }

  ngOnInit(): void {
    this.activityUser.idleLogout();
    this.autoOpenAccord();
    this.autoOpenSidena();
    this.menu = this.sidenavService.menu;
    this.layoutService.subjectToggle.subscribe( _ => this.sidenav.toggle() );
  }

  private autoOpenSidena() {
    this.open = true;
    this.sidenavService.subjectClosesAccord.subscribe( _ => {
      timer( 0 ).subscribe( _ => this.sidenav.close() );
    } );
    this.sidenavService.subjectOpenAccord.subscribe( _ => {
      this.autoOpenAccord();
      timer( 0 ).subscribe( _ => this.sidenav.open() );
    } );
    timer( 0 ).subscribe( _ => this.sidenav.open() );
  }

  private autoOpenAccord() {
    timer( 0 ).subscribe( _ => {
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
}
