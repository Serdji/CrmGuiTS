import { Injectable } from '@angular/core';
import { retryWhen, takeWhile, tap } from 'rxjs/operators';
import { timer } from 'rxjs';

@Injectable( {
  providedIn: 'root'
} )
export class RetryRequestService {

  private isActive: boolean = true;
  private timer: number = 5000;

  constructor() { }

  retry() {
    return retryWhen( errors => {
      return errors
        .pipe(
          tap( err => {
            if ( err.status === 401 ) {
              timer( this.timer ).subscribe( _ => {
                this.isActive = false;
                timer( this.timer ).subscribe( _ => this.isActive = true );
              } );
              return err;
            } else {
              throw err;
            }
          } ),
          takeWhile( _ => this.isActive )
        );
    } );
  }
}
