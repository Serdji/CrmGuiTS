import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable()
export class UsersSearchService {

  constructor( private http: HttpClient ) { }

  getUserSearch( params: string ): Observable<any> {
    return this.http.get( environment.crmApi + '/web_auth/api/accounts/users' + params );
  }

}
