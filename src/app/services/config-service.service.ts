import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable( {
  providedIn: 'root'
} )
export class ConfigService {

  private appConfig;

  constructor( private http: HttpClient ) { }

  loadAppConfig() {
    return this.http.get( 'assets/config.json' )
      .toPromise()
      .then( data => {
        this.appConfig = data;
      } );
  }

  get config() {
    return this.appConfig;
  }

  get crmApi(): string {
    return environment.production ? this.config.crmApi : environment.crmApi;
  }
}