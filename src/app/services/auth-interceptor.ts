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
import { catchError, delay, map } from 'rxjs/operators';
import { Itoken } from '../interface/itoken';
import { timer } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor( private auth: AuthService ) {}

  intercept( req: HttpRequest<any>, next: HttpHandler ): Observable<HttpEvent<any>> {
    const idToken: Itoken = JSON.parse( localStorage.getItem( 'paramsToken' ) );
    const AirlineCode = JSON.parse( localStorage.getItem( 'AirlineCode' ) );
    if ( idToken ) {
      const request = req.clone( {
        headers: req.headers
          .set( 'Authorization', `Bearer ${idToken.accessToken}` )
          // .set( 'Authorization', `Bearer 13` )
          .set( 'AirlineCode', AirlineCode )
      } );
      return next.handle( request )
        .pipe(
          map( res => res ),
          catchError( ( err: HttpErrorResponse ) => {
            if ( err.status === 401 ) {
              const user = JSON.parse( localStorage.getItem( 'paramsToken' ) );
              timer(1000).subscribe( _ => {
                this.auth.refreshToken( user.refreshToken )
                  .subscribe( ( value: Itoken ) => {
                    localStorage.setItem( 'paramsToken', JSON.stringify( value ) );
                  } );
              });
            }
            return Observable.throw( err );
          } )
        );
    } else {
      return next.handle( req );
    }
  }
}
