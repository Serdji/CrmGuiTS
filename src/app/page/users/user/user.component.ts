import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IlistUsers } from '../../../interface/ilist-users';
import { UserService } from './user.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { DialogComponent } from '../../../shared/dialog/dialog.component';
import { timer } from 'rxjs/observable/timer';
import { takeWhile } from 'rxjs/operators';
import { ActivityUserService } from '../../../services/activity-user.service';
import { person } from './person';
import * as R from 'ramda';
import { IFoodNode } from '../../../interface/ifood-node';
import { forkJoin, of } from 'rxjs';
import { complexPasswordValidator } from '../../../validators/complexPasswordValidator';

import { untilDestroyed } from 'ngx-take-until-destroy';

@Component( {
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: [ './user.component.styl' ]
} )
export class UserComponent implements OnInit, OnDestroy {

  public dataSource = new MatTreeNestedDataSource<IFoodNode>();

  public user: IlistUsers;
  public progress: boolean;
  public updateUser: FormGroup;
  public updatePassword: FormGroup;
  public formPermission: FormGroup;
  public edit = false;
  public persons: { title: string, ids: number[] }[] = person;

  private loginId: number;

  private paramsReport: { loginId: number, reportsIds: number[] };

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private activityUserService: ActivityUserService,
  ) { }

  ngOnInit() {


    this.initUser();
    this.initFormUser();
    this.initFormPassword();
    this.initFormPermission();
  }


  private initUser() {
    this.progress = true;
    this.route.params
      .pipe( untilDestroyed(this) )
      .subscribe( ( params ) => {
        this.loginId = params.id;
        this.userService.getUser( params.id ).subscribe( ( user: IlistUsers ) => {
          this.user = user;
          this.updateUser.patchValue( user );
          if ( user.claimPermissions ) {
            for ( const claimPermission of user.claimPermissions ) {
              this.formPermission.patchValue( { [ claimPermission.id ]: true } );
            }
          }
          this.checkboxDisabled();
          this.progress = false;
        } );
      } );
  }

  private initFormUser() {
    this.updateUser = this.fb.group( {
      login: [ '', [ Validators.required, Validators.minLength( 3 ) ] ],
      email: [ '', [ Validators.email ] ],
      loginName: [ '', [ Validators.required, Validators.minLength( 3 ) ] ],
    } );
  }

  private initFormPassword() {
    this.updatePassword = this.fb.group( {
      newPassword: [ '', [ Validators.required, Validators.minLength( 8 ), complexPasswordValidator ] ],
      confirmPassword: [ '', [ Validators.required, Validators.minLength( 8 ) ] ],
    } );

  }

  private initFormPermission() {
    const formGroup = {};
    const propIds = R.prop( 'ids' );
    const mapIds = R.map( propIds );
    const funcControlConfig = id => formGroup[ id ] = '';
    const mapControlConfig = R.map( funcControlConfig );
    const composeIds = R.compose( mapControlConfig,  R.flatten, mapIds );
    composeIds( this.persons );
    this.formPermission = this.fb.group( formGroup );
  }

  private checkboxDisabled() {
    const arrIds = persons => persons.ids;
    const checkboxArr = R.map( arrIds, this.persons );
    const switchCheckboxPerson = R.map( ids => {
      this.formPermission.get( `${ids[ 1 ]}` )[ this.formPermission.get( `${ids[ 0 ]}` ).value ? 'enable' : 'disable' ]();
      this.formPermission.get( `${ids[ 0 ]}`  ).valueChanges
        .pipe( untilDestroyed(this) )
        .subscribe( value => {
          this.formPermission.get( `${ids[ 1 ]}`  )[ value ? 'enable' : 'disable' ]();
          this.formPermission.get( `${ids[ 1 ]}`  ).patchValue( '' );
        } );
    } );
    switchCheckboxPerson( checkboxArr );
  }

  private windowDialog( messDialog: string, params: string, card: string = '', disableTimer: boolean = false ) {
    this.dialog.open( DialogComponent, {
      data: {
        message: messDialog,
        status: params,
        params: this.loginId,
        card,
      },
    } );
    if ( !disableTimer ) {
      timer( 1500 )
        .pipe( untilDestroyed(this) )
        .subscribe( _ => {
          this.dialog.closeAll();
          this.edit = false;
        } );
    }
  }

  collectObjectReport( event ): void {
    this.paramsReport = {
      loginId: +this.loginId,
      reportsIds: event
    };
  }

  sendFormUser(): void {
    if ( !this.updateUser.invalid ) {
      const params = this.updateUser.getRawValue();
      Object.assign( params, { loginId: this.loginId } );
      this.userService.putUser( params )
        .pipe( untilDestroyed(this) )
        .subscribe( ( user: IlistUsers ) => {
          this.user = user;
          this.windowDialog( 'DIALOG.OK.USER_CHANGED', 'ok' );
        } );
    }
  }

  deleteUser(): void {
    this.windowDialog( `DIALOG.DELETE.USER`, 'delete', 'user', true );
  }

  sendFormPassword(): void {
    if ( !this.updatePassword.invalid ) {
      const params = this.updatePassword.getRawValue();
      Object.assign( params, { loginId: this.loginId } );
      this.userService.putPassword( params )
        .pipe( untilDestroyed(this) )
        .subscribe( _ => this.windowDialog( 'DIALOG.OK.PASSWORD_CHANGED', 'ok' ) );
    }
  }

  sendFormPermission(): void {
    const progressArray = [];
    for ( const key of Object.keys( this.formPermission.getRawValue() ) ) {
      if ( this.formPermission.get( key ).value ) progressArray.push( +key );
    }
    const params = Object.assign( {}, { loginId: +this.loginId, ClaimPermissions: progressArray } );

    const success = _ => {
      if ( this.user.login === localStorage.getItem( 'login' ) ) {
        this.windowDialog( 'DIALOG.ERROR.RIGHTS_FOR_YOU_ACCOUNT', 'error', '', true );
        timer( 5000 )
          .pipe( untilDestroyed(this) )
          .subscribe( _ => {
            this.dialog.closeAll();
            this.activityUserService.logout();
            this.edit = false;
          } );
      } else {
        this.windowDialog( 'DIALOG.OK.USER_RIGHTS_CHANGED', 'ok' );
      }
    };

    const oUpdateClaimPermissions = this.userService.updateClaimPermissions( params ).pipe( untilDestroyed(this) );
    const oSetAdminReports = R.isNil(this.paramsReport) ? of( {} ) : this.userService.setAdminReports( this.paramsReport ).pipe( untilDestroyed(this) );
    const permissionsObservable = forkJoin( oUpdateClaimPermissions, oSetAdminReports );
    permissionsObservable.pipe( untilDestroyed(this) ).subscribe( success );
  }

  toggleEdit(): void {
    this.edit = !this.edit;
  }


  ngOnDestroy(): void {}

}
