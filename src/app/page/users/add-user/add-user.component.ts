import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AddUserService } from './add-user.service';
import { takeWhile } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { timer } from 'rxjs/observable/timer';
import { DialogComponent } from '../../../shared/dialog/dialog.component';
import { IlistUsers } from '../../../interface/ilist-users';
import { Router } from '@angular/router';
import { complexPasswordValidator } from '../../../validators/complexPasswordValidator';

@Component( {
  selector: 'app-users',
  templateUrl: './add-user.component.html',
  styleUrls: [ './add-user.component.styl' ],
} )
export class AddUserComponent implements OnInit, OnDestroy {

  public formUser: FormGroup;
  private isActive: boolean = true;

  constructor(
    private fb: FormBuilder,
    private addUserService: AddUserService,
    private dialog: MatDialog,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.initForm();
  }


  private initForm() {
    this.formUser = this.fb.group( {
      login: [ '', [ Validators.required, Validators.minLength( 3 ) ] ],
      password: [ '', [ Validators.required, Validators.minLength( 8 ), complexPasswordValidator ] ],
      confirmPassword: [ '', [ Validators.required, Validators.minLength( 8 ) ] ],
      email: [ '', [ Validators.email ] ],
      loginName: [ '', [ Validators.required, Validators.minLength( 3 ) ] ],
    });
  }

  resetForm() {
    this.formUser.reset();
    for ( const formControlName in this.formUser.value ) {
      this.formUser.get( `${formControlName}` ).setErrors( null );
    }
  }

  sendForm(): void {
    if ( !this.formUser.invalid ) {
      this.addUserService.createUser( this.formUser.getRawValue() )
        .pipe( takeWhile( _ => this.isActive ) )
        .subscribe(
          ( user: IlistUsers ) => {
            this.dialog.open( DialogComponent, {
              data: {
                message: 'Пользователь успешно добавлен',
                status: 'ok',
              },
            } );
            this.resetForm();
            timer( 1500 )
              .pipe( takeWhile( _ => this.isActive ) )
              .subscribe( _ => {
                this.router.navigate( [ `/crm/user/${user.loginId}` ] );
                this.dialog.closeAll();
              } );
          },
        );
    }
  }

  clearForm(): void {
    this.resetForm();
  }

  ngOnDestroy(): void {
    this.isActive = false;
  }

}
