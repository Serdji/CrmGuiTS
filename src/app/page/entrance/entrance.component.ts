import { Component, OnInit } from '@angular/core';
import { SidenavService } from '../../shared/layout/sidenav/sidenav.service';
import { IMenu } from '../../interface/imenu';

@Component( {
  selector: 'app-entrance',
  templateUrl: './entrance.component.html',
  styleUrls: [ './entrance.component.styl' ]
} )
export class EntranceComponent implements OnInit {

  public cards: IMenu[];

  constructor( private sidenavService: SidenavService ) { }

  ngOnInit() {
    this.cards = this.sidenavService.menu;
    this.sidenavService.closesAccord();
  }

  openLink(): void {
    this.sidenavService.openAccord();
  }

}
