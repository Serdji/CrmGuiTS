import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { ConfigService } from '../../../../services/config-service.service';
import { RetryRequestService } from '../../../../services/retry-request.service';

@Injectable( {
  providedIn: 'root'
} )
export class ContactService {

  public subjectDeleteContact = new Subject();
  public subjectPutContact = new Subject();

  constructor(
    private http: HttpClient,
    private configService: ConfigService,
    private retryRequestService: RetryRequestService
  ) { }

  addContact( params ): Observable<any> {
    return this.http.post( this.configService.crmApi + '/crm/contact', params ).pipe( this.retryRequestService.retry() );
  }

  getContact( id: number ): Observable<any> {
    return this.http.get( `${this.configService.crmApi}/crm/customer/${id}/contact` ).pipe( this.retryRequestService.retry() );
  }

  deleteContact( contactId: number ): Observable<any> {
    return this.http.delete( `${this.configService.crmApi}/crm/contact/${contactId}` ).pipe( this.retryRequestService.retry() );
  }

  deleteContacts( params ): Observable<any> {
    this.subjectDeleteContact.next();
    const httpOptions = {
      headers: new HttpHeaders( { 'Content-Type': 'application/json' } ), body: params
    };
    return this.http.delete( `${this.configService.crmApi}/crm/contact/deleteContacts`, httpOptions ).pipe( this.retryRequestService.retry() );
  }

  putContact( params, isSubjectNext: boolean = true ): Observable<any> {
    if ( isSubjectNext ) this.subjectPutContact.next();
    return this.http.put( `${this.configService.crmApi}/crm/contact`, params ).pipe( this.retryRequestService.retry() );
  }

  getContactType(): Observable<any> {
    return this.http.get( `${this.configService.crmApi}/crm/contactType` ).pipe( this.retryRequestService.retry() );
  }

}











