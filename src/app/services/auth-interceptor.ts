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

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor( private auth: AuthService ) {}

  intercept( req: HttpRequest<any>, next: HttpHandler ): Observable<HttpEvent<any>> {
    const idToken: Itoken = JSON.parse( localStorage.getItem( 'paramsToken' ) );
    if ( idToken ) {
      const request = req.clone( {
        headers: req.headers.set( 'Authorization', `${idToken.accessToken}` )
      } );
      return next.handle( request )
        .pipe(
          map( res => res ),
          catchError( ( err: HttpErrorResponse ) => {
            if ( err.status === 401 ) {
              // localStorage.removeItem('paramsToken');
              // const user = JSON.parse(localStorage.getItem('paramsUser'));
              // this.auth.getToken(user).subscribe( (value: Itoken) => localStorage.setItem( 'paramsToken', JSON.stringify(value)) );
            }
            return Observable.throw( err );
          } )
        );
    } else {
      return next.handle( req );
    }
  }
}
