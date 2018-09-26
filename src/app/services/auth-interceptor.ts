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
import { catchError, map } from 'rxjs/operators';
import { Itoken } from '../interface/itoken';
import { ActivityUserService } from './activity-user.service';
import { MatDialog } from '@angular/material';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  private counter: number = 0;

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
            if ( err.status === 401 ) {
              ++this.counter;
              if ( this.counter >= 10 ) {
                this.activityUser.logout();
                this.counter = 0;
              }
              this.auth.refreshToken( idToken.refreshToken )
                .subscribe( ( value: Itoken ) => {
                    localStorage.setItem( 'paramsToken', JSON.stringify( value ) );
                    this.counter = 0;
                  }
                );
            }
            return Observable.throw( err );
          } )
        );
    } else {
      return next.handle( req );
    }
  }
}
