import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IlistUsers } from '../../../interface/ilist-users';
import { UserService } from './user.service';
import { emailValidator } from '../../../validators/emailValidator';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { DialogComponent } from '../../../shared/dialog/dialog.component';
import { timer } from 'rxjs/observable/timer';
import { takeWhile } from 'rxjs/operators';
import { ActivityUserService } from '../../../services/activity-user.service';

@Component( {
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: [ './user.component.styl' ]
} )
export class UserComponent implements OnInit, OnDestroy {

  public user: IlistUsers;
  public progress: boolean;
  public updateUser: FormGroup;
  public updatePassword: FormGroup;
  public formPermission: FormGroup;
  public edit = false;

  private loginId: number;
  private isActive: boolean;

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
      email: [ '', [ emailValidator ] ],
      loginName: [ '', [ Validators.required, Validators.minLength( 3 ) ] ],
    }, {
      updateOn: 'submit',
    } );
  }

  private initFormPassword() {
    this.updatePassword = this.fb.group( {
      newPassword: [ '', [ Validators.required, Validators.minLength( 6 ) ] ],
      confirmPassword: [ '', [ Validators.required, Validators.minLength( 6 ) ] ],
    }, {
      updateOn: 'submit',
    } );
  }

  private initFormPermission() {
    this.formPermission = this.fb.group( {
      1: '',
      2: '',
      3: '',
      4: '',
      5: '',
      6: '',
      7: '',
      8: '',
    } );
  }

  private checkboxDisabled() {
    this.formPermission.get( '2' )[ this.formPermission.get( '1' ).value ? 'enable' : 'disable' ]();
    this.formPermission.get( '1' ).valueChanges
      .pipe( takeWhile( _ => this.isActive ) )
      .subscribe( value => {
        this.formPermission.get( '2' )[ value ? 'enable' : 'disable' ]();
        this.formPermission.get( '2' ).patchValue( '' );
      } );

    this.formPermission.get( '4' )[ this.formPermission.get( '3' ).value ? 'enable' : 'disable' ]();
    this.formPermission.get( '3' ).valueChanges
      .pipe( takeWhile( _ => this.isActive ) )
      .subscribe( value => {
        this.formPermission.get( '4' )[ value ? 'enable' : 'disable' ]();
        this.formPermission.get( '4' ).patchValue( '' );
      } );

    this.formPermission.get( '6' )[ this.formPermission.get( '5' ).value ? 'enable' : 'disable' ]();
    this.formPermission.get( '5' ).valueChanges
      .pipe( takeWhile( _ => this.isActive ) )
      .subscribe( value => {
        this.formPermission.get( '6' )[ value ? 'enable' : 'disable' ]();
        this.formPermission.get( '6' ).patchValue( '' );
      } );

    this.formPermission.get( '8' )[ this.formPermission.get( '7' ).value ? 'enable' : 'disable' ]();
    this.formPermission.get( '7' ).valueChanges
      .pipe( takeWhile( _ => this.isActive ) )
      .subscribe( value => {
        this.formPermission.get( '8' )[ value ? 'enable' : 'disable' ]();
        this.formPermission.get( '8' ).patchValue( '' );
      } );
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
    this.windowDialog( `Вы действительно хотите удалить пользователя "${ this.user.login }" ?`, 'delete', 'user', true );
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
    this.userService.updateClaimPermissions( params )
      .pipe( takeWhile( _ => this.isActive ) )
      .subscribe( _ => {
        if ( this.user.login === localStorage.getItem( 'login' ) ) {
          this.windowDialog( 'Вы изменили права для своей учетной записи. Что бы права вступили в силу Вам нужно зайти в приложение зонного. Через несколько секунд Вы будите перенаправлены на страницу авторизации!', 'error', '', true );
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
      } );
  }

  toggleEdit(): void {
    this.edit = !this.edit;
  }

  ngOnDestroy(): void {
    this.isActive = false;
  }

}
