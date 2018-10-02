import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpEvent,
  HttpHandler,
  HttpRequest, HttpErrorResponse,
} from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { AuthService } from './auth.service';
import 'rxjs/add/observable/throw';
import { catchError, delay, finalize, map } from 'rxjs/operators';
import { Itoken } from '../interface/itoken';
import { ActivityUserService } from './activity-user.service';
import { MatDialog } from '@angular/material';
import { timer } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  private isRefreshingToken: boolean = false;

  constructor(
    private activityUser: ActivityUserService,
    private auth: AuthService,
    private dialog: MatDialog,
  ) {}

  intercept( req: HttpRequest<any>, next: HttpHandler ): Observable<HttpEvent<any>> {
    const idToken: Itoken = JSON.parse( localStorage.getItem( 'paramsToken' ) );
    const AirlineCode = localStorage.getItem( 'AirlineCode' );
    if ( idToken ) {
      const request = req.clone( {
        headers: req.headers
          .set( 'Authorization', `Bearer ${idToken.accessToken}` )
          .set( 'AirlineCode', AirlineCode )
      } );
      return next.handle( request )
        .pipe(
          map( res => res ),
          catchError( ( err: HttpErrorResponse ) => {
            if ( err.status === 401 ) this.refreshToken( idToken.refreshToken );
            return Observable.throw( err );
          } )
        );
    } else {
      return next.handle( req );
    }
  }

  private refreshToken( refreshToken ) {
    if ( !this.isRefreshingToken ) {
      this.isRefreshingToken = true;
      this.auth.refreshToken( refreshToken )
        .subscribe(
          data => {
            localStorage.setItem( 'paramsToken', JSON.stringify( data ) );
            timer( 500 ).subscribe( _=> this.isRefreshingToken = false );
          }, err => {
            if ( err.status === 401 ) this.activityUser.logout();
          }
        );
    }
  }

}
