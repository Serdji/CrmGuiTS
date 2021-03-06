import { Component, OnDestroy, OnInit } from '@angular/core';
import { ListUsersService } from './list-users.service';
import { takeWhile } from 'rxjs/operators';
import { IlistUsers } from '../../../interface/ilist-users';


import { untilDestroyed } from 'ngx-take-until-destroy';

@Component( {
  selector: 'app-users-search',
  templateUrl: './list-users.component.html',
  styleUrls: [ './list-users.component.styl' ],
} )
export class ListUsersComponent implements OnInit, OnDestroy {

  public users: IlistUsers[];
  public isLoader: boolean = false;



  constructor( private listUsersService: ListUsersService ) { }

  ngOnInit(): void {
    this.initListUsers();
  }

  initListUsers() {
    this.isLoader = true;
    this.listUsersService.getListUsers()
      .pipe( untilDestroyed(this) )
      .subscribe( value => {
        this.users = value;
        this.isLoader = false;
      } );
  }

  ngOnDestroy(): void {}

}
