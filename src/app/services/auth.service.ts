import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class AuthService {

  constructor( private http: HttpClient ) { }

  getToken( params ): Observable<any> {
    // const options = {
    //   headers: new HttpHeaders().set( 'AirlineCode', environment.AirlineCode ),
    //   params: new HttpParams()
    //     .set( 'login', params.login )
    //     .set( 'password', params.password )
    // };
    return this.http.post( environment.crmApi + '/api2_dev/auth/sign-in', { 'login': params.login, 'password': params.password} );
  }
}
