import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IlistUsers } from '../../../interface/ilist-users';
import { UserService } from './user.service';

@Component( {
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: [ './user.component.styl' ]
} )
export class UserComponent implements OnInit {

  public user: IlistUsers;
  public progress: boolean;

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
  ) { }

  ngOnInit() {
    this.initUser();
  }

  private initUser() {
    this.progress = true;
    this.route.params.subscribe( (params: string) => {
      this.userService.getUser(params.id).subscribe( (user: IlistUsers) => {
        this.user = user;
        this.progress = false;
      } );
    });
  }

}
