import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { retry } from 'rxjs/operators';
import { environment } from '../../../../../environments/environment';

@Injectable( {
  providedIn: 'root'
} )
export class ProfileService {

  public subjectDeleteProfileNames = new Subject();
  public subjectPutProfileNames = new Subject();

  constructor( private http: HttpClient ) { }

  getProfile( id: number ): Observable<any> {
    return this.http.get( `${environment.crmApi}/crm/customer/${id}` ).pipe( retry( 10 ) );
  }

  putProfile( params ): Observable<any> {
    return this.http.put( `${environment.crmApi}/crm/customer`, params ).pipe( retry( 10 ) );
  }

  deleteProfile( id: number ): Observable<any> {
    return this.http.delete( `${environment.crmApi}/crm/customer/${id}` ).pipe( retry( 10 ) );
  }

  addAdditionalProfile( params ): Observable<any> {
    return this.http.post( `${environment.crmApi}/crm/customerName`, params ).pipe( retry( 10 ) );
  }

  getAllProfileNames( id: number ): Observable<any> {
    return this.http.get( `${environment.crmApi}/crm/customer/${id}/customerName` ).pipe( retry( 10 ) );
  }

  deleteProfileNames( params ): Observable<any> {
    this.subjectDeleteProfileNames.next();
    const httpOptions = {
      headers: new HttpHeaders( { 'Content-Type': 'application/json' } ), body: params
    };
    return this.http.delete( `${environment.crmApi}/crm/customerName/deleteCustomerNames`, httpOptions ).pipe( retry( 10 ) );
  }

  putProfileName( params ): Observable<any> {
    this.subjectPutProfileNames.next();
    return this.http.put( `${environment.crmApi}/crm/customerName`, params ).pipe( retry( 10 ) );
  }

}
