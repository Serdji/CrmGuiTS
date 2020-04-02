import { Component, OnInit } from '@angular/core';
import { ActivityUserService } from '../../../services/activity-user.service';
import { LayoutService } from '../layout.service';
import { TranslateService } from '@ngx-translate/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { untilDestroyed } from 'ngx-take-until-destroy';

@Component( {
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: [ './toolbar.component.styl' ]
} )
export class ToolbarComponent implements OnInit {

  public login;

  constructor(
    private activityUser: ActivityUserService,
    private layoutService: LayoutService,
    public translate: TranslateService,
    private fb: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.login = localStorage.getItem( 'login' );
  }

  goOut(): void {
    this.activityUser.logout();
    localStorage.setItem( 'goOut', 'true' );
  }

  sidenavToggle(): void {
    this.layoutService.toggle();
  }

}
