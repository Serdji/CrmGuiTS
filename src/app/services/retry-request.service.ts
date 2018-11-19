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
          map( value => {
            if ( value.status === 401 ) {
              return value;
            } else {
              return null;
            }
          } ),
          takeWhile( value => value )
        );
    } );
  }

}
