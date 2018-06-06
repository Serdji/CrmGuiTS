import { Injectable } from '@angular/core';
import { fromEvent } from 'rxjs/observable/fromEvent';
import { Router } from '@angular/router';

@Injectable()
export class ActivityUserService {

  private isActive: boolean = true;

  constructor(
    private router: Router,
  ) { }

  logout() {
    localStorage.clear();
    this.router.navigate( [ '' ] );
  }

  idleLogout() {
    let t;
    const resetTimer = () => {
      clearTimeout( t );
      t = setTimeout( _ => { this.logout(); }, this.getMinutes( 15 ) );  // time is in milliseconds
    };


    fromEvent(document, 'load').subscribe( _ => resetTimer() );
    fromEvent(document, 'mousemove').subscribe( _ => resetTimer() );
    fromEvent(document, 'mousedown').subscribe( _ => resetTimer() );
    fromEvent(document, 'click').subscribe( _ => resetTimer() );
    fromEvent(document, 'scroll').subscribe( _ => resetTimer() );
    fromEvent(document, 'keypress').subscribe( _ => resetTimer() );
  }


  private getMinutes( min: number ): number {
    return min * ( 60 * 1000 );
  }

}
