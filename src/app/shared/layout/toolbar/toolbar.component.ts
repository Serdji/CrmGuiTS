import { Component, OnInit } from '@angular/core';
import { ActivityUserService } from '../../../services/activity-user.service';
import { LayoutService } from '../layout.service';
import { TranslateService } from '@ngx-translate/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component( {
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: [ './toolbar.component.styl' ]
} )
export class ToolbarComponent implements OnInit {

  public formLang: FormGroup;
  public login;

  constructor(
    private activityUser: ActivityUserService,
    private layoutService: LayoutService,
    private translate: TranslateService,
    private fb: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.login = localStorage.getItem( 'login' );
    this.initFormLang();
    this.switchLang();
  }

  private initFormLang() {
    this.formLang = this.fb.group( {
      lang: ''
    } );
    this.translate.get( 'MENU' ).subscribe( _ => {
      this.formLang.get( 'lang' ).patchValue( this.translate.store.currentLang );
    } );
  }

  private switchLang() {
    this.formLang.get( 'lang' ).valueChanges.subscribe( ( lang: string ) => this.translate.use( lang ) );
  }

  goOut(): void {
    this.activityUser.logout();
    localStorage.setItem( 'goOut', 'true' );
  }

  sidenavToggle(): void {
    this.layoutService.toggle();
  }

}