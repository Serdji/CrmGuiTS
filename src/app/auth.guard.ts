import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { LocalStorage } from '@ngx-pwa/local-storage';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor( private localStorage: LocalStorage ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Observable<boolean> | Promise<boolean> | boolean {
    return new Promise( resolve => {
      this.localStorage.getItem( 'token' ).subscribe( value => {
        if ( value ) resolve( true );
        else resolve( false );
      } );
    } );
  }
}
