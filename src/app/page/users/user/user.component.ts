import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IlistUsers } from '../../../interface/ilist-users';
import { UserService } from './user.service';
import { emailValidator } from '../../../validators/emailValidator';
import { FormBuilder, FormControl, FormArray, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { DialogComponent } from '../../../shared/dialog/dialog.component';
import { timer } from 'rxjs/observable/timer';
import { takeWhile } from 'rxjs/operators';
import { IclaimPermission } from '../../../interface/iclaim-permission';

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
  private isActive = true;

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private fb: FormBuilder,
    private dialog: MatDialog,
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
      .pipe( takeWhile( _ => this.isActive ) )
      .subscribe( ( params ) => {
        this.loginId = params.id;
        this.userService.getUser( params.id ).subscribe( ( user: IlistUsers ) => {
          this.user = user;
          this.updateUser.patchValue( user );
          for ( const claimPermission of user.claimPermissions ) {
            this.formPermission.patchValue( { [ claimPermission.id ]: true } );
          }
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
      3: ''
    } );
  }

  private windowDialog( messDialog: string, paramss: string ) {
    this.dialog.open( DialogComponent, {
      data: {
        message: messDialog,
        status: paramss,
      },
    } );
    timer( 1500 )
      .pipe( takeWhile( _ => this.isActive ) )
      .subscribe( _ => {
        this.dialog.closeAll();
        this.edit = false;
      } );
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
      .subscribe( _ => this.windowDialog( 'Права пользователя изменены', 'ok' ) );
  }

  toggleEdit(): void {
    this.edit = !this.edit;
  }

  ngOnDestroy() {
    this.isActive = false;
  }

}
