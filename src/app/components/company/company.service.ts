import { Injectable } from '@angular/core';
import { HttpQueryService } from '../../services/http-query.service'
import { Iairlines } from '../../interface/iairlines';
import { Observable } from 'rxjs/Observable';
import { IcreateCompany } from '../../interface/icreate-company';

@Injectable()
export class CompanyService {

  constructor(private httpQuery: HttpQueryService) { }

  getAirlines(): Observable<Iairlines> {
    return this.httpQuery.get( 'web_auth/api/accounts/airlines' );
  }

  createCompany( params: IcreateCompany ): Observable<Iairlines> {
    return this.httpQuery.post( '/web_auth/api/accounts/airline/create', params );
  }

}
