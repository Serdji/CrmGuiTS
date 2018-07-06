import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../../../environments/environment';

@Injectable( {
  providedIn: 'root'
} )
export class UserService {

  constructor( private http: HttpClient ) { }

  getUser( id ): Observable<any> {
    return this.http.get( `${environment.crmApi}/admin/user/${id}` );
  }

  putUser( params ): Observable<any> {
    return this.http.put( `${environment.crmApi}/admin/user`, params );
  }

  putPassword( params ): Observable<any> {
    return this.http.put( `${environment.crmApi}/admin/user/update-password`, params );
  }

}