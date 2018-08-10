import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { retry } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable( {
  providedIn: 'root'
} )
export class DocumentService {

  public subjectDeleteDocuments = new Subject();
  public subjectPutDocuments = new Subject();

  constructor( private http: HttpClient ) { }

  getDocuments( id: number ): Observable<any> {
    return this.http.get( `${environment.crmApi}/crm/customer/${id}/document` ).pipe( retry( 10 ) );
  }

  putDocument( params ): Observable<any> {
    this.subjectPutDocuments.next();
    return this.http.put( `${environment.crmApi}/crm/document`, params ).pipe( retry( 10 ) );
  }

  deleteDocuments( params ): Observable<any> {
    this.subjectDeleteDocuments.next();
    const httpOptions = {
      headers: new HttpHeaders( { 'Content-Type': 'application/json' } ), body: params
    };
    return this.http.delete( `${environment.crmApi}/crm/document/deleteDocuments`, httpOptions ).pipe( retry( 10 ) );
  }

  addDocument( params ): Observable<any> {
    return this.http.post( `${environment.crmApi}/crm/document`, params ).pipe( retry( 10 ) );
  }

}
