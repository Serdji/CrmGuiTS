import { Injectable } from '@angular/core';
import { retryWhen, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RetryRequestService {

  constructor() { }

  retry() {
    return retryWhen( errors => {
      return errors
        .pipe(
          tap( err => {
            if ( err.status === 401 ) {
              return err;
            } else {
              throw err;
            }
          } )
        );
    } );
  }

}
