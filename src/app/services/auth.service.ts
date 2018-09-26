import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class AuthService {

  constructor( private http: HttpClient ) { }

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
