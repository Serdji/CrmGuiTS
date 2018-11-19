import { Injectable } from '@angular/core';
import { map, retryWhen, takeWhile } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RetryRequestService {

  constructor() { }

  retry() {
    return retryWhen( errors => {
      return errors
        .pipe(
          map( err => {
            if ( err.status === 401 ) {
              return err;
            } else {
              return null;
            }
          } ),
          takeWhile( err => err )
        );
    } );
  }

}
