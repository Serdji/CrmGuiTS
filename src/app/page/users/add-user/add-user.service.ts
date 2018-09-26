import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { IcreateUser } from '../../../interface/icreate-user';
import { retry } from 'rxjs/operators';

@Injectable()
export class AddUserService {

  constructor( private http: HttpClient ) { }

  createUser( params: IcreateUser ): Observable<any> {
    return this.http.post( environment.crmApi + '/admin/user', params ).pipe( retry( 10 ) );
  }

}
