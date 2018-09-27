import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { retry } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ConfigService } from '../../../../services/config-service.service';

@Injectable( {
  providedIn: 'root'
} )
export class DocumentService {

  public subjectDeleteDocuments = new Subject();
  public subjectPutDocuments = new Subject();

  constructor(
    private http: HttpClient,
    private configService: ConfigService
  ) { }

  getDocuments( id: number ): Observable<any> {
    return this.http.get( `${this.configService.crmApi}/crm/customer/${id}/document` ).pipe( retry( 1 ) );
  }

  getDocumentTypes(): Observable<any> {
    return this.http.get( `${this.configService.crmApi}/crm/documentType` ).pipe( retry( 1 ) );
  }

  putDocument( params ): Observable<any> {
    this.subjectPutDocuments.next();
    return this.http.put( `${this.configService.crmApi}/crm/document`, params ).pipe( retry( 1 ) );
  }

  deleteDocuments( params ): Observable<any> {
    this.subjectDeleteDocuments.next();
    const httpOptions = {
      headers: new HttpHeaders( { 'Content-Type': 'application/json' } ), body: params
    };
    return this.http.delete( `${this.configService.crmApi}/crm/document/deleteDocuments`, httpOptions ).pipe( retry( 1 ) );
  }

  addDocument( params ): Observable<any> {
    return this.http.post( `${this.configService.crmApi}/crm/document`, params ).pipe( retry( 1 ) );
  }

}
