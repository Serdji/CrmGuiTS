import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { retry } from 'rxjs/operators';
import { ConfigService } from '../../../../services/config-service.service';

@Injectable( {
  providedIn: 'root'
} )
export class ProfileService {

  public subjectDeleteProfileNames = new Subject();
  public subjectPutProfileNames = new Subject();

  constructor(
    private http: HttpClient,
    private configService: ConfigService
  ) { }

  getProfile( id: number ): Observable<any> {
    return this.http.get( `${this.configService.crmApi}/crm/customer/${id}` ).pipe( retry( 10 ) );
  }

  putProfile( params ): Observable<any> {
    return this.http.put( `${this.configService.crmApi}/crm/customer`, params ).pipe( retry( 10 ) );
  }

  deleteProfile( id: number ): Observable<any> {
    return this.http.delete( `${this.configService.crmApi}/crm/customer/${id}` ).pipe( retry( 10 ) );
  }

  addAddProfile( params ): Observable<any> {
    return this.http.post( `${this.configService.crmApi}/crm/customerName`, params ).pipe( retry( 10 ) );
  }

  getAllProfileNames( id: number ): Observable<any> {
    return this.http.get( `${this.configService.crmApi}/crm/customer/${id}/customerName` ).pipe( retry( 10 ) );
  }

  deleteProfileNames( params ): Observable<any> {
    this.subjectDeleteProfileNames.next();
    const httpOptions = {
      headers: new HttpHeaders( { 'Content-Type': 'application/json' } ), body: params
    };
    return this.http.delete( `${this.configService.crmApi}/crm/customerName/deleteCustomerNames`, httpOptions ).pipe( retry( 10 ) );
  }

  putProfileName( params ): Observable<any> {
    this.subjectPutProfileNames.next();
    return this.http.put( `${this.configService.crmApi}/crm/customerName`, params ).pipe( retry( 10 ) );
  }

}
