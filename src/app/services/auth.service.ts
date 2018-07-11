import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class AuthService {

  constructor( private http: HttpClient ) { }

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
    return this.http.post( environment.crmApi + '/auth/refresh-token', { refreshToken } );
  }

  revokeRefreshToken( revokeRefreshToken: string ): Observable<any> {
    return this.http.post( environment.crmApi + '/auth/revoke-refreshtoken', { revokeRefreshToken } );
  }

}
