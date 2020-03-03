import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, Subject, throwError } from 'rxjs';
import { catchError, shareReplay } from 'rxjs/operators';
import { ConfigService } from '../../../../services/config-service.service';
import { Router } from '@angular/router';
import { RetryRequestService } from '../../../../services/retry-request.service';
import { Iprofile } from '../../../../interface/iprofile';

@Injectable( {
  providedIn: 'root'
} )
export class ProfileService {

  public subjectDeleteProfileNames = new Subject();
  public subjectPutProfileNames = new Subject();
  public subjectGetProfile = new BehaviorSubject([]);

  constructor(
    private http: HttpClient,
    private configService: ConfigService,
    private retryRequestService: RetryRequestService,
    private router: Router,
  ) { }

  getProfile( id: number ) {
    return this.http.get<Iprofile>( `${this.configService.crmApi}/crm/customer/${id}` )
      .pipe(
        this.retryRequestService.retry(),
        catchError( (err: any) => {
          switch ( err.status ) {
            case 404: this.router.navigate( [ 'crm/404' ] ); break;
          }
          return throwError(err);
        } ),
        shareReplay()
      );
  }

  putProfile( params ): Observable<any> {
    return this.http.put( `${this.configService.crmApi}/crm/customer`, params ).pipe( this.retryRequestService.retry() );
  }

  deleteProfile( id: number ): Observable<any> {
    return this.http.delete( `${this.configService.crmApi}/crm/customer/${id}` ).pipe( this.retryRequestService.retry() );
  }

  addAddProfile( params ): Observable<any> {
    return this.http.post( `${this.configService.crmApi}/crm/customerName`, params ).pipe( this.retryRequestService.retry() );
  }

  getAllProfileNames( id: number ): Observable<any> {
    return this.http.get( `${this.configService.crmApi}/crm/customer/${id}/customerName` ).pipe( this.retryRequestService.retry() );
  }

  deleteProfileNames( params ): Observable<any> {
    this.subjectDeleteProfileNames.next();
    const httpOptions = {
      headers: new HttpHeaders( { 'Content-Type': 'application/json' } ), body: params
    };
    return this.http.delete( `${this.configService.crmApi}/crm/customerName/deleteCustomerNames`, httpOptions ).pipe( this.retryRequestService.retry() );
  }

  putProfileName( params ): Observable<any> {
    this.subjectPutProfileNames.next();
    return this.http.put( `${this.configService.crmApi}/crm/customerName`, params ).pipe( this.retryRequestService.retry() );
  }

}
