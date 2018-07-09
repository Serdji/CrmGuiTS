import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IlistUsers } from '../../../interface/ilist-users';
import { UserService } from './user.service';
import { emailValidator } from '../../../validators/emailValidator';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { DialogComponent } from '../../../shared/dialog/dialog.component';
import { timer } from 'rxjs/observable/timer';

@Component( {
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: [ './user.component.styl' ]
} )
export class UserComponent implements OnInit {

  public user: IlistUsers;
  public progress: boolean;
  public updateUser: FormGroup;
  public updatePassword: FormGroup;
  public edit: boolean = false;

  private loginId: number;

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
  }

  private initUser() {
    this.progress = true;
    this.route.params.subscribe( ( params ) => {
      this.loginId = params.id;
      this.userService.getUser( params.id ).subscribe( ( user: IlistUsers ) => {
        this.user = user;
        this.updateUser.patchValue( user );
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

  private windowDialog( messDialog: string, paramss: string ) {
    this.dialog.open( DialogComponent, {
      data: {
        message: messDialog,
        status: paramss,
      },
    } );
    timer( 1500 ).subscribe( _ => {
      this.dialog.closeAll();
      this.edit = false;
    } );
  }

  sendFormUser(): void {
    if ( !this.updateUser.invalid ) {
      const params = this.updateUser.getRawValue();
      Object.assign( params, { loginId: this.loginId } );
      this.userService.putUser( params ).subscribe( ( user: IlistUsers ) => {
        this.user = user;
        this.windowDialog( 'Пользователь успешно изменен', 'ok' );
      } );
    }
  }

  sendFormPassword(): void {
    if ( !this.updatePassword.invalid ) {
      const params = this.updatePassword.getRawValue();
      Object.assign( params, { loginId: this.loginId } );
      this.userService.putPassword( params ).subscribe( _ => this.windowDialog( 'Пароль успешно изменен', 'ok' ) );
    }
  }

  toggleEdit(): void {
    this.edit = !this.edit;
  }

}
