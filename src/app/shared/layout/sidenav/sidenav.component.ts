import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivityUserService } from '../../../services/activity-user.service';
import { timer } from 'rxjs/observable/timer';
import { IMenuLink } from '../../../interface/imenu-link';
import { MatSidenav } from '@angular/material/sidenav';
import { LayoutService } from '../layout.service';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.styl']
})
export class SidenavComponent implements OnInit {

  @ViewChild( 'sidenav' ) sidenav: MatSidenav;

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
    private layoutService: LayoutService
    ) { }

  ngOnInit(): void {
    this.timeoutCloseNav();
    this.activityUser.idleLogout();
    this.layoutService.subjectToggle.subscribe( _ => this.sidenav.toggle() );
  }

  private timeoutCloseNav() {
    timer( this.getSeconds( 3 ) ).subscribe( _ => this.sidenav.close() );
  }

  private getSeconds( sec: number ): number {
    return sec * 1000;
  }




}
