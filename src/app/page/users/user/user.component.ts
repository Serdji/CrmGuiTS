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

  private checkboxArr: number[];
  private loginId: number;
  private isActive: boolean;
  private paramsReport: { loginId: number, reportsIds: number[] };

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private activityUserService: ActivityUserService,
  ) { }

  ngOnInit() {
    this.isActive = true;

    this.initUser();
    this.initFormUser();
    this.initFormPassword();
    this.initFormPermission();
  }


  private initUser() {
    this.progress = true;
    this.route.params
      .pipe( takeWhile( _ => this.isActive ) )
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
    const funcCheckboxArr = arrIds => this.checkboxArr = arrIds;
    const tapCheckboxArr = R.tap( funcCheckboxArr );
    const composeIds = R.compose( mapControlConfig, tapCheckboxArr, R.flatten, mapIds );
    composeIds( this.persons );
    this.formPermission = this.fb.group( formGroup );
  }

  private checkboxDisabled() {
    R.map( id => {
      if ( id % 2 === 0 ) {
        this.formPermission.get( `${id}` )[ this.formPermission.get( `${id - 1}` ).value ? 'enable' : 'disable' ]();
        this.formPermission.get( `${id - 1}` ).valueChanges
          .pipe( takeWhile( _ => this.isActive ) )
          .subscribe( value => {
            this.formPermission.get( `${id}` )[ value ? 'enable' : 'disable' ]();
            this.formPermission.get( `${id}` ).patchValue( '' );
          } );
      }
    }, this.checkboxArr );
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
        .pipe( takeWhile( _ => this.isActive ) )
        .subscribe( _ => {
          this.dialog.closeAll();
          this.edit = false;
        } );
    }
  }

  collectObjectReport( event ): void {
    console.log( this.paramsReport );
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
        .pipe( takeWhile( _ => this.isActive ) )
        .subscribe( ( user: IlistUsers ) => {
          this.user = user;
          this.windowDialog( 'Пользователь успешно изменен', 'ok' );
        } );
    }
  }

  deleteUser(): void {
    this.windowDialog( `Вы действительно хотите удалить пользователя "${this.user.login}" ?`, 'delete', 'user', true );
  }

  sendFormPassword(): void {
    if ( !this.updatePassword.invalid ) {
      const params = this.updatePassword.getRawValue();
      Object.assign( params, { loginId: this.loginId } );
      this.userService.putPassword( params )
        .pipe( takeWhile( _ => this.isActive ) )
        .subscribe( _ => this.windowDialog( 'Пароль успешно изменен', 'ok' ) );
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
        this.windowDialog( 'Вы изменили права для своей учетной записи. Чтобы права вступили в силу Вам нужно зайти в приложение заново. Через несколько секунд Вы будете перенаправлены на страницу авторизации!', 'error', '', true );
        timer( 5000 )
          .pipe( takeWhile( _ => this.isActive ) )
          .subscribe( _ => {
            this.dialog.closeAll();
            this.activityUserService.logout();
            this.edit = false;
          } );
      } else {
        this.windowDialog( 'Права пользователя изменены', 'ok' );
      }
    };

    const oUpdateClaimPermissions = this.userService.updateClaimPermissions( params ).pipe( takeWhile( _ => this.isActive ) );
    const oSetAdminReports = R.isNil(this.paramsReport) ? of( {} ) : this.userService.setAdminReports( this.paramsReport ).pipe( takeWhile( _ => this.isActive ) );
    const permissionsObservable = forkJoin( oUpdateClaimPermissions, oSetAdminReports );
    permissionsObservable.pipe( takeWhile( _ => this.isActive ) ).subscribe( success );
  }

  toggleEdit(): void {
    this.edit = !this.edit;
  }


  ngOnDestroy(): void {
    this.isActive = false;
  }

}
