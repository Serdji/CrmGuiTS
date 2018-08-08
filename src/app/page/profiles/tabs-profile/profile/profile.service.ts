import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { retry } from 'rxjs/operators';
import { environment } from '../../../../../environments/environment';

@Injectable( {
  providedIn: 'root'
} )
export class ProfileService {

  constructor( private http: HttpClient ) { }

  getProfile( id: number ): Observable<any> {
    return this.http.get( `${environment.crmApi}/crm/customer/${id}` ).pipe( retry( 10 ) );
  }

  putProfile( params ): Observable<any> {
    return this.http.put( `${environment.crmApi}/crm/customer`, params ).pipe( retry( 10 ) );
  }

  deleteProfile( id: number ) {
    return this.http.delete( `${environment.crmApi}/crm/customer/${id}` ).pipe( retry( 10 ) );
  }

  addAdditionaProfile( params ) {
    return this.http.post( `${environment.crmApi}/crm/customerName`, params ).pipe( retry( 10 ) );
  }

}
