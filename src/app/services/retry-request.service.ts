import { Injectable } from '@angular/core';
import { retryWhen, takeWhile, tap } from 'rxjs/operators';
import { timer } from 'rxjs';

@Injectable( {
  providedIn: 'root'
} )
export class RetryRequestService {

  private count: number = 0;
  private maxCount: number = 20;
  private timer: number = 10000;

  constructor() { }

  retry() {
    return retryWhen( errors => {
      return errors
        .pipe(
          tap( err => {
            if ( err.status === 401 ) {
              this.count++;
              if ( this.count <= this.maxCount ) {
                timer( this.timer ).subscribe( _ => this.count = 0 );
              }
              return err;
            } else {
              throw err;
            }
          } ),
          takeWhile( _ => this.count <= this.maxCount )
        );
    } );
  }
}
