import { Injectable } from '@angular/core';
import { fromEvent } from 'rxjs/observable/fromEvent';
import { Router } from '@angular/router';
import { takeWhile } from 'rxjs/operators';

@Injectable()
export class ActivityUserService {

  constructor(
    private router: Router,
  ) { }

  logout() {
    localStorage.removeItem('saveSeismic');
    localStorage.removeItem('paramsToken');
    localStorage.removeItem('login');
    this.router.navigate( [ '' ] );
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

}
