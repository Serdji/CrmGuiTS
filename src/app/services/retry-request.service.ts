import { Injectable } from '@angular/core';
import { retryWhen, takeWhile, tap } from 'rxjs/operators';
import { timer } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RetryRequestService {

  private count: number = 0;

  constructor() { }

  retry() {
    return retryWhen( errors => {
      return errors
        .pipe(
          tap( err => {
            if ( err.status === 401 ) {
              this.count++;
              if ( this.count <= 10 ) {
                timer(500).subscribe(  _ => this.count = 0 );
              }
              return err;
            } else {
              throw err;
            }
          } ),
          takeWhile( _ => this.count <= 10 )
        );
    } );
  }

}
