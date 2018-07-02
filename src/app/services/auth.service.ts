import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs/Observable';
import { ParsTokenService } from './pars-token.service';

@Injectable()
export class AuthService {

  constructor(
    private http: HttpClient,
    private parsTokenService: ParsTokenService,
  ) { }

  setToken( params ): Observable<any> {
    const options = {
      headers: new HttpHeaders().set( 'AirlineCode', environment.AirlineCode ),
      params: new HttpParams()
        .set( 'username', params.username )
        .set( 'password', params.password )
        .set( 'grant_type', 'password' ),
    };
    console.log(this.parsTokenService.getParsToken('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJDbGFpbXMiOlsidXNlcnM6cmVhZCIsInVzZXJzOnVwZGF0ZSIsImFuYWx5dGljczpyZWFkIl0sImlzcyI6Im15LWlkZW50aXR5IiwiaWF0IjoxNTMwNTQ2MjA5LCJleHAiOjE1MzA1NDYyNjksImp0aSI6ImNlODcifQ.B1llRGPHZQ61KY6bd5rZXHEvMQQeE1tCkzdg_Ro1m3c'));
    return this.http.post( environment.crmApi + '/api/oauth/token', options.params, { headers: options.headers } );
  }
}
