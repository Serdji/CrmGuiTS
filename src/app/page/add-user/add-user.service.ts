import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { IcreateUser } from '../../interface/icreate-user';

@Injectable()
export class AddUserService {

  constructor( private httpQuery: HttpClient ) { }

  getAirlines(): Observable<any> {
    return this.httpQuery.get( environment.crmApi + '/web_auth/api/accounts/airlines' );
  }

  createUser( params: IcreateUser ): Observable<any> {
    return this.httpQuery.post( environment.crmApi + '/web_auth/api/accounts/', params );
  }

}
