import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { retry } from 'rxjs/operators';

@Injectable( {
  providedIn: 'root'
} )
export class ContactService {

  constructor( private http: HttpClient ) { }

  addContact( params ): Observable<any> {
    return this.http.post( environment.crmApi + '/crm/contact', params ).pipe( retry( 10 ) );
  }

  getContact( id: number ): Observable<any> {
    return this.http.get( `${environment.crmApi}/crm/customer/${id}/contact` ).pipe( retry( 10 ) );
  }

  deleteContact( contactId: number ): Observable<any> {
    return this.http.delete( `${environment.crmApi}/crm/contact/${contactId}` ).pipe( retry( 10 ) );
  }

}
