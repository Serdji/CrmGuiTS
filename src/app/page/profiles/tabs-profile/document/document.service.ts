import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ConfigService } from '../../../../services/config-service.service';
import { RetryRequestService } from '../../../../services/retry-request.service';

@Injectable( {
  providedIn: 'root'
} )
export class DocumentService {

  public subjectDeleteDocuments = new Subject();
  public subjectPutDocuments = new Subject();

  constructor(
    private http: HttpClient,
    private configService: ConfigService,
    private retryRequestService: RetryRequestService
  ) { }

  getDocuments( id: number ): Observable<any> {
    return this.http.get( `${this.configService.crmApi}/crm/customer/${id}/document` ).pipe( this.retryRequestService.retry() );
  }

  getDocumentTypes(): Observable<any> {
    return this.http.get( `${this.configService.crmApi}/crm/documentType` ).pipe( this.retryRequestService.retry() );
  }

  putDocument( params ): Observable<any> {
    this.subjectPutDocuments.next();
    return this.http.put( `${this.configService.crmApi}/crm/document`, params ).pipe( this.retryRequestService.retry() );
  }

  deleteDocuments( params ): Observable<any> {
    this.subjectDeleteDocuments.next();
    const httpOptions = {
      headers: new HttpHeaders( { 'Content-Type': 'application/json' } ), body: params
    };
    return this.http.delete( `${this.configService.crmApi}/crm/document/deleteDocuments`, httpOptions ).pipe( this.retryRequestService.retry() );
  }

  addDocument( params ): Observable<any> {
    return this.http.post( `${this.configService.crmApi}/crm/document`, params ).pipe( this.retryRequestService.retry() );
  }

}
