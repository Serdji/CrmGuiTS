import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { retry } from 'rxjs/operators';
import { ConfigService } from '../../../../services/config-service.service';

@Injectable( {
  providedIn: 'root'
} )
export class ContactService {

  public subjectDeleteContact = new Subject();
  public subjectPutContact = new Subject();

  constructor(
    private http: HttpClient,
    private configService: ConfigService
  ) { }

  addContact( params ): Observable<any> {
    return this.http.post( this.configService.crmApi + '/crm/contact', params ).pipe( retry( 10 ) );
  }

  getContact( id: number ): Observable<any> {
    return this.http.get( `${this.configService.crmApi}/crm/customer/${id}/contact` ).pipe( retry( 10 ) );
  }

  deleteContact( contactId: number ): Observable<any> {
    return this.http.delete( `${this.configService.crmApi}/crm/contact/${contactId}` ).pipe( retry( 10 ) );
  }

  deleteContacts( params ): Observable<any> {
    this.subjectDeleteContact.next();
    const httpOptions = {
      headers: new HttpHeaders( { 'Content-Type': 'application/json' } ), body: params
    };
    return this.http.delete( `${this.configService.crmApi}/crm/contact/deleteContacts`, httpOptions ).pipe( retry( 10 ) );
  }

  putContact( params ): Observable<any>  {
    this.subjectPutContact.next();
    return this.http.put( `${this.configService.crmApi}/crm/contact`, params ).pipe( retry( 10 ) );
  }

  getContactType(): Observable<any> {
    return this.http.get( `${this.configService.crmApi}/crm/contactType` ).pipe( retry( 10 ) );
  }

}











