import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { retry } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { Iprofile } from '../../../interface/iprofile';

@Injectable( {
  providedIn: 'root'
} )
export class ProfileService {

  constructor( private http: HttpClient ) { }

  getProfile( id: number ): Observable<any> {
    return this.http.get( `${environment.crmApi}/crm/customer/${id}` ).pipe( retry( 10 ) );
  }

  putProfile( params: Iprofile ): Observable<any> {
    return this.http.put( `${environment.crmApi}/crm/customer`, params ).pipe( retry( 10 ) );
  }

}
