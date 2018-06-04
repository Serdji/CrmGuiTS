import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { LocalStorage } from '@ngx-pwa/local-storage';
import { AuthService } from './auth.service';
import { Subject } from 'rxjs/Subject';
import { Itoken } from '../interface/itoken';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class HttpQueryService {

  private headers: HttpHeaders;
  private subjectGetQuery = new Subject();
  private subjectGetWithOptionsQuery = new Subject();
  private subjectPostQuery = new Subject();

  constructor(
    private http: HttpClient,
    private localStorage: LocalStorage,
    private auth: AuthService,
  ) { }

  getWithOptions( url: string, params: string ): Observable<any> {
    this.localStorage.getItem( 'token' ).subscribe( ( token: Itoken ) => {
      this.headers = new HttpHeaders().set( 'Authorization',
        `Bearer ${token.access_token}` );
      this.http.get( environment.crmApi + url + params, { headers: this.headers } )
        .subscribe(
          value => this.subjectGetWithOptionsQuery.next( value ),
          error => {
            if ( error.status === 401 ) {
              this.localStorage.getItem( 'user' ).subscribe( user => {
                this.auth.setToken( user ).subscribe( ( newToken: Itoken ) => {
                  this.localStorage.setItem( 'token', newToken ).subscribe();
                  this.headers = new HttpHeaders().set( 'Authorization',
                    `Bearer ${newToken.access_token}` );
                  this.http.get( environment.crmApi + url + params, { headers: this.headers } )
                    .subscribe( data => this.subjectGetWithOptionsQuery.next( data ) );
                } );
              } );
            } else {
              this.subjectGetWithOptionsQuery.next( error );
            }
          },
        );
    } );
    return this.subjectGetWithOptionsQuery;
  }

  get( url: string ): Observable<any> {
    this.localStorage.getItem( 'token' ).subscribe( ( token: Itoken ) => {
      this.headers = new HttpHeaders().set( 'Authorization',
        `Bearer ${token.access_token}` );
      this.http.get( environment.crmApi + url, { headers: this.headers } )
        .subscribe(
          value => this.subjectGetQuery.next( value ),
          error => {
            if ( error.status === 401 ) {
              this.localStorage.getItem( 'user' ).subscribe( user => {
                this.auth.setToken( user ).subscribe( ( newToken: Itoken ) => {
                  this.localStorage.setItem( 'token', newToken ).subscribe();
                  this.headers = new HttpHeaders().set( 'Authorization',
                    `Bearer ${newToken.access_token}` );
                  this.http.get( environment.crmApi + url, { headers: this.headers } )
                    .subscribe( data => this.subjectGetQuery.next( data ) );
                } );
              } );
            } else {
              this.subjectGetQuery.next( error );
            }
          },
        );
    } );
    return this.subjectGetQuery;
  }

  post( url: string, params: any ): Observable<any> {
    this.localStorage.getItem( 'token' ).subscribe( ( token: Itoken ) => {
      this.headers = new HttpHeaders().set( 'Authorization',
        `Bearer ${token.access_token}` );
      this.http.post( environment.crmApi + url, params, { headers: this.headers } )
        .subscribe(
          value => this.subjectPostQuery.next( value ),
          error => {
            if ( error.status === 401 ) {
              this.localStorage.getItem( 'user' ).subscribe( user => {
                this.auth.setToken( user ).subscribe( ( newToken: Itoken ) => {
                  this.localStorage.setItem( 'token', newToken ).subscribe();
                  this.headers = new HttpHeaders().set( 'Authorization',
                    `Bearer ${newToken.access_token}` );
                  this.http.post( environment.crmApi + url, params,
                    { headers: this.headers } )
                    .subscribe( data => this.subjectPostQuery.next( data ) );
                } );
              } );
            } else {
              this.subjectPostQuery.next( error );
            }
          },
        );
    } );
    return this.subjectPostQuery;
  }
}
