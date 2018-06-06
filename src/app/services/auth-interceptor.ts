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

  constructor(  private auth: AuthService ) {}

  intercept( req: HttpRequest<any>, next: HttpHandler ): Observable<HttpEvent<any>> {
    const idToken: Itoken = JSON.parse(localStorage.getItem('token'));
    if ( idToken ) {
      const request = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${idToken.access_token}` )
      });
      return next.handle(request)
        .pipe(
          map(res => res),
          catchError((err: HttpErrorResponse) => {
            if (err.status === 401) {
              localStorage.removeItem('token');
              const user = JSON.parse(localStorage.getItem('user'));
              this.auth.setToken(user).subscribe( (value: Itoken) => localStorage.setItem( 'token', JSON.stringify(value)) );
            }
            return Observable.throw(err);
          })
        );
    } else {
      return next.handle(req);
    }
  }
}
