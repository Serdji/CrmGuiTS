import { Injectable, OnDestroy, OnInit } from '@angular/core';
import { fromEvent } from 'rxjs/observable/fromEvent';
import { Router } from '@angular/router';
import { takeWhile } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable()
export class ActivityUserService implements OnInit, OnDestroy {

  private isActive: boolean;

  constructor(
    private auth: AuthService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.isActive = true;
  }

  logout() {
    const token = JSON.parse( localStorage.getItem( 'paramsToken' ) );
    this.auth.revokeRefreshToken( token.refreshToken ).pipe( takeWhile( _ => this.isActive ) ).subscribe();
    localStorage.removeItem( 'saveSeismic' );
    localStorage.removeItem( 'paramsToken' );
    localStorage.removeItem( 'login' );
    this.router.navigate( [ '' ] );
    location.reload();
  }

  idleLogout() {
    let t;
    const resetTimer = () => {
      clearTimeout( t );
      t = setTimeout( _ => {
        if ( !JSON.parse( localStorage.getItem( 'saveSeismic' ) ) ) this.logout();
      }, this.getMinutes( 15 ) );  // time is in milliseconds
    };

    fromEvent( document, 'load' ).pipe( takeWhile( _ => !JSON.parse( localStorage.getItem( 'saveSeismic' ) ) ) ).subscribe( _ => resetTimer() );
    fromEvent( document, 'mousemove' ).pipe( takeWhile( _ => !JSON.parse( localStorage.getItem( 'saveSeismic' ) ) ) ).subscribe( _ => resetTimer() );
    fromEvent( document, 'mousedown' ).pipe( takeWhile( _ => !JSON.parse( localStorage.getItem( 'saveSeismic' ) ) ) ).subscribe( _ => resetTimer() );
    fromEvent( document, 'click' ).pipe( takeWhile( _ => !JSON.parse( localStorage.getItem( 'saveSeismic' ) ) ) ).subscribe( _ => resetTimer() );
    fromEvent( document, 'scroll' ).pipe( takeWhile( _ => !JSON.parse( localStorage.getItem( 'saveSeismic' ) ) ) ).subscribe( _ => resetTimer() );
    fromEvent( document, 'keypress' ).pipe( takeWhile( _ => !JSON.parse( localStorage.getItem( 'saveSeismic' ) ) ) ).subscribe( _ => resetTimer() );
  }


  private getMinutes( min: number ): number {
    return min * ( 60 * 1000 );
  }

  ngOnDestroy(): void {
    this.isActive = false;
  }

}
