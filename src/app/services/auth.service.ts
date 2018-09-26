import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs/Observable';
import { ConfigService } from './config-service.service';

@Injectable()
export class AuthService {


  constructor(
    private http: HttpClient,
    private configService: ConfigService
  ) { }

  private AirlineCode = localStorage.getItem( 'AirlineCode' );

  private getConfigApi(): string {
    if ( environment.production ) return this.configService.getConfig().crmApi;
    else return environment.crmApi;
  }

  getToken( params ): Observable<any> {
    const options = {
      headers: new HttpHeaders().set( 'AirlineCode', params.AirlineCode ),
      params: {
        'login': params.login,
        'password': params.password,
      }
    };
    return this.http.post( this.getConfigApi() + '/auth/sign-in', options.params, { headers: options.headers } );
  }

  refreshToken( refreshToken: string ): Observable<any> {
    const options = {
      headers: new HttpHeaders().set( 'AirlineCode', this.AirlineCode ),
    };
    return this.http.post( this.getConfigApi() + '/auth/refresh-token', { refreshToken }, { headers: options.headers } );
  }

  revokeRefreshToken( refreshToken: string ): Observable<any> {
    const options = {
      headers: new HttpHeaders().set( 'AirlineCode', this.AirlineCode )
    };
    return this.http.post( this.getConfigApi() + '/auth/revoke-refreshtoken', { refreshToken }, { headers: options.headers } );
  }

}
