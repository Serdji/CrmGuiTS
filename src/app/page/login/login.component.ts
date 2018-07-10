import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { takeWhile } from 'rxjs/operators';
import { LoginService } from './login.service';
import { ParsTokenService } from '../../services/pars-token.service';

@Component( {
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: [ './login.component.styl' ],
} )
export class LoginComponent implements OnInit, OnDestroy {

  public version: string;
  public isErrorAuth: boolean = false;
  public formLogin: FormGroup;
  private isActive: boolean = true;
  private saveTableLogin: boolean;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private loginService: LoginService,
    private parsTokenService: ParsTokenService,
  ) { }

  ngOnInit(): void {
    this.initFormGroup();
    this.initVersion();
    this.saveLogin();
    if ( JSON.parse( localStorage.getItem( 'paramsToken' ) ) ) this.router.navigate( [ 'crm' ] );
  }

  private initFormGroup() {
    this.formLogin = this.fb.group( {
      login: [ '', [ Validators.required ] ],
      password: [ '', [ Validators.required ] ],
      AirlineCode: [ '', [ Validators.required ] ],
      save: [ '' ],
    }, {
      updateOn: 'submit',
    } );
    const AirlineCode =  localStorage.getItem( 'AirlineCode' );
    if ( AirlineCode ) {
      this.formLogin.get( 'AirlineCode' ).patchValue( AirlineCode );
    }
  }

  private initVersion() {
    this.loginService.getVersion()
      .pipe( takeWhile( _ => this.isActive ) )
      .subscribe( ( value: string ) => this.version = `2.0.0.${value}` );
  }

  private saveLogin() {
    this.formLogin.get( 'save' ).valueChanges.subscribe( value => {
      this.saveTableLogin = value;
      if ( value ) localStorage.setItem( 'saveSeismic', JSON.stringify( this.saveTableLogin ) );
      else localStorage.removeItem( 'saveSeismic' );
    } );
  }

  sendForm(): void {
    if ( !this.formLogin.invalid ) {
      localStorage.setItem( 'AirlineCode', this.formLogin.get( 'AirlineCode' ).value );
      this.auth.getToken( this.formLogin.getRawValue() )
        .pipe( takeWhile( _ => this.isActive ) )
        .subscribe(
          ( value ) => {
            this.parsTokenService.parsToken = value.accessToken;
            localStorage.setItem( 'login', this.formLogin.get( 'login' ).value );
            localStorage.setItem( 'paramsToken', JSON.stringify( value ) );
            if ( JSON.parse( localStorage.getItem( 'paramsToken' ) ) ) this.router.navigate( [ 'crm' ] );
          },
          _ => this.isErrorAuth = true
        );
    }
  }


  ngOnDestroy(): void {
    this.isActive = false;
  }
}
