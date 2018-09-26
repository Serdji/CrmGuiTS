import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs/Observable';
import { LoginService } from '../page/login/login.service';
import { delay, take } from 'rxjs/operators';

@Injectable()
export class AuthService {

  constructor(
    private http: HttpClient,
    private loginService: LoginService
  ) {
    console.log(1);
    this.loginService.getUrlApi().pipe(delay(20)).subscribe( value => console.log( value ) );
  }

  private AirlineCode = localStorage.getItem( 'AirlineCode' );

  getToken( params ): Observable<any> {
    const options = {
      headers: new HttpHeaders().set( 'AirlineCode', params.AirlineCode ),
      params: {
        'login': params.login,
        'password': params.password,
      }
    };
    return this.http.post( environment.crmApi + '/auth/sign-in', options.params, { headers: options.headers } );
  }

  refreshToken( refreshToken: string ): Observable<any> {
    const options = {
      headers: new HttpHeaders().set( 'AirlineCode', this.AirlineCode ),
    };
    return this.http.post( environment.crmApi + '/auth/refresh-token', { refreshToken }, { headers: options.headers } );
  }

  revokeRefreshToken( refreshToken: string ): Observable<any> {
    const options = {
      headers: new HttpHeaders().set( 'AirlineCode', this.AirlineCode )
    };
    return this.http.post( environment.crmApi + '/auth/revoke-refreshtoken', { refreshToken }, { headers: options.headers } );
  }

}
