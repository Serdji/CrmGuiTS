import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { LocalStorage } from '@ngx-pwa/local-storage';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class AuthService {

  constructor(
    private http: HttpClient,
    private localStorage: LocalStorage,
  ) { }

  setToken( params ): Observable<any> {
    const options = {
      headers: new HttpHeaders().set( 'AirlineCode', environment.AirlineCode ),
      params: new HttpParams()
        .set( 'username', params.username )
        .set( 'password', params.password )
        .set( 'grant_type', 'password' ),
    };
    return this.http.post( environment.crmApi + 'api/oauth/token', options.params, { headers: options.headers } );
  }
}
