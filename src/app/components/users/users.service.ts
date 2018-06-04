import { Injectable } from '@angular/core';
import { HttpQueryService } from '../../services/http-query.service';
import { Observable } from 'rxjs/Observable';
import { Iairlines } from '../../interface/iairlines';
import { IcreateUser } from '../../interface/icreate-user';

@Injectable()
export class UsersService {

  constructor( private httpQuery: HttpQueryService ) { }

  getAirlines(): Observable<Iairlines> {
    return this.httpQuery.get( 'web_auth/api/accounts/airlines' );
  }

  createUser( params: IcreateUser ): Observable<Iairlines> {
    return this.httpQuery.post( 'web_auth/api/accounts/', params );
  }

}
