import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpEvent,
  HttpHandler,
  HttpRequest, HttpErrorResponse, HttpParams, HttpParameterCodec,
} from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { AuthService } from './auth.service';
import 'rxjs/add/observable/throw';
import { catchError, map } from 'rxjs/operators';
import { Itoken } from '../interface/itoken';
import { ActivityUserService } from './activity-user.service';
import { MatDialog } from '@angular/material';
import { throwError, timer } from 'rxjs';
import { Router } from '@angular/router';
import { DialogComponent } from '../shared/dialog/dialog.component';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  private isRefreshingToken: boolean = false;
  private isError500: boolean = false;
  private delay: number = 3000;

  constructor(
    private activityUser: ActivityUserService,
    private auth: AuthService,
    private dialog: MatDialog,
    private router: Router,
  ) {}

  intercept( req: HttpRequest<any>, next: HttpHandler ): Observable<HttpEvent<any>> {
    const idToken: Itoken = JSON.parse( localStorage.getItem( 'paramsToken' ) );
    const AirlineCode = localStorage.getItem( 'AirlineCode' );
    const params = new HttpParams( { encoder: new CustomEncoder(), fromString: req.params.toString() } );
    if ( idToken ) {
      const request = req.clone( {
        params,
        headers: req.headers
          .set( 'Authorization', `Bearer ${idToken.accessToken}` )
          .set( 'AirlineCode', AirlineCode )
      } );
      return next.handle( request )
        .pipe(
          map( res => res ),
          catchError( ( err: HttpErrorResponse ) => {
            switch ( err.status ) {
              case 400:
                this.windowDialog( `Данные введены некорректно!`, 'error' );
                break;
              case 401:
                this.refreshToken( idToken.refreshToken );
                break;
              case 403:
                this.windowDialog( `У Вас недостаточно прав на это действие!`, 'error' );
                break;
              // case 404: this.router.navigate( [ 'crm/404' ] ); break;
              case 500:
                this.windowDialog( `В данный момент сервер не отвечает. Попробуйте перезагрузить приложение и повторить попытку чуть позже или обратитесь в службу технической поддержки.`, 'error' );
                break;
            }
            return throwError( err );
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
            timer( this.delay ).subscribe( _ => this.isRefreshingToken = false );
          }, err => {
            if ( err.status === 401 ) {
              this.activityUser.logout();
              timer( this.delay ).subscribe( _ => this.isRefreshingToken = false );
            }
          }
        );
    }
  }

  private windowDialog( messDialog: string, params: string ) {
    if ( !this.isError500 ) {
      this.dialog.open( DialogComponent, {
        data: {
          message: messDialog,
          status: params,
        },
      } );
      this.isError500 = true;
      timer( this.delay ).subscribe( _ => this.isError500 = false );
    }
  }
}

class CustomEncoder implements HttpParameterCodec {
  encodeKey( key: string ): string {
    return encodeURIComponent( key );
  }

  encodeValue( value: string ): string {
    return encodeURIComponent( value );
  }

  decodeKey( key: string ): string {
    return decodeURIComponent( key );
  }

  decodeValue( value: string ): string {
    return decodeURIComponent( value );
  }
}
