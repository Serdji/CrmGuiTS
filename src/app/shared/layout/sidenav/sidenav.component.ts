import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivityUserService } from '../../../services/activity-user.service';
import { timer } from 'rxjs/observable/timer';
import { IMenuLink } from '../../../interface/imenu-link';
import { MatSidenav } from '@angular/material/sidenav';
import { LayoutService } from '../layout.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.styl']
})
export class SidenavComponent implements OnInit {

  @ViewChild( 'sidenav' ) sidenav: MatSidenav;
  @ViewChild( 'accord' ) accord: nativeElement;

  public menu: IMenuLink[] = [
    {
      name: 'Пользователи',
      icon: 'group',
      link: [
        { url: '/crm/users', title: 'Добавить пользователя' },
        { url: '/crm/usersearch', title: 'Поиск пользователей' },
        { url: '/crm/company', title: 'Настройки' }
      ]
    },
    {
      name: 'Пассажиры',
      icon: 'airplanemode_active',
      link: [
        { url: '/crm/profilesearch', title: 'Поиск пассажира' }
      ]
    }
  ];

  constructor(
    private activityUser: ActivityUserService,
    private layoutService: LayoutService,
    private router: Router,
    ) { }

  ngOnInit(): void {
    this.timeoutCloseNav();
    this.activityUser.idleLogout();
    this.autoOpenAccord();
    this.layoutService.subjectToggle.subscribe( _ => this.sidenav.toggle() );
  }

  private autoOpenAccord() {
    timer(0).subscribe( _ => {
      const aElement = this.accord.nativeElement.querySelectorAll('a');
      const href = '#' + this.router.url;
      for ( const a of aElement ) {
        if ( a.hash === href ) {
          const matExpPanel = a.closest('mat-expansion-panel');
          const matExpPanelHeader = matExpPanel.querySelector('mat-expansion-panel-header');
          matExpPanelHeader.click();
        }
      }
    });
  }

  private timeoutCloseNav() {
    timer( this.getSeconds( 3 ) ).subscribe( _ => this.sidenav.close() );
  }

  private getSeconds( sec: number ): number {
    return sec * 1000;
  }




}
