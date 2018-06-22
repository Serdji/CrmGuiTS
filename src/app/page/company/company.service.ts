import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { IcreateCompany } from '../../interface/icreate-company';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable()
export class CompanyService {

  constructor(private httpQuery: HttpClient) { }

  getAirlines(): Observable<any> {
    return this.httpQuery.get( environment.crmApi + '/web_auth/api/accounts/airlines' );
  }

  createCompany( params: IcreateCompany ): Observable<any> {
    return this.httpQuery.post( environment.crmApi + '/web_auth/api/accounts/airline/create', params );
  }

}
